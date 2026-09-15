import { NextRequest, NextResponse } from "next/server";
import { STEPS } from "@/lib/form-config";
import { posliDoN8n } from "@/lib/n8n";

export const runtime = "nodejs";

/**
 * Priebezne ukladanie rozpracovaneho formulara.
 *
 * Preco to existuje: clovek, ktory vyplnil pat otazok a odisiel, uz o sebe
 * povedal dost na to, aby sa oplatilo ozvat sa mu — ak stihol nechat kontakt.
 *
 * Zaznamy idu do n8n s druhom "rozpracovane". Workflow si ich odlozi inam
 * nez hotove leady a deduplikuje ich po leadId: platny je vzdy posledny.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const leadId = String(body?.leadId ?? "").slice(0, 64);
    if (!leadId) return NextResponse.json({ ok: false }, { status: 400 });

    const answers = (body?.answers ?? {}) as Record<string, string>;
    const contact = (body?.contact ?? {}) as Record<string, string>;

    // Ukladame az od tretej otazky — skorsie odchody nemaju vypovednu hodnotu.
    if (Object.keys(answers).length < 3) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const label = (stepId: string) => {
      const optionId = answers[stepId];
      if (!optionId) return "";
      const step = STEPS.find((s) => s.id === stepId);
      return step?.options?.find((o) => o.id === optionId)?.label ?? optionId;
    };

    await posliDoN8n({
      druh: "rozpracovane",
      leadId,
      cas: new Date().toISOString(),
      odisielNaKroku: String(body?.step ?? ""),
      meno: contact.name ?? "",
      telefon: contact.phone ?? "",
      email: contact.email ?? "",
      profil: contact.social ?? "",
      kedyVolat: contact.callTime ?? "",
      ciel: label("goal"),
      uroven: label("level"),
      frekvencia: label("frequency"),
      kedyZacat: label("start"),
      coSkusal: (answers.note ?? "").slice(0, 500),
      poznamka: "",
      zdroj: req.headers.get("referer") ?? "",
    });
  } catch (err) {
    console.error("[partial] uloženie zlyhalo:", err);
  }

  // Klient na odpoved necaka — vzdy vraciame 200, aby sa formular nezasekol.
  return NextResponse.json({ ok: true });
}
