/**
 * Odchodzie notifikacie: e-mail leadovi, e-mail tebe, ping na telefon.
 * Vsetko je volitelne — bez premennych prostredia sa len zaloguje.
 */

import { Resend } from "resend";
import type { Band } from "./scoring";
import { BAND_LABEL } from "./scoring";
import { SITE, TRAINER } from "./content";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM = process.env.MAIL_FROM || "TODO <noreply@TODO.sk>";
const TEAM = process.env.MAIL_TO || "";

export interface LeadSummary {
  leadId: string;
  name: string;
  phone: string;
  email: string;
  social: string;
  callTime: string;
  blocker: string;
  score: number;
  band: Band;
  labels: Record<string, string>;
}

/* ---------------- e-mail leadovi ---------------- */

export async function mailLead(lead: LeadSummary, qualified: boolean) {
  const subject = qualified
    ? "Mám váš formulár — ozvem sa vám dnes"
    : "Ďakujeme za vyplnenie formulára";

  const body = qualified
    ? [
        `Dobrý deň, ${lead.name},`,
        "",
        "ďakujem za vyplnenie formulára. Mám ho a ozvem sa vám ešte dnes na číslo, ktoré ste zadali.",
        "",
        "Hovor trvá zhruba 15 minút a nie je predajný — najprv sa pýtam ja.",
        "Premyslite si prosím jednu vec: ako vyzerá váš bežný týždeň a kedy",
        "reálne máte hodinu voľna. To je jediné, čo potrebujem vedieť, aby som",
        "vám vedel(a) povedať, či a ako vám viem pomôcť.",
        "",
        TRAINER.name,
        SITE.url,
      ].join("\n")
    : [
        `Dobrý deň, ${lead.name},`,
        "",
        "ďakujem za vyplnenie formulára.",
        "",
        "Napísali ste, že si zatiaľ len zisťujete možnosti — preto vám volať nebudem",
        "a nič ďalšie vám posielať nebudem.",
        "",
        "Vedené tréningy dávajú zmysel až vtedy, keď si viete vyhradiť čas pravidelne.",
        "Keď to tak bude, vyplňte formulár znova a nájdem si na vás čas.",
        "",
        TRAINER.name,
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
    `E-mail:    ${lead.email}`,
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

/* ---------------- ping na telefon ---------------- */

/**
 * Najlacnejsie vylepsenie konverzie v celom systeme: pri pasme A a B
 * dostanes upozornenie do minuty, nie az ked si otvoris mail.
 */
export async function pingPhone(lead: LeadSummary) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) {
    console.warn("[telegram] nie je nastavený — notifikácia sa neposlala");
    return;
  }

  const text =
    `🔥 ${lead.band} · ${lead.score}b — ${lead.name}\n` +
    `${lead.phone}\n` +
    `${lead.labels["Cieľ"] ?? ""}\n` +
    `${lead.labels["Úroveň"] ?? ""} · frekvencia ${lead.labels["Frekvencia"] ?? ""}\n` +
    (lead.social ? `${lead.social}\n` : "") +
    `\n"${lead.blocker.slice(0, 200)}"`;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chat, text, disable_web_page_preview: true }),
    });
  } catch (err) {
    console.error("[telegram] odoslanie zlyhalo:", err);
  }
}
