"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Odhalí obsah pri prvom vstupe do výrezu obrazovky.
 *
 * Zámerne sa spúšťa len raz — pri opakovanom skrolovaní hore-dole by
 * blikanie obsahu rušilo.
 *
 * POZOR na past, ktorá tu bola: samotný IntersectionObserver nestačí.
 * Ak sa cez element preskočí naraz (príchod cez kotvu, obnovenie pozície
 * pri obnovení stránky, rýchly flick na mobile), pomer prekrytia sa zmení
 * z 0 na 0 bez prechodu cez prah — observer nikdy nezavolá callback a blok
 * zostane navždy priehľadný. Na landing page to znamená stratenú konverziu.
 * Preto je tu okrem observera aj kontrola pri pripojení a poistka na skrole.
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  /** oneskorenie v milisekundách, na postupné odhaľovanie kariet vedľa seba */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Bez podpory observera zobrazíme obsah okamžite — nikdy nesmie zostať skrytý.
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    let obs: IntersectionObserver | null = null;

    /** Je element vo výreze alebo už nad ním? */
    const inRange = () => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight * 0.92;
    };

    const done = () => {
      setShown(true);
      obs?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };

    const onScroll = () => {
      if (inRange()) done();
    };

    if (inRange()) {
      setShown(true);
      return;
    }

    obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting || entry.boundingClientRect.top < 0) done();
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );
    obs.observe(el);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      obs?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`wp-reveal ${shown ? "is-in" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
