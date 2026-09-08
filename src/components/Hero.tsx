import VideoEmbed from "./VideoEmbed";
import { HERO, BRAND } from "@/lib/content";

/**
 * Logo ako typograficky znak.
 *
 * Vektorove logo zatial neexistuje, takze znacku nesie samotny nazov.
 * Nie je to nudzove riesenie — wordmark je pri sluzbach bezny a da sa
 * pouzit hned. "S" je zvyraznene znackovou modrou, aby znak mal zaciatok,
 * o ktory sa oko zachyti.
 *
 * Ked pride vektorove logo, nahrad obsah tejto komponenty za
 * <Image src="/logo.svg" ... /> — inde v kode netreba menit nic.
 */
export function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  const [first, ...rest] = BRAND.name;
  return (
    <span
      className={`font-extrabold tracking-tight text-ink ${
        size === "lg" ? "text-2xl" : "text-xl"
      }`}
    >
      <span className="text-brand-500">{first}</span>
      {rest.join("")}
    </span>
  );
}

export default function Hero() {
  return (
    <header className="px-5 pb-8 pt-7 sm:pt-9">
      <div className="mx-auto w-full max-w-4xl text-center">
        <div className="wp-in mb-8 flex justify-center">
          <Logo size="lg" />
        </div>

        {/* pill so segmentom publika — hovori clovekovi "toto je pre mna" */}
        <p className="wp-in wp-d1 mx-auto mb-7 inline-flex rounded-full border border-brand-500/25 bg-surface px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-2 shadow-[0_0_28px_-6px_rgba(31,111,235,0.16)] sm:text-xs">
          {HERO.eyebrow}
        </p>

        <h1 className="wp-in wp-d2 text-balance text-[2.1rem] font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
          {HERO.headline}{" "}
          <span className="text-brand-500">{HERO.headlineAccent}</span>
        </h1>

        <p className="wp-in wp-d3 mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink-2 sm:text-lg">
          {HERO.sub}
        </p>

        {/* Kym nie je natocene video, cely blok vypadne — prazdny ram
            velkosti 16:9 by hero len roztiahol a stranka by vyzerala
            nedokoncene. Pripomienku na natocenie drzi BRIEF.md. */}
        {HERO.youtubeId ? (
          <>
            <div className="wp-in wp-d4 relative mt-9">
              <div aria-hidden="true" className="wp-halo wp-drift" />
              <div className="relative">
                <VideoEmbed youtubeId={HERO.youtubeId} />
              </div>
            </div>

            <p className="wp-in wp-d5 mt-7 text-sm text-ink-2">
              Pozrite si za 5 minút, ako to celé funguje — a potom nám dole napíšte,
              či to dáva zmysel aj pre vás.
            </p>
          </>
        ) : (
          <p className="wp-in wp-d5 mt-8 text-sm text-ink-2">
            {HERO.ctaNote}
          </p>
        )}
      </div>
    </header>
  );
}
