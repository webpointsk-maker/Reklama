/**
 * Meta Conversions API — odosielanie konverzii zo servera.
 *
 * KLUCOVE PRAVIDLO CELEHO FUNNELU:
 * udalost "Lead" sa posiela IBA pri kvalifikovanom leade (pasmo A/B/C).
 * Ak by sme Mete hlasili kazde odoslanie formulara, algoritmus zacne
 * dorucovat najlacnejsie publikum — teda presne tych, ktorych filtrujeme.
 *
 * Pixel zatial nie je vytvoreny. Kym nie su premenne nastavene,
 * funkcia len zaloguje a nic neposiela.
 */

import { createHash } from "crypto";

const API_VERSION = "v21.0";

function sha256(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

/** Telefon sa hashuje bez medzier a bez znaku +, s predvolbou. */
function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("421")) return digits;
  if (digits.startsWith("0")) return "421" + digits.slice(1);
  return digits;
}

export interface CapiInput {
  eventName: "Lead" | "Purchase" | "InitiateCheckout" | "ViewContent";
  eventId: string;
  email?: string;
  phone?: string;
  clientIp?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
  sourceUrl?: string;
  value?: number;
}

export async function sendCapiEvent(input: CapiInput): Promise<void> {
  const pixelId = process.env.META_PIXEL_ID;
  const token = process.env.META_CAPI_TOKEN;

  if (!pixelId || !token) {
    console.info(`[meta] Pixel nie je nastavený — udalosť ${input.eventName} sa neposlala`);
    return;
  }

  const userData: Record<string, string | string[]> = {};
  if (input.email) userData.em = [sha256(input.email)];
  if (input.phone) userData.ph = [sha256(normalizePhone(input.phone))];
  if (input.clientIp) userData.client_ip_address = input.clientIp;
  if (input.userAgent) userData.client_user_agent = input.userAgent;
  if (input.fbp) userData.fbp = input.fbp;
  if (input.fbc) userData.fbc = input.fbc;

  const payload = {
    data: [
      {
        event_name: input.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: input.eventId, // deduplikacia oproti prehliadacovemu Pixelu
        action_source: "website",
        event_source_url: input.sourceUrl,
        user_data: userData,
        ...(input.value !== undefined
          ? { custom_data: { value: input.value, currency: "EUR" } }
          : {}),
      },
    ],
    ...(process.env.META_TEST_EVENT_CODE
      ? { test_event_code: process.env.META_TEST_EVENT_CODE }
      : {}),
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${pixelId}/events?access_token=${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    if (!res.ok) {
      console.error("[meta] CAPI odmietlo udalosť:", res.status, await res.text());
    }
  } catch (err) {
    console.error("[meta] CAPI volanie zlyhalo:", err);
  }
}
