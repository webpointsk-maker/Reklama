/**
 * Skórovanie leadu 0 – 100.
 * Skóre neurčuje kvalitu človeka — určuje, za ako dlho sa mu ozveme.
 *
 * Skóruje sa PRIPRAVENOSŤ ZAČAŤ — kedy chce začať a koľkokrát týždenne
 * reálne stihne cvičiť. To sú najlepšie prediktory toho, či klient
 * vydrží dlhšie než mesiac.
 *
 * Otazky za kontaktom sa daju vynechat (clovek odide skor). Chybajuca
 * odpoved ma 0 bodov, ale nikoho nediskvalifikuje — kto da telefon
 * a zvysok neodklika, je stale lead (pasmo C, ozvat sa do 24 hodin).
 */

import { DISQUALIFYING } from "./form-config";

export type Band = "A" | "B" | "C" | "D";

export interface LeadAnswers {
  goal?: string;
  frequency?: string;
  start?: string;
}

export interface ScoreResult {
  score: number;
  band: Band;
  qualified: boolean;
  breakdown: Record<string, number>;
  /** do koľkých minút sa ozvať; null = neozývať sa */
  contactWithinMinutes: number | null;
}

/** Kedy chce zacat — najsilnejsi signal zo vsetkych. */
const START_POINTS: Record<string, number> = {
  now: 50,
  month: 28,
  later: 5,
};

/** Kolkokrat tyzdenne — realna sanca, ze uvidi vysledok a zostane. */
const FREQUENCY_POINTS: Record<string, number> = {
  f1: 10,
  f2: 28,
  f3: 42,
  f4: 38, // 4x a viac je casto nadhodnotene ocakavanie, nie zaruka
};

/** Ciel — rozdiely su male, ide skor o to, ci mu vies pomoct. */
const GOAL_POINTS: Record<string, number> = {
  lose: 8,
  muscle: 8,
  health: 7,
  pain: 7,
  performance: 8,
};

export function scoreLead(a: LeadAnswers): ScoreResult {
  const breakdown = {
    start: START_POINTS[a.start ?? ""] ?? 0,
    frequency: FREQUENCY_POINTS[a.frequency ?? ""] ?? 0,
    goal: GOAL_POINTS[a.goal ?? ""] ?? 0,
  };

  const score = Object.values(breakdown).reduce((s, n) => s + n, 0);

  // Staci jedna diskvalifikujuca odpoved — vysoke skore inde ju neprebije.
  const blocked = DISQUALIFYING.some(
    (d) => a[d.step as keyof LeadAnswers] === d.option,
  );

  // Pasmo D je IBA pre diskvalifikovanych. Nizke skore z chybajucich
  // odpovedi znamena len pomalsiu odozvu (C), nie "neozyvat sa".
  let band: Band;
  if (blocked) band = "D";
  else if (score >= 75) band = "A";
  else if (score >= 50) band = "B";
  else band = "C";

  const contactWithinMinutes = { A: 15, B: 120, C: 1440, D: null }[band];

  return { score, band, qualified: band !== "D", breakdown, contactWithinMinutes };
}

export const BAND_LABEL: Record<Band, string> = {
  A: "A — ozvať sa do 15 minút",
  B: "B — ozvať sa do 2 hodín",
  C: "C — ozvať sa do 24 hodín",
  D: "D — neozývať sa",
};

/**
 * Kategoria leadu — iba dve, aby sa v tabulke dalo rozhodnut jednym pohladom.
 *
 *   🔥 Horúci  = pasmo A a B, 50+ bodov. Oplati sa zavolat v ten isty den.
 *   ❄️ Chladný = pasmo C a D. Slabsi lead alebo taky, co neprešiel filtrom.
 *
 * Styri kategorie (horuci / vlazny / chladny / nevhodny) boli na pouzivanie
 * zbytocne jemne. Rozdiel medzi C a D sa nestratil: pri D je v stlpci
 * Poznámka "Nevolať — dovod", takze je jasne, komu sa volat nema vobec.
 *
 * Pismeno pasma zostava v kode — rozhoduje o potvrdzovacom e-maile a o tom,
 * ci sa Mete posiela udalost Lead. Kategoria je len jeho ludsky preklad.
 */
export const KATEGORIA: Record<Band, string> = {
  A: "🔥 Horúci",
  B: "🔥 Horúci",
  C: "❄️ Chladný",
  D: "❄️ Chladný",
};
