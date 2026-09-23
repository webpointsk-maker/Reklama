/**
 * Odchodzie e-maily: potvrdenie klientovi a upozornenie trenerovi.
 *
 * ZALOHA, NIE HLAVNA CESTA. E-maily standardne posiela workflow v n8n —
 * tento subor je tu pre pripad, ze by n8n neposielalo. Bez RESEND_API_KEY
 * sa nic neposle, len zaloguje, takze ked posiela n8n, nechaj tu premennu
 * prazdnu — inak pride e-mail dvakrat.
 */

import { Resend } from "resend";
import type { Band } from "./scoring";
import { BAND_LABEL } from "./scoring";
import { SITE, BRAND } from "./content";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM = process.env.MAIL_FROM || "TODO <noreply@TODO.sk>";
const TEAM = process.env.MAIL_TO || "";

export interface LeadSummary {
  leadId: string;
  name: string;
  phone: string;
  /** formular e-mail uz nezbiera — prazdny, ak ho nemame */
  email: string;
  social: string;
  callTime: string;
  /** poznamka pre trenera — dovod diskvalifikacie, nedokonceny formular */
  blocker: string;
  score: number;
  band: Band;
  labels: Record<string, string>;
}

/* ---------------- e-mail leadovi ---------------- */

export async function mailLead(lead: LeadSummary, qualified: boolean) {
  // Formular sa na e-mail nepyta — kym ho lead nema, potvrdenie nema kam ist.
  if (!lead.email) return;

  const subject = qualified
    ? "Máme váš formulár — ozveme sa vám dnes"
    : "Ďakujeme za vyplnenie formulára";

  const body = qualified
    ? [
        `Dobrý deň, ${lead.name},`,
        "",
        "ďakujeme za vyplnenie formulára. Máme ho a ozveme sa vám do 24 hodín na číslo, ktoré ste zadali.",
        "",
        "Hovor trvá zhruba 15 minút a nie je predajný — najprv sa pýtam ja.",
        "Premyslite si prosím jednu vec: ako vyzerá váš bežný týždeň a kedy",
        "reálne máte hodinu voľna. To je jediné, čo potrebujem vedieť, aby som",
        "vám vedel(a) povedať, či a ako vám viem pomôcť.",
        "",
        BRAND.name,
        SITE.url,
      ].join("\n")
    : [
        `Dobrý deň, ${lead.name},`,
        "",
        "ďakujem za vyplnenie formulára.",
        "",
        "Napísali ste, že si zatiaľ len zisťujete možnosti — preto vám volať nebudeme",
        "a nič ďalšie vám posielať nebudem.",
        "",
        "Vedené tréningy dávajú zmysel až vtedy, keď si viete vyhradiť čas pravidelne.",
        "Keď to tak bude, vyplňte formulár znova a nájdeme si na vás čas.",
        "",
        BRAND.name,
        SITE.url,
      ].join("\n");

  await send(lead.email, subject, body);
}

/* ---------------- e-mail tebe ---------------- */

export async function mailTeam(lead: LeadSummary) {
  if (!TEAM) {
    console.warn("[mail] MAIL_TO nie je nastavené — interný e-mail sa neposlal");
    return;
  }

  const subject = `[${lead.band} · ${lead.score}b] ${lead.name}`;

  const body = [
    BAND_LABEL[lead.band],
    "",
    `Meno:      ${lead.name}`,
    `Telefón:   ${lead.phone}`,
    `E-mail:    ${lead.email || "—"}`,
    `Profil:    ${lead.social || "—"}`,
    `Volať:     ${lead.callTime}`,
    "",
    ...Object.entries(lead.labels).map(([k, v]) => `${k.padEnd(10)} ${v}`),
    "",
    "Poznámka:",
    lead.blocker || "—",
    "",
    `Lead ID: ${lead.leadId}`,
  ].join("\n");

  await send(TEAM, subject, body);
}

async function send(to: string, subject: string, text: string) {
  if (!resend) {
    console.warn(`[mail] RESEND_API_KEY chýba — e-mail pre ${to} sa neposlal\n${subject}`);
    return;
  }
  try {
    await resend.emails.send({ from: FROM, to, subject, text });
  } catch (err) {
    console.error("[mail] odoslanie zlyhalo:", err);
  }
}
