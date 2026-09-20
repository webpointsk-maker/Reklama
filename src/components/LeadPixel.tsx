"use client";

import { useEffect } from "react";

/**
 * Odosle Mete udalost Lead az na dakovnej stranke.
 *
 * PRECO TU A NIE V FORMULARI: zadavatel chce zapocitat iba leady, ktore
 * naozaj dosli na dakovnu stranku. Predtym sa udalost odosielala hned po
 * ulozeni leadu, este z hlavnej stranky — spolahlivejsie, ale v adrese
 * udalosti potom nebolo /dakujeme a vlastna konverzia s takym pravidlom
 * nikdy nesadla.
 *
 * ZA CO TO PLATIME: ked clovek po odoslani zavrie zalozku skor, nez sa
 * dakovna stranka nacita, konverzia sa stratí. Lead je ulozeny v tabulke
 * tak ci tak — Meta o nom len nebude vediet.
 *
 * Udaje si formular odklada do sessionStorage a tento komponent ich po
 * odoslani zmaze, aby obnovenie stranky nezapocitalo lead druhy raz.
 */

const KLUC = "wp-lead-meta";

export default function LeadPixel() {
  useEffect(() => {
    let ulozene: string | null = null;
    try {
      ulozene = sessionStorage.getItem(KLUC);
    } catch {
      return; // sukromne okno alebo zablokovane ulozisko
    }
    if (!ulozene) return;

    let data: { leadId?: string; value?: number };
    try {
      data = JSON.parse(ulozene);
    } catch {
      try { sessionStorage.removeItem(KLUC); } catch { /* ignoruj */ }
      return;
    }
    if (!data.leadId) return;

    /**
     * Cookie lista vklada pixel vo vlastnom efekte a nevieme, ktory z nich
     * bezi prvy. Preto na fbq chvilu pockame — max 4 sekundy, potom to
     * vzdame. Bez suhlasu s cookies fbq nikdy nevznikne a to je v poriadku.
     */
    let pokusy = 0;
    const timer = window.setInterval(() => {
      const fbq = (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq;
      if (fbq) {
        window.clearInterval(timer);
        try {
          fbq(
            "track",
            "Lead",
            data.value !== undefined ? { value: data.value, currency: "EUR" } : {},
            { eventID: data.leadId },
          );
        } catch (err) {
          console.warn("[meta] odoslanie konverzie zlyhalo:", err);
        }
        try { sessionStorage.removeItem(KLUC); } catch { /* ignoruj */ }
      } else if (++pokusy > 20) {
        window.clearInterval(timer);
        try { sessionStorage.removeItem(KLUC); } catch { /* ignoruj */ }
      }
    }, 200);

    return () => window.clearInterval(timer);
  }, []);

  return null;
}
