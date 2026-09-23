/**
 * Telefonne cislo — spolocne pre formular aj pre server.
 *
 * ZAMERNE BENEVOLENTNE. Clovek smie napisat cislo, ako je zvyknuty:
 *
 *   0905 123 456 · 905123456 · +421 905 123 456 · +421 0905 123 456
 *   00421905123456 · +420 777 123 456
 *
 * Vsetko sa prevedie na jeden tvar (+421 905 123 456). Odmietne sa iba
 * cislo, ktoremu chyba alebo prebyva cislica — take by sa aj tak nedalo
 * vytocit. Prisna validacia formatu tu predtym nebola problem, ale
 * nejasna chyba pri telefone je najcastejsi dovod odchodu z formulara.
 */

/** Predvolba, ktorou je pole predvyplnene. */
export const PHONE_PREFIX = "+421 ";

/** Slovenske cislo bez predvolby a bez uvodnej nuly ma 9 cislic. */
const SK_NATIONAL_LENGTH = 9;

/**
 * Upravi, co clovek napisal alebo vlozil, este v poli.
 *
 * Pole zacina predvyplnenym "+421 ". Ked sem niekto vlozi cele cislo
 * aj s predvolbou ("+421905…" alebo "00421…"), vzniklo by "+421 +421905…".
 * Nasu predvolbu v takom pripade zahodime a nechame tu jeho.
 */
export function cleanPhoneInput(value: string): string {
  return value.replace(/^\+421\s*(?=\+|00)/, "");
}

/**
 * Vrati cislo v tvare "+421 905 123 456", alebo null, ak sa neda vytocit.
 */
export function normalizePhone(input: string): string | null {
  const raw = cleanPhoneInput(input.trim());
  let digits = raw.replace(/\D/g, "");
  let international = raw.startsWith("+");

  if (digits.startsWith("00")) {
    digits = digits.slice(2);
    international = true;
  }

  if (digits.startsWith("421")) {
    let rest = digits.slice(3);
    if (rest.startsWith("0")) rest = rest.slice(1);
    return rest.length === SK_NATIONAL_LENGTH ? formatSk(rest) : null;
  }

  if (digits.startsWith("420")) {
    return digits.length === 12 ? `+${digits}` : null;
  }

  // Ine "+42…" je takmer vzdy preklep v predvyplnenej predvolbe
  // ("+4221 905…") — take cislo by Peter nevytocil.
  if (international && digits.startsWith("42")) return null;

  // ine krajiny (+43, +36 …) — kontrolujeme len rozumnu dlzku
  if (international) {
    return digits.length >= 8 && digits.length <= 15 ? `+${digits}` : null;
  }

  // bez predvolby: slovenske cislo s uvodnou nulou alebo bez nej
  if (digits.startsWith("0")) digits = digits.slice(1);
  return digits.length === SK_NATIONAL_LENGTH ? formatSk(digits) : null;
}

function formatSk(national: string): string {
  return `+421 ${national.slice(0, 3)} ${national.slice(3, 6)} ${national.slice(6)}`;
}

/** Je v poli viac nez predvyplnena predvolba? */
export function phoneIsEmpty(value: string): boolean {
  return value.replace(/\D/g, "").replace(/^421/, "").length === 0;
}
