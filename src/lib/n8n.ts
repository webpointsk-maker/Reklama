/**
 * Odoslanie leadu do n8n.
 *
 * ARCHITEKTURA: stranka sama nezapisuje do NocoDB ani neposiela e-maily.
 * Posle jeden JSON na webhook a vsetko ostatne — zapis do tabulky,
 * e-mail trenerovi, potvrdenie klientovi — riesi workflow v n8n.
 *
 * PRECO TAKTO: Petrovi uz na tabulke Leady_Peter_Samal bezia dve dalsie
 * automatizacie (pripomienka nekontaktovanych leadov a tlacidla na zmenu
 * stavu priamo z e-mailu). Ked leady zo stranky pristanu v tej istej
 * tabulke, zacnu pre ne platit tiez — bez akejkolvek dalsej prace.
 *
 * ZA CO TO PLATIME: ked je n8n nedostupne, lead sa neulozi nikam. Preto
 * sa neuspech loguje ako chyba (nie warning) a cely zaznam ide do logu,
 * odkial sa da vytiahnut rucne.
 */

/** Co sa posiela: hotovy lead alebo rozpracovany formular. */
export type DruhZaznamu = "lead" | "rozpracovane";

export interface N8nLead {
  druh: DruhZaznamu;
  leadId: string;
  cas: string;
  /** vyplnene len pri druh === "lead" */
  stav?: string;
  skore?: number;
  pasmo?: string;
  /** to iste po ludsky: 🔥 Horúci / ❄️ Chladný */
  kategoria?: string;
  ozvatSaDo?: string;
  kvalifikovany?: boolean;
  /** vyplnene len pri druh === "rozpracovane" */
  odisielNaKroku?: string;

  meno: string;
  telefon: string;
  email: string;
  /** nepovinny odkaz na profil na socialnej sieti */
  profil: string;
  kedyVolat: string;

  ciel: string;
  uroven: string;
  frekvencia: string;
  kedyZacat: string;
  coSkusal: string;

  poznamka: string;
  zdroj: string;
}

const URL_WEBHOOK = process.env.N8N_WEBHOOK_URL;
const TAJOMSTVO = process.env.N8N_WEBHOOK_SECRET;

/**
 * Posle zaznam do n8n. Nikdy nevyhodi vynimku — odpoved pre cloveka
 * vo formulari nesmie zavisiet od toho, ci bezi automatizacia.
 */
export async function posliDoN8n(zaznam: N8nLead): Promise<boolean> {
  if (!URL_WEBHOOK) {
    console.warn(
      "[n8n] N8N_WEBHOOK_URL nie je nastavené — záznam sa neodoslal:",
      JSON.stringify(zaznam),
    );
    return false;
  }

  try {
    const res = await fetch(URL_WEBHOOK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Webhook je verejna adresa. Bez tejto hlavicky by hocikto, kto ju
        // uhadne, mohol Petrovi do tabulky pisat vymyslene leady.
        ...(TAJOMSTVO ? { "x-webhook-secret": TAJOMSTVO } : {}),
      },
      body: JSON.stringify(zaznam),
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      console.error(
        `[n8n] webhook vrátil ${res.status}:`,
        await res.text().catch(() => ""),
        JSON.stringify(zaznam),
      );
      return false;
    }
    return true;
  } catch (err) {
    // Sem sa dostaneme aj pri timeoute. Cely zaznam ide do logu, aby sa
    // dal z Vercel logov vytiahnut rucne — je to posledna zachrana.
    console.error("[n8n] odoslanie zlyhalo:", err, JSON.stringify(zaznam));
    return false;
  }
}
