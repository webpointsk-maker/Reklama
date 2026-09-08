import Hero from "@/components/Hero";
import StickyCta from "@/components/StickyCta";
import Reveal from "@/components/Reveal";
import QualForm from "@/components/form/QualForm";
// Ukazovatel kapacity je zamerne vypnuty — viz komentar pri CAPACITY
// v src/lib/content.ts. Zapnut spat: obnovit import a obe <Capacity />.
import {
  Heading,
  WhatYouGet,
  ForWhom,
  Trainers,
  Achievements,
  Stories,
  Reviews,
  Guarantee,
  Process,
  Faq,
  Footer,
} from "@/components/Sections";

/**
 * Formular je hned pod videom, teda uplne hore.
 *
 * Dosledok, s ktorym treba ratat: clovek sa k nemu dostane skor, nez uvidi
 * case studies a recenzie. Obsah pod formularom preto nie je vypln — je to
 * material pre tych, ktori potrebuju viac presviedcania a odskroluju nizsie.
 * Preto je dole este jedno CTA, ktore ich vracia sem hore.
 */
export default function Home() {
  return (
    <>
      {/* ambientné svetlá — pomaly sa pohybujú, aby pozadie nebolo mŕtve */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="wp-orb wp-orb--brand wp-drift left-[-16%] top-[-10%] h-[36rem] w-[36rem]" />
        <div className="wp-orb wp-orb--sky wp-drift-slow right-[-18%] top-[6%] h-[34rem] w-[34rem]" />
        <div className="wp-orb wp-orb--brand wp-drift-slow bottom-[-20%] left-[28%] h-[30rem] w-[30rem]" />
      </div>

      <Hero />

      <section id="formular" className="px-5 pb-16 pt-4 sm:pb-20">
        <div className="mx-auto w-full max-w-4xl">
          <div className="wp-in wp-d5">
            <Heading
              title="Zistíme, či si sadneme"
              sub="Ak podľa odpovedí dávame zmysel, zavoláme vám ešte dnes. Ak nie, povieme to rovno a volať nebudeme."
            />
            <QualForm />
          </div>
        </div>
      </section>

      {/* Dokazy hned pod formular: kto ho nevyplnil na prvy raz, narazi na
          ne este predtym, nez zacne citat detaily.
          Fotky pred/po tu boli a boli odstranene — Meta ich pri fitness
          zakazuje a kontroluje aj cielovu stranku. Su v _nepouzite-meta/. */}
      <Trainers />
      <Achievements />

      <WhatYouGet />
      <ForWhom />
      <Stories />
      <Reviews />
      <Guarantee />
      <Process />
      <Faq />

      {/* navrat k formularu pre tych, co doskrolovali az sem */}
      <section className="px-5 pb-16 pt-2">
        <Reveal className="mx-auto w-full max-w-3xl">
          <div className="wp-lit relative overflow-hidden rounded-3xl border border-line bg-surface px-6 py-12 text-center sm:px-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(36rem_18rem_at_50%_100%,rgba(31,111,235,0.06),transparent_70%)]"
            />
            <div className="relative">
              <h2 className="text-balance text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                Prvý krok je najdôležitejší. Dajte nám dve minúty.
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-ink-2">
                Vyplňte päť otázok a ak podľa odpovedí dávame zmysel, ozveme sa vám
                ešte dnes.
              </p>
              <a
                href="#formular"
                className="wp-btn mt-7 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-7 py-4 text-base font-bold text-white hover:bg-brand-600"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                  <path d="M12 20V7.8L6.9 12.9 5.5 11.5 12 5l6.5 6.5-1.4 1.4L12 7.8V20z" />
                </svg>
                Chcem nezáväznú konzultáciu
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      <Footer />
      <StickyCta />
    </>
  );
}
