/**
 * Skórovanie leadu 0 – 100.
 * Skóre neurčuje kvalitu človeka — určuje, za ako dlho sa mu ozveme.
 *
 * ROZDIEL OPROTI B2B FUNNELU: tam sa skórovala hlavne kúpyschopnosť
 * (obrat, rozpočet). Tu sa skóruje PRIPRAVENOSŤ ZAČAŤ — kedy chce
 * začať, koľkokrát týždenne reálne stihne cvičiť a koľko úsilia vloží
 * do otvorenej odpovede. To sú najlepšie prediktory toho, či klient vydrží dlhšie
 * než mesiac.
 */

import { DISQUALIFYING } from "./form-config";

export type Band = "A" | "B" | "C" | "D";

export interface LeadAnswers {
  goal?: string;
  level?: string;
  frequency?: string;
  start?: string;
  /** otvorena odpoved — skoruje sa podla vlozeneho usilia */
  note?: string;
}

export interface ScoreResult {
  score: number;
  band: Band;
  qualified: boolean;
  breakdown: Record<string, number>;
  /** do koľkých minút sa ozvať; null = neozývať sa, ide do nurture */
  contactWithinMinutes: number | null;
}

/** Kedy chce zacat — najsilnejsi signal zo vsetkych. */
const START_POINTS: Record<string, number> = {
  now: 34,
  month: 19,
  later: 4,
};

/** Kolkokrat tyzdenne — realna sanca, ze uvidi vysledok a zostane. */
const FREQUENCY_POINTS: Record<string, number> = {
  f1: 7,
  f2: 19,
  f3: 28,
  f4: 26, // 4x a viac je casto nadhodnotene ocakavanie, nie zaruka
};

/**
 * Usilie vlozene do otvorenej odpovede.
 *
 * Nehodnoti sa, CO clovek napisal — to by bolo hadanie. Hodnoti sa, ci si
 * dal namahu. Kto napise tri vety o tom, co uz skusal, riesi svoj problem;
 * kto odklikne minimum, sa obzera. Je to najlepsi signal v celom formulari
 * hned po tom, kedy chce zacat.
 */
function noteEffortPoints(note: string | undefined): number {
  const clean = (note ?? "").trim().replace(/\s+/g, " ");
  if (clean.length >= 140) return 16;
  if (clean.length >= 80) return 12;
  if (clean.length > 0) return 7;
  return 0;
}

/** Doterajsia skusenost. */
const LEVEL_POINTS: Record<string, number> = {
  had_trainer: 16, // vie, co sluzba obnasa, a uz za nu raz zaplatil
  regular_noresult: 14, // ma navyk, chyba mu vedenie — najlahsi vysledok
  sometimes: 10,
  none: 7,
};

/** Ciel — rozdiely su male, ide skor o to, ci mu vies pomoct. */
const GOAL_POINTS: Record<string, number> = {
  lose: 6,
  muscle: 6,
  health: 5,
  pain: 5,
  performance: 6,
};

export function scoreLead(a: LeadAnswers): ScoreResult {
  const breakdown = {
    start: START_POINTS[a.start ?? ""] ?? 0,
    frequency: FREQUENCY_POINTS[a.frequency ?? ""] ?? 0,
    note: noteEffortPoints(a.note),
    level: LEVEL_POINTS[a.level ?? ""] ?? 0,
    goal: GOAL_POINTS[a.goal ?? ""] ?? 0,
  };

  const score = Object.values(breakdown).reduce((s, n) => s + n, 0);

  // Staci jedna diskvalifikujuca odpoved — vysoke skore inde ju neprebije.
  const blocked = DISQUALIFYING.some(
    (d) => a[d.step as keyof LeadAnswers] === d.option,
  );

  let band: Band;
  if (blocked || score < 30) band = "D";
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
  D: "D — neozývať sa, nurture",
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
