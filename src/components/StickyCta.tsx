"use client";

import { useEffect, useState } from "react";
import { HERO } from "@/lib/content";

/**
 * Lepkave tlacidlo na mobile. Objavi sa az ked clovek prejde hero sekciu,
 * a schova sa, ked je formular na obrazovke — inak by ho prekryvalo.
 */
export default function StickyCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const form = document.getElementById("formular");

    function onScroll() {
      const past = window.scrollY > 600;
      const formVisible = form
        ? form.getBoundingClientRect().top < window.innerHeight - 100
        : false;
      setShow(past && !formVisible);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={[
        "fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ground/90 p-3 backdrop-blur transition-transform duration-200 sm:hidden",
        show ? "translate-y-0" : "translate-y-full",
      ].join(" ")}
    >
      <a
        href="#formular"
        className="wp-btn flex w-full items-center justify-center rounded-xl bg-brand-500 px-6 py-3.5 text-[15px] font-bold text-white"
      >
        {HERO.cta}
      </a>
    </div>
  );
}
