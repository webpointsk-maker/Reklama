"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * Cookie lista, ktora spusta Meta Pixel az po suhlase.
 *
 * PRECO JE TO TAKTO A NIE INAK:
 * Pixel sa nenacita vopred a nevypne sa dodatocne — jeho skript sa do
 * stranky vlozi az po kliknuti na "Suhlasim". Kym clovek nesuhlasi (alebo
 * odmietne), stranka nenastavi ziadne sledovacie cookie. Odmietnutie je
 * rovnocenne tlacidlo, nie odkaz nabok.
 *
 * Meranie konverzii tym nekonci: udalost Lead ide aj zo servera cez
 * Conversions API, ktore nepotrebuje cookie. Odmietnutie suhlasu teda
 * neznamena stratene meranie, len menej presne priradenie k reklame.
 */

const KEY = "cookie-consent";
type Consent = "granted" | "denied";

function loadPixel(pixelId: string) {
  if (document.getElementById("meta-pixel")) return;

  const s = document.createElement("script");
  s.id = "meta-pixel";
  s.async = true;
  s.textContent = `
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
    (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init','${pixelId}');fbq('track','PageView');
  `;
  document.head.appendChild(s);
}

export default function CookieBar() {
  const [decided, setDecided] = useState(true); // kym necitame, listu nezobrazuj

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(KEY);
    } catch {
      // Sukromne okno alebo zablokovane ulozisko — listu ukazeme,
      // rozhodnutie sa len nezapamata. Nikdy nepadaj na tomto.
    }

    if (saved === "granted") {
      const id = process.env.NEXT_PUBLIC_META_PIXEL_ID;
      if (id) loadPixel(id);
      return;
    }
    if (saved === "denied") return;

    setDecided(false);
  }, []);

  function decide(value: Consent) {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      // neulozilo sa — rozhodnutie aj tak respektujeme v tejto navsteve
    }
    if (value === "granted") {
      const id = process.env.NEXT_PUBLIC_META_PIXEL_ID;
      if (id) loadPixel(id);
    }
    setDecided(true);
  }

  if (decided) return null;

  return (
    <div
      role="dialog"
      aria-label="Súhlas s meraním"
      // z-40, aby lista ostala pod StickyCta a neprekryla hlavne tlacidlo
      className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 rounded-2xl border border-line-2 bg-surface p-5 shadow-[0_-10px_40px_-12px_rgba(0,0,0,0.6)] sm:flex-row sm:items-center">
        <p className="flex-1 text-sm leading-relaxed text-ink-2">
          Na meranie účinnosti reklamy by sme radi použili Meta Pixel. Bez vášho
          súhlasu ho nenačítame a stránka nenastaví žiadne sledovacie cookies.{" "}
          <Link
            href="/ochrana-udajov"
            className="text-ink underline underline-offset-2"
          >
            Viac v ochrane údajov
          </Link>
          .
        </p>

        <div className="flex flex-none gap-2">
          <button
            type="button"
            onClick={() => decide("denied")}
            className="rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-ink-2 transition hover:border-line-2 hover:text-ink"
          >
            Odmietnuť
          </button>
          <button
            type="button"
            onClick={() => decide("granted")}
            className="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600"
          >
            Súhlasím
          </button>
        </div>
      </div>
    </div>
  );
}
