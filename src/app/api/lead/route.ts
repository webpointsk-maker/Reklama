import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { STEPS, DISQUALIFYING } from "@/lib/form-config";
import { scoreLead, KATEGORIA } from "@/lib/scoring";
import { posliDoN8n } from "@/lib/n8n";
import { mailLead, mailTeam, type LeadSummary } from "@/lib/notify";
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

/**
 * Preco lead nejde na telefonat — kluc je "krok:moznost".
 *
 * Bez tohto by Petrovi prisiel e-mail s nalepkou "Nevhodný" a ziadnym
 * vysvetlenim. Takto vidi dovod a vie sa rozhodnut sam.
 */
const DISQ_REASON: Record<string, string> = {
  "start:later": "zatiaľ len zisťuje možnosti, začať nechce",
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

  // Pri nevhodnom leade je dovod dolezitejsi nez skore — pisemy ho prvy.
  const disqNote = !result.qualified
    ? DISQUALIFYING.filter((r) => answers[r.step] === r.option)
        .map((r) => DISQ_REASON[`${r.step}:${r.option}`])
        .filter(Boolean)
        .join(" · ")
    : "";

  const poznamka = disqNote ? `Nevolať — ${disqNote}` : "";

  // Odoslanie do n8n je jedina cast, ktora nesmie ticho zlyhat — z neho
  // vznika zaznam v NocoDB aj e-mail Petrovi. Ked zlyha, cely zaznam
  // skonci v logu, odkial sa da vytiahnut rucne.
  await posliDoN8n({
    druh: "lead",
    leadId,
    cas: new Date().toISOString(),
    stav: "Nový",
    skore: result.score,
    pasmo: result.band,
    kategoria: KATEGORIA[result.band],
    ozvatSaDo: result.contactWithinMinutes
      ? `${result.contactWithinMinutes} min`
      : "neozývať sa",
    kvalifikovany: result.qualified,
    meno: summary.name,
    telefon: summary.phone,
    email: summary.email,
    profil: summary.social,
    kedyVolat: summary.callTime,
    ciel: labels["Cieľ"],
    uroven: labels["Úroveň"],
    frekvencia: labels["Frekvencia"],
    kedyZacat: labels["Kedy začať"],
    coSkusal: (answers.note ?? "").slice(0, 500),
    poznamka,
    zdroj: req.headers.get("referer") ?? "",
  });

  await Promise.allSettled([
    mailLead(summary, result.qualified),
    mailTeam(summary),
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

  return NextResponse.json({
    qualified: result.qualified,
    band: result.band,
    // Prehliadac ho posiela Mete ako hodnotu udalosti Lead — rovnaku,
    // aku posiela Conversions API, aby sa obe cesty dali spárovať.
    score: result.score,
  });
}
