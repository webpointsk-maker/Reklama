import { NextRequest, NextResponse } from "next/server";
import { STEPS } from "@/lib/form-config";
import { appendRow, PARTIAL_TAB } from "@/lib/sheets";

export const runtime = "nodejs";

/**
 * Priebezne ukladanie rozpracovaneho formulara.
 *
 * Preco to existuje: clovek, ktory vyplnil sest otazok a odisiel, uz o sebe
 * povedal dost na to, aby sa oplatilo ozvat sa mu — ak stihol nechat kontakt.
 * Bez tohto endpointu by taky lead zmizol bez stopy.
 *
 * Riadky idu do samostatneho harka (PARTIAL_TAB) s vlastnou hlavickou
 * PARTIAL_HEADER — nemiesaju sa teda s hotovymi leadmi. Deduplikacia je po
 * leadId: platny je vzdy posledny riadok s danym ID. Ked bude leadov viac,
 * je to prva vec, ktoru sa oplati presunut do skutocnej databazy.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const leadId = String(body?.leadId ?? "").slice(0, 64);
    if (!leadId) return NextResponse.json({ ok: false }, { status: 400 });

    const answers = (body?.answers ?? {}) as Record<string, string>;
    const contact = (body?.contact ?? {}) as Record<string, string>;

    // Ukladame az od tretej otazky — skorsie odchody nemaju vypovednu hodnotu.
    // (Formular ma 5 krokov, takze to je zhruba polovica cesty.)
    if (Object.keys(answers).length < 3) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    // Rovnaky prevod ID -> text ako v hlavnom endpointe, aby sa harky
    // dali citat vedla seba bez prekladania idcok.
    const label = (stepId: string) => {
      const optionId = answers[stepId];
      if (!optionId) return "";
      const step = STEPS.find((s) => s.id === stepId);
      return step?.options?.find((o) => o.id === optionId)?.label ?? optionId;
    };

    // Poradie musi sediet s PARTIAL_HEADER v src/lib/sheets.ts.
    await appendRow(
      [
        new Date().toLocaleString("sk-SK", { timeZone: "Europe/Bratislava" }),
        leadId,
        String(body?.step ?? ""),
        contact.name ?? "",
        contact.phone ?? "",
        contact.email ?? "",
        label("goal"),
        label("level"),
        label("frequency"),
        label("start"),
        (answers.note ?? "").slice(0, 500),
      ],
      PARTIAL_TAB,
    );
  } catch (err) {
    console.error("[partial] uloženie zlyhalo:", err);
  }

  // Klient na odpoved necaka — vzdy vraciame 200, aby sa formular nezasekol.
  return NextResponse.json({ ok: true });
}
