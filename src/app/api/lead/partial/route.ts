import { NextRequest, NextResponse } from "next/server";
import { STEPS } from "@/lib/form-config";
import { posliDoN8n } from "@/lib/n8n";
import { normalizePhone } from "@/lib/phone";

export const runtime = "nodejs";

/**
 * Ulozenie kontaktu HNED, ako ho clovek napise — este pred odoslanim.
 *
 * Formular sem posiela meno a telefon pri opusteni pola (blur). Kto cislo
 * napise a potom zavrie stranku bez kliknutia na tlacidlo, nie je strateny:
 * zaznam ide do n8n s druhom "rozpracovane". Workflow si ich odlozi inam
 * nez hotove leady a deduplikuje ich po leadId: platny je vzdy posledny.
 *
 * Ukladame iba vtedy, ked je v poli cislo, ktore sa da vytocit. Bez neho
 * sa nemame komu ozvat a zaznam nema cenu.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const leadId = String(body?.leadId ?? "").slice(0, 64);
    if (!leadId) return NextResponse.json({ ok: false }, { status: 400 });

    const answers = (body?.answers ?? {}) as Record<string, string>;
    const contact = (body?.contact ?? {}) as Record<string, string>;

    const phone = normalizePhone(String(contact.phone ?? ""));
    if (!phone || body?.hp) {
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
      odisielNaKroku: String(body?.step ?? "").slice(0, 40),
      meno: String(contact.name ?? "").slice(0, 120),
      telefon: phone,
      email: "",
      profil: "",
      kedyVolat: "kedykoľvek",
      ciel: label("goal"),
      uroven: "",
      frekvencia: label("frequency"),
      kedyZacat: label("start"),
      coSkusal: "",
      poznamka: "",
      zdroj: req.headers.get("referer") ?? "",
    });
  } catch (err) {
    console.error("[partial] uloženie zlyhalo:", err);
  }

  // Klient na odpoved necaka — vzdy vraciame 200, aby sa formular nezasekol.
  return NextResponse.json({ ok: true });
}
