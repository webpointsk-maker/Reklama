import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { STEPS, DISQUALIFYING } from "@/lib/form-config";
import { scoreLead, KATEGORIA } from "@/lib/scoring";
import { posliDoN8n } from "@/lib/n8n";
import { mailLead, mailTeam, type LeadSummary } from "@/lib/notify";
import { sendCapiEvent } from "@/lib/meta";
import { normalizePhone } from "@/lib/phone";

export const runtime = "nodejs";

/**
 * Chyby validacie sa vracaju S NAZVOM POLA, aby formular vedel ukazat,
 * co presne je zle. Predtym prisla iba "neplatné údaje" a clovek videl
 * "Odoslanie sa nepodarilo" — nevedel, co opravit, a odisiel.
 */
const schema = z.object({
  leadId: z.string().min(1).max(64),
  faza: z.enum(["kontakt", "doplnenie", "dokoncene"]),
  answers: z.record(z.string(), z.string().max(200)),
  contact: z.object({
    name: z.string().trim().min(2).max(120),
    phone: z
      .string()
      .max(40)
      .refine((v) => normalizePhone(v) !== null),
    consent: z.literal(true),
  }),
  /** pasca na boty — clovek ju nevidi, takze ju nevyplni */
  hp: z.string().max(300).optional().default(""),
});

/** Prevod ID moznosti na citatelny text pre tabulku a e-mail. */
function labelFor(stepId: string, optionId?: string): string {
  if (!optionId) return "—";
  const step = STEPS.find((s) => s.id === stepId);
  return step?.options?.find((o) => o.id === optionId)?.label ?? optionId;
}

/**
 * Preco lead nejde na telefonat — kluc je "krok:moznost".
 *
 * Takych leadov zadavatel NECHCE: formular cloveka po tejto odpovedi
 * dalej nepusti a ukaze mu stranku /dakujeme-nesedi. Jeho cislo uz ale
 * v tabulke je (kontakt je na druhom kroku), preto tu musi jasne stat,
 * ze sa mu volat nema.
 */
const DISQ_REASON: Record<string, string> = {
  "start:later": "NEVOLAŤ — zatiaľ sa len obzerá, formulár ho ďalej nepustil",
};

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "neplatné údaje" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const field = parsed.error.issues[0]?.path.at(-1);
    return NextResponse.json(
      { error: "neplatné údaje", field: typeof field === "string" ? field : null },
      { status: 400 },
    );
  }

  const { leadId, faza, answers, contact, hp } = parsed.data;

  // Bot vyplnil skryte pole. Tvarime sa, ze vsetko prebehlo — nech to
  // neskusa znova inak — ale nikam nic neposielame.
  if (hp) {
    console.warn("[lead] pasca na boty zachytila odoslanie:", leadId);
    return NextResponse.json({ qualified: true, band: "C", score: 0 });
  }

  const phone = normalizePhone(contact.phone)!;
  const result = scoreLead(answers);

  const labels = {
    "Cieľ": labelFor("goal", answers.goal),
    "Frekvencia": labelFor("frequency", answers.frequency),
    "Kedy začať": labelFor("start", answers.start),
  };

  /**
   * POZNAMKA: dovod pasma D, alebo ze formular este nie je dokonceny.
   *
   * Chladnym (pasmo C) trener vola tiez — nalepka povie, s akym
   * ocakavanim. "Nevolať" stoji iba pri pasme D, vid DISQ_REASON.
   */
  const disqNote = !result.qualified
    ? DISQUALIFYING.filter((r) => answers[r.step] === r.option)
        .map((r) => DISQ_REASON[`${r.step}:${r.option}`])
        .filter(Boolean)
        .join(" · ")
    : "";

  const poznamka = [
    faza !== "dokoncene" ? "formulár nedokončil" : "",
    disqNote,
  ]
    .filter(Boolean)
    .join(" · ");

  const summary: LeadSummary = {
    leadId,
    name: contact.name,
    phone,
    email: "",
    social: "",
    // vyber casu hovoru z formulara zmizol — Peter vola kedykolvek
    callTime: "kedykoľvek",
    blocker: poznamka,
    score: result.score,
    band: result.band,
    labels,
  };

  /**
   * LEAD IDE DO n8n VIACKRAT: po zadani kontaktu ("kontakt"), po kazdej
   * dalsej odpovedi ("doplnenie") a na konci formulara ("dokoncene").
   *
   * Kontakt je vo formulari na druhom kroku a zvysok je nepovinny, takze
   * lead musi odist hned po zadani telefonu. Kto neskor oznaci "Zatiaľ sa
   * len obzerám", formular skonci a lead sa prepise na pasmo D s poznamkou
   * NEVOLAŤ.
   *
   * Obe fazy posielaju ten isty leadId. n8n ho musi AKTUALIZOVAT, nie
   * pridat ako novy riadok. Vid komentar v src/lib/n8n.ts.
   *
   * Odoslanie do n8n nesmie ticho zlyhat — z neho vznika zaznam v NocoDB
   * aj e-mail Petrovi. Ked zlyha, cely zaznam skonci v logu, odkial sa da
   * vytiahnut rucne.
   */
  await posliDoN8n({
    druh: "lead",
    faza,
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
    email: "",
    profil: "",
    kedyVolat: summary.callTime,
    ciel: labels["Cieľ"],
    uroven: "",
    frekvencia: labels["Frekvencia"],
    kedyZacat: labels["Kedy začať"],
    coSkusal: "",
    poznamka,
    zdroj: req.headers.get("referer") ?? "",
  });

  const metaBase = {
    phone,
    clientIp: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
    userAgent: req.headers.get("user-agent") ?? undefined,
    fbp: req.cookies.get("_fbp")?.value,
    fbc: req.cookies.get("_fbc")?.value,
    sourceUrl: req.headers.get("referer") ?? undefined,
  };

  await Promise.allSettled([
    // Zalozny e-mail trenerovi cez Resend — iba raz, pri zadani kontaktu.
    faza === "kontakt" ? mailTeam(summary) : Promise.resolve(),
    faza === "dokoncene" && result.qualified
      ? mailLead(summary, true)
      : Promise.resolve(),

    // "Contact" = zadal telefon. Zaklad pre retargeting, ide kazdemu.
    // eventID sa zhoduje s tym v prehliadaci (QualForm), Meta ich sparuje.
    faza === "kontakt"
      ? sendCapiEvent({ eventName: "Contact", eventId: `${leadId}-contact`, ...metaBase })
      : Promise.resolve(),

    // "Lead" IBA pri kvalifikovanom a dokoncenom — na tuto udalost sa
    // optimalizuje reklama, preto do nej nesmu tiect ti, co filtrom neprešli.
    faza === "dokoncene" && result.qualified
      ? sendCapiEvent({
          eventName: "Lead",
          eventId: leadId,
          ...metaBase,
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
