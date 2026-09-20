import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Hero";
import LeadPixel from "@/components/LeadPixel";
import { BRAND } from "@/lib/content";

export const metadata: Metadata = {
  title: `Ďakujeme — ozveme sa vám do 24 hodín | ${BRAND.name}`,
  robots: { index: false, follow: false },
};

/**
 * Dakovna stranka pre kvalifikovanych.
 *
 * ZAMERNE HOLA, rovnako ako u Marcana. Boli tu este pokyny na premyslenie
 * pred hovorom, zoznam "Ako hovor prebehne" a dve recenzie — zadavatel ich
 * chcel prec. Kto formular odoslal, uz sa rozhodol; dlha stranka po odoslani
 * posobi, akoby sa od neho este nieco cakalo.
 *
 * Co bolo treba povedat, hovori potvrdzovaci e-mail z n8n.
 */
export default function Dakujeme() {
  return (
    <main className="min-h-screen px-5 py-10">
      {/* Odosle Mete udalost Lead — az tu, nie pri odoslani formulara. */}
      <LeadPixel />
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-8">
          <Logo />
        </div>

        <div className="rounded-card border border-line bg-surface p-7 sm:p-10">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-500/12">
            <svg viewBox="0 0 20 20" className="h-5 w-5 fill-brand-500" aria-hidden="true">
              <path d="M7.6 14.2 3.4 10l1.4-1.4 2.8 2.8 7-7L16 5.8z" />
            </svg>
          </span>

          <h1 className="mt-5 text-balance text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
            Ďakujeme, ozveme sa vám do 24 hodín.
          </h1>
        </div>

        <p className="mt-8 text-center text-sm text-ink-2">
          <Link href="/" className="underline underline-offset-2">
            Späť na úvod
          </Link>
        </p>
      </div>
    </main>
  );
}
