import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { STEPS } from "@/lib/form-config";
import { scoreLead } from "@/lib/scoring";
import { appendRow } from "@/lib/sheets";
import { mailLead, mailTeam, pingPhone, type LeadSummary } from "@/lib/notify";
import { sendCapiEvent } from "@/lib/meta";

export const runtime = "nodejs";

const schema = z.object({
  leadId: z.string().min(1).max(64),
  answers: z.record(z.string(), z.string().max(2000)),
  contact: z.object({
    name: z.string().min(2).max(120),
    phone: z.string().min(6).max(40),
    email: z.string().email().max(160),
    social: z.string().max(300).optional().default(""),
    callTime: z.string().max(40).optional().default("any"),
    consent: z.literal(true),
  }),
});

/** Prevod ID moznosti na citatelny text pre tabulku a e-mail. */
function labelFor(stepId: string, optionId?: string): string {
  if (!optionId) return "—";
  const step = STEPS.find((s) => s.id === stepId);
  return step?.options?.find((o) => o.id === optionId)?.label ?? optionId;
}

const CALL_TIME_LABEL: Record<string, string> = {
  morning: "dopoludnia",
  afternoon: "popoludní",
  evening: "podvečer",
  any: "kedykoľvek",
};

export async function POST(req: NextRequest) {
  let parsed;
  try {
    parsed = schema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "neplatné údaje" }, { status: 400 });
  }

  const { leadId, answers, contact } = parsed;
  const result = scoreLead(answers);

  const labels = {
    "Cieľ": labelFor("goal", answers.goal),
    "Úroveň": labelFor("level", answers.level),
    "Frekvencia": labelFor("frequency", answers.frequency),
    "Kedy začať": labelFor("start", answers.start),
  };

  const summary: LeadSummary = {
    leadId,
    name: contact.name,
    phone: contact.phone,
    email: contact.email,
    social: contact.social ?? "",
    callTime: CALL_TIME_LABEL[contact.callTime ?? "any"] ?? "kedykoľvek",
    blocker: answers.note ?? "",
    score: result.score,
    band: result.band,
    labels,
  };

  const row = [
    new Date().toLocaleString("sk-SK", { timeZone: "Europe/Bratislava" }),
    leadId,
    result.qualified ? "Nový — ozvať sa" : "Nurture",
    result.score,
    result.band,
    result.contactWithinMinutes ? `${result.contactWithinMinutes} min` : "neozývať sa",
    summary.name,
    summary.phone,
    summary.email,
    summary.social,
    summary.callTime,
    labels["Cieľ"],
    labels["Úroveň"],
    labels["Frekvencia"],
    labels["Kedy začať"],
    (answers.note ?? "").slice(0, 500),
    req.headers.get("referer") ?? "",
  ];

  // Zapis do tabulky je jedina cast, ktora nesmie ticho zlyhat.
  try {
    await appendRow(row);
  } catch (err) {
    console.error("[lead] zápis do tabuľky zlyhal:", err, row);
  }

  // Notifikacie a meranie bezia paralelne; ziadna z nich nesmie zhodit odpoved.
  await Promise.allSettled([
    mailLead(summary, result.qualified),
    mailTeam(summary),
    result.band === "A" || result.band === "B" ? pingPhone(summary) : Promise.resolve(),
    result.qualified
      ? sendCapiEvent({
          eventName: "Lead",
          eventId: leadId,
          email: contact.email,
          phone: contact.phone,
          clientIp: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
          userAgent: req.headers.get("user-agent") ?? undefined,
          fbp: req.cookies.get("_fbp")?.value,
          fbc: req.cookies.get("_fbc")?.value,
          sourceUrl: req.headers.get("referer") ?? undefined,
          value: result.score,
        })
      : Promise.resolve(),
  ]);

  return NextResponse.json({ qualified: result.qualified, band: result.band });
}
