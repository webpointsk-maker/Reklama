/**
 * Nacitanie obrazkov z priecinka v public/.
 *
 * Preco takto a nie zoznamom v content.ts: fotky pribudaju priebezne a
 * pridavanie kazdej do pola by znamenalo zasah do kodu. Takto staci subor
 * hodit do priecinka a po obnoveni stranky tam je.
 *
 * Bezi len na serveri (Sections su serverove komponenty). Nikdy to
 * neimportuj do suboru s "use client" — fs v prehliadaci neexistuje.
 */

import fs from "node:fs";
import path from "node:path";

const EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

/**
 * @param subdir cesta v ramci public/, napr. "img/uspechy"
 * @returns cesty pouzitelne v src="", zoradene podla nazvu suboru
 */
export function listImages(subdir: string): string[] {
  const dir = path.join(process.cwd(), "public", subdir);

  let files: string[];
  try {
    files = fs.readdirSync(dir);
  } catch {
    // Priecinok nemusi existovat — to nie je chyba, len tam zatial nic nie je.
    return [];
  }

  return files
    .filter((f) => EXTENSIONS.has(path.extname(f).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, "sk", { numeric: true }))
    .map((f) => `/${subdir}/${f}`);
}
