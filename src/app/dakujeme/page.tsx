import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Hero";
import { REVIEWS, BRAND } from "@/lib/content";

export const metadata: Metadata = {
  title: `Ďakujeme — ozveme sa vám dnes | ${BRAND.name}`,
  robots: { index: false, follow: false },
};

/**
 * Dakovna stranka pre kvalifikovanych.
 *
 * Kontaktna cesta je TELEFONAT (rozhodnute, viz BRIEF.md). Stranka ma
 * tri ulohy: povedat, kedy hovor pride, znizit obavu z predajneho tlaku
 * a dat cloveku jednu vec na premyslenie, aby prisiel na hovor pripraveny.
 *
 * POZOR na Meta pravidla: ziadny sľub o kilogramoch ani centimetroch,
 * ziadna zmienka o vzhlade cloveka. Sľubuje sa priebeh, nie vysledok.
 */
export default function Dakujeme() {
  // Kto uvidi dokazy tesne pred hovorom, pride na telefonat teplejsi.
  const proof = REVIEWS.slice(0, 2);

  return (
    <main className="min-h-screen px-5 py-10">
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
            Máme to. Ozveme sa vám ešte dnes.
          </h1>
          <p className="mt-4 text-lg text-ink-2">
            Voláme z čísla s predvoľbou +421. Ak to nestihnete zdvihnúť, pošleme vám SMS
            a skúsim to ešte raz.
          </p>

          <div className="mt-8 rounded-xl bg-surface-2 p-6">
            <h2 className="text-base font-bold text-ink">
              Premyslite si prosím jednu vec
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
              Ako vyzerá váš bežný týždeň — kedy reálne máte hodinu voľna a čo vám
              doteraz najčastejšie zhatilo cvičenie. To je jediná vec, ktorá rozhoduje
              o tom, či vám viem zostaviť plán, ktorý naozaj odcvičíte.
            </p>
          </div>

          <div className="mt-8 border-t border-line pt-8">
            <h2 className="text-base font-bold text-ink">Ako hovor prebehne</h2>
            <ol className="mt-3 grid gap-2.5 text-[15px] text-ink-2">
              <li>Trvá zhruba 15 minút a nič za neho neplatíte.</li>
              <li>Nie je to predajný telefonát — najprv sa pýtam ja.</li>
              <li>Nemusíte mať žiadnu kondíciu ani skúsenosti, na to sa nepýtam.</li>
              <li>Dohodneme sa, ako často by ste chodili a čo to obsahuje.</li>
              <li>Na konci viete, ako by tréning u vás vyzeral a čo stojí.</li>
              <li>Ak vám to nesadne, rozídeme sa v dobrom a je to v poriadku.</li>
            </ol>
          </div>
        </div>

        {proof.length > 0 && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {proof.map((r) => (
              <figure key={r.id} className="rounded-card border border-line bg-surface p-6">
                <blockquote className="text-[15px] leading-relaxed text-ink-2">
                  {r.text}
                </blockquote>
                <figcaption className="mt-4 border-t border-line pt-3 text-sm font-bold text-ink">
                  {r.author ?? "Klientka"}
                </figcaption>
              </figure>
            ))}
          </div>
        )}

        <p className="mt-8 text-center text-sm text-ink-2">
          <Link href="/" className="underline underline-offset-2">
            Späť na úvod
          </Link>
        </p>
      </div>
    </main>
  );
}
