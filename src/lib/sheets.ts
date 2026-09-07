/**
 * Zapis leadu do Google Sheets cez servisny ucet.
 *
 * Ak nie su nastavene premenne prostredia, zapis sa preskoci a riadok
 * sa vypise do konzoly — aplikacia teda bezi aj bez pripojenej tabulky.
 */

import { JWT } from "google-auth-library";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

export const SHEET_HEADER = [
  "Čas",
  "Lead ID",
  "Stav",
  "Skóre",
  "Pásmo",
  "Ozvať sa do",
  "Meno",
  "Telefón",
  "E-mail",
  "Profil / odkaz",
  "Kedy sa ozvať",
  "Cieľ",
  "Úroveň",
  "Frekvencia",
  "Kedy začať",
  "Čo už skúšal(a)",
  "Zdroj",
] as const;

/**
 * Hlavicka pre harok s rozpracovanymi formularmi.
 * Ma vlastnu sadu stlpcov — pri rozpracovanom leade este nie je skore
 * ani pasmo, zato je dolezite vidiet, na ktorej otazke clovek odisiel.
 */
export const PARTIAL_HEADER = [
  "Čas",
  "Lead ID",
  "Odišiel na kroku",
  "Meno",
  "Telefón",
  "E-mail",
  "Cieľ",
  "Úroveň",
  "Frekvencia",
  "Kedy začať",
  "Čo už skúšal(a)",
] as const;

/** Nazov harka pre rozpracovane formulare. */
export const PARTIAL_TAB = "Rozpracované";

function credentials() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!email || !key || !sheetId) return null;
  return {
    email,
    // vo Verceli sa novy riadok uklada ako "\n" v jednom riadku
    key: key.replace(/\\n/g, "\n"),
    sheetId,
    tab: process.env.GOOGLE_SHEET_TAB || "Leady",
  };
}

/**
 * Prida riadok na koniec harka.
 * `tab` prebije predvoleny harok z premennej prostredia — pouziva to
 * endpoint pre rozpracovane formulare, ktory ma vlastny harok.
 */
export async function appendRow(
  row: (string | number)[],
  tab?: string,
): Promise<void> {
  const creds = credentials();
  if (!creds) {
    console.warn(
      `[sheets] premenné prostredia chýbajú — riadok sa nezapísal (hárok ${tab ?? "predvolený"}):`,
      row,
    );
    return;
  }

  const auth = new JWT({
    email: creds.email,
    key: creds.key,
    scopes: SCOPES,
  });
  const { token } = await auth.getAccessToken();
  if (!token) throw new Error("[sheets] nepodarilo sa získať prístupový token");

  const range = encodeURIComponent(`${tab ?? creds.tab}!A:Z`);
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${creds.sheetId}/values/${range}` +
    `:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ values: [row] }),
  });

  if (!res.ok) {
    throw new Error(`[sheets] zápis zlyhal: ${res.status} ${await res.text()}`);
  }
}
