import Reveal from "./Reveal";
import { listImages } from "@/lib/gallery";
import {
  WHAT_YOU_GET,
  FOR_WHOM,
  STORIES,
  REVIEWS,
  PROCESS,
  FAQ,
  GUARANTEE,
  SITE,
  BRAND,
  TRAINERS,
} from "@/lib/content";

/* ---------- spolocne stavebne prvky ---------- */

export function Section({
  id,
  panel,
  children,
}: {
  id?: string;
  /** panel = obsah v zdvihnutom tmavom ramci, ako v referencii */
  panel?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="px-5 py-14 sm:py-20">
      <Reveal className="mx-auto w-full max-w-6xl">
        {panel ? (
          <div className="rounded-3xl border border-line bg-surface/60 p-6 sm:p-10">
            {children}
          </div>
        ) : (
          children
        )}
      </Reveal>
    </section>
  );
}

export function Heading({
  eyebrow,
  title,
  sub,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  align?: "center" | "left";
}) {
  const centered = align === "center";
  return (
    <div className={`mb-10 ${centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}`}>
      {eyebrow && (
        <p className="wp-text-glow-sm mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-500">
          {eyebrow}
        </p>
      )}
      <h2 className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      {sub && <p className="mt-3 text-base text-ink-2 sm:text-lg">{sub}</p>}
    </div>
  );
}

function Check() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="mt-1 h-4 w-4 flex-none fill-brand-500"
    >
      <path d="M7.6 14.2 3.4 10l1.4-1.4 2.8 2.8 7-7L16 5.8z" />
    </svg>
  );
}

function Todo({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-6 rounded-xl border border-dashed border-brand-500/40 bg-brand-500/8 px-4 py-3 text-sm text-brand-600">
      {children}
    </p>
  );
}

const card = "wp-glow rounded-2xl border border-line bg-surface";

/* ---------- co robime my a co vy ---------- */

export function WhatYouGet() {
  return (
    <Section id="co-robime">
      <Heading eyebrow="Rozdiel" title={WHAT_YOU_GET.title} sub={WHAT_YOU_GET.sub} />
      <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
        <div className={`${card} p-6 sm:p-8`}>
          <p className="mb-6 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-3">
            Na našej strane
          </p>
          <ul className="grid gap-5 sm:grid-cols-2">
            {WHAT_YOU_GET.items.map((i) => (
              <li key={i.t} className="flex gap-3">
                <Check />
                <span>
                  <b className="block text-[15px] font-bold text-ink">{i.t}</b>
                  <span className="text-sm text-ink-2">{i.d}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="wp-glow wp-lit rounded-2xl border border-brand-500/35 bg-brand-500/8 p-6 sm:p-8">
          <p className="wp-text-glow-sm mb-6 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-500">
            Na vašej strane
          </p>
          <ul className="grid gap-5">
            {WHAT_YOU_GET.yours.map((i) => (
              <li key={i.t} className="flex gap-3">
                <Check />
                <span>
                  <b className="block text-[15px] font-bold text-ink">{i.t}</b>
                  <span className="text-sm text-ink-2">{i.d}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-7 border-t border-brand-500/20 pt-5 text-sm text-ink-2">
            To je celé. Nič iné od vás nepotrebujeme.
          </p>
        </div>
      </div>
    </Section>
  );
}

/* ---------- pre koho ---------- */

export function ForWhom() {
  return (
    <Section id="pre-koho">
      <Heading eyebrow="Kvalifikácia" title={FOR_WHOM.title} />
      <div className="grid gap-5 md:grid-cols-2">
        <div className={`${card} p-6 sm:p-8`}>
          <h3 className="mb-5 text-lg font-bold text-ink">{FOR_WHOM.yes.title}</h3>
          <ul className="grid gap-3.5">
            {FOR_WHOM.yes.items.map((t) => (
              <li key={t} className="flex gap-3 text-[15px] text-ink">
                <Check />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="wp-glow rounded-2xl border border-line bg-surface/40 p-6 sm:p-8">
          <h3 className="mb-5 text-lg font-bold text-ink-2">{FOR_WHOM.no.title}</h3>
          <ul className="grid gap-3.5">
            {FOR_WHOM.no.items.map((t) => (
              <li key={t} className="flex gap-3 text-[15px] text-ink-3">
                <span className="mt-2.5 h-px w-3 flex-none bg-ink-3/60" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

/* ---------- treneri ---------- */

/**
 * Kto vas bude trenovat.
 *
 * Pri sluzbe, kde clovek plati za cas konkretneho cloveka, je tvar
 * silnejsi dokaz nez akykolvek text. Sekcia stoji vysoko — hned za
 * formularom — aby navstevnik vedel, s kym bude hovorit.
 *
 * Trener bez fotky sa zobrazi s inicialou v kruhu, nie s prazdnym miestom.
 */
export function Trainers() {
  return (
    <Section id="treneri">
      <Heading
        eyebrow="Kto sme"
        title="Kto vás bude trénovať"
        sub="Tréning vedie jeden z nás dvoch — podľa toho, čo potrebujete a kedy môžete."
      />
      <div className="mx-auto grid max-w-3xl gap-5 sm:grid-cols-2">
        {TRAINERS.map((t, i) => (
          <Reveal key={t.id} delay={i * 90}>
            <article className={`${card} h-full p-6 text-center sm:p-7`}>
              {t.photo ? (
                <img
                  src={t.photo}
                  alt={`${t.name} — tréner`}
                  loading="lazy"
                  className="mx-auto h-32 w-32 rounded-full border border-line object-cover object-top"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="mx-auto flex h-32 w-32 items-center justify-center rounded-full border border-line bg-surface-2 text-3xl font-extrabold text-ink-3"
                >
                  {t.name.startsWith("TODO") ? "?" : t.name[0]}
                </span>
              )}

              <h3 className="mt-5 text-lg font-bold text-ink">{t.name}</h3>
              <p className="wp-text-glow-sm mt-1 text-sm font-semibold text-brand-600">{t.role}</p>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{t.bio}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ---------- dosahy klientov ---------- */

/**
 * Screenshoty sprav od klientov pocas spoluprace.
 *
 * Preco je to oddelene od recenzii: recenzia je hodnotenie trenera
 * ("odporucam, je profesional"), toto je dokaz, ze sa nieco deje —
 * sprava napisana v priebehu, nie na konci. Funguje inak a patri
 * k premenam, nie k odporucaniam.
 *
 * Obrazky sa nacitavaju z public/img/uspechy — staci ich tam nahrat.
 */
export function Achievements() {
  const shots = listImages("img/uspechy");
  if (shots.length === 0) return null;

  return (
    <Section id="dosahy" panel>
      <Heading
        eyebrow="Počas spolupráce"
        title="Čo nám klienti píšu cestou"
        sub="Správy, ktoré prišli v priebehu, nie na konci."
      />
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {shots.map((src) => (
          <img
            key={src}
            src={src}
            alt="Správa od klienta počas spolupráce"
            loading="lazy"
            className="mb-4 w-full break-inside-avoid rounded-xl border border-line"
          />
        ))}
      </div>
    </Section>
  );
}

/* ---------- pribehy klientov ---------- */

export function Stories() {
  // Pribehy su momentalne prazdne — sekcia sa nevykresli vobec, aby na
  // stranke nezostala prazdna diera. Dokazy nesie sekcia s recenziami.
  if (STORIES.length === 0) return null;

  const hasPlaceholder = STORIES.some((c) => c.placeholder);
  return (
    <Section id="vysledky" panel>
      <Heading
        eyebrow="Príbehy"
        title="Ako to dopadlo u iných"
        sub="Konkrétni ľudia, konkrétna situácia, konkrétny výsledok."
      />
      {hasPlaceholder && (
        <Todo>
          Ilustračné príbehy, nie reálni klienti — nahraď ich v <code>STORIES</code> v{" "}
          <code>src/lib/content.ts</code> a odstráň príznak <code>placeholder</code>. Ku
          každému údaju maj podklad a písomný súhlas klienta.
        </Todo>
      )}
      <div className="grid gap-5 md:grid-cols-2">
        {STORIES.map((c, i) => (
          <Reveal key={c.id} delay={i * 90}>
            <article className={`${card} h-full overflow-hidden transition duration-300 hover:border-line-2`}>
            <div className="p-6 sm:p-7">
              <span className="inline-flex rounded-lg border border-brand-500/30 bg-brand-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-brand-600">
                {c.person}
              </span>
              <p className="mt-5 text-3xl font-extrabold tracking-tight text-ink">
                {c.result}
              </p>
              <p className="mt-1 text-sm text-ink-2">{c.resultNote}</p>
              <dl className="mt-6 grid gap-4 border-t border-line pt-6 text-sm">
                <div>
                  <dt className="font-bold text-ink">Východisko</dt>
                  <dd className="mt-0.5 text-ink-2">{c.situation}</dd>
                </div>
                <div>
                  <dt className="font-bold text-ink">Čo sme spolu robili</dt>
                  <dd className="mt-0.5 text-ink-2">{c.work}</dd>
                </div>
              </dl>
            </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ---------- recenzie ---------- */

const SOURCE_LABEL: Record<string, string> = {
  facebook: "Facebook",
  google: "Google",
  sprava: "Správa od klientky",
};

/**
 * Recenzie.
 *
 * Ked su v public/img/reviews screenshoty, zobrazia sa LEN ony — screenshot
 * je silnejsi dokaz nez prepisany text, lebo je na nom vidiet zdroj aj
 * povodne znenie. Prepisane recenzie z REVIEWS su zaloha pre pripad, ze
 * screenshoty este nie su nahrate, aby sekcia nikdy nezostala prazdna.
 */
export function Reviews() {
  const shots = listImages("img/reviews");
  const useShots = shots.length > 0;

  return (
    <Section id="recenzie" panel>
      <Heading
        eyebrow="Recenzie"
        title="Čo hovoria klienti"
        sub={
          useShots
            ? "Screenshoty z Facebooku, Googlu a zo správ, v pôvodnej podobe."
            : "Prepísané z Facebooku, Googlu a zo správ. Nič skrátené do jednej vety."
        }
      />

      {useShots ? (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {shots.map((src) => (
            <img
              key={src}
              src={src}
              alt="Recenzia klienta"
              loading="lazy"
              className="mb-4 w-full break-inside-avoid rounded-xl border border-line"
            />
          ))}
        </div>
      ) : (
        <>
          <Todo>
            Zobrazujú sa prepísané recenzie. Nahraj screenshoty do{" "}
            <code>public/img/reviews</code> a nahradia ich — netreba nič dopisovať
            do kódu.
          </Todo>

          {/* Masonry cez CSS stlpce — recenzie maju velmi rozne dlzky a v mriezke
              by okolo kratkych vznikali velke diery. */}
          <div className="columns-1 gap-5 md:columns-2 lg:columns-3">
            {REVIEWS.map((r, i) => (
              <Reveal key={r.id} delay={Math.min(i, 5) * 70} className="mb-5 break-inside-avoid">
                <figure className={`${card} p-6 transition duration-300 hover:border-line-2`}>
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-5 w-5 fill-brand-500/50"
                  >
                    <path d="M9.5 6.5C6.5 8 5 10.4 5 13.4c0 2.5 1.5 4.1 3.6 4.1 1.9 0 3.3-1.4 3.3-3.2 0-1.8-1.3-3.1-3-3.1-.3 0-.6 0-.8.1.4-1.4 1.6-2.7 3.3-3.6l-1.9-1.2zm8.4 0c-3 1.5-4.5 3.9-4.5 6.9 0 2.5 1.5 4.1 3.6 4.1 1.9 0 3.3-1.4 3.3-3.2 0-1.8-1.3-3.1-3-3.1-.3 0-.6 0-.8.1.4-1.4 1.6-2.7 3.3-3.6l-1.9-1.2z" />
                  </svg>

                  <blockquote className="mt-3 text-[15px] leading-relaxed text-ink-2">
                    {r.text}
                  </blockquote>

                  <figcaption className="mt-5 border-t border-line pt-4">
                    <p className="text-sm font-bold text-ink">{r.author ?? "Klientka"}</p>
                    <p className="mt-0.5 text-xs text-ink-3">
                      {SOURCE_LABEL[r.source] ?? r.source}
                    </p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </>
      )}
    </Section>
  );
}

/* ---------- garancia ---------- */

export function Guarantee() {
  return (
    <Section>
      <div className="wp-lit relative overflow-hidden rounded-3xl border border-line bg-surface px-6 py-14 text-center sm:px-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(40rem_20rem_at_50%_0%,rgba(31,111,235,0.07),transparent_70%)]"
        />
        <div className="relative mx-auto max-w-3xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            {GUARANTEE.title}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-2">{GUARANTEE.body}</p>
        </div>
      </div>
    </Section>
  );
}

/* ---------- proces ---------- */

export function Process() {
  return (
    <Section id="ako-to-prebieha">
      <Heading eyebrow="Priebeh" title="Ako prebieha spolupráca" />
      <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {PROCESS.map((s, i) => (
          <li key={s.t}>
            <Reveal delay={i * 100} className="h-full">
              <div className={`${card} h-full p-6 transition duration-300 hover:border-line-2`}>
                <span className="wp-text-glow-sm flex h-8 w-8 items-center justify-center rounded-full border border-brand-500/40 bg-brand-500/10 text-sm font-extrabold text-brand-500">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-lg font-bold text-ink">{s.t}</h3>
                <p className="mt-1.5 text-sm text-ink-2">{s.d}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/* ---------- FAQ ---------- */

export function Faq() {
  return (
    <Section id="faq" panel>
      <Heading eyebrow="FAQ" title="Časté otázky" />
      <div className="mx-auto grid max-w-3xl gap-3">
        {FAQ.map((f) => (
          <details
            key={f.q}
            className="wp-glow group rounded-2xl border border-line bg-surface px-5 py-4 open:border-line-2"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-bold text-ink [&::-webkit-details-marker]:hidden">
              {f.q}
              <span className="wp-text-glow-sm text-xl leading-none text-brand-500 transition group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{f.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}

/* ---------- pata ---------- */

export function Footer() {
  return (
    <footer className="border-t border-line px-5 py-12">
      <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2">
        <div>
          <p className="text-lg font-extrabold">
            <span className="text-ink">{BRAND.name}</span>
          </p>
          <p className="mt-2 max-w-sm text-sm text-ink-2">
            Osobný tréning a vedenie — {BRAND.city}. Tréningový plán, spoločné
            tréningy a kontrola techniky.
          </p>
        </div>
        <div className="text-sm text-ink-2">
          <p>{SITE.business.name}</p>
          <p>
            IČO {SITE.business.ico} · DIČ {SITE.business.dic}
          </p>
          <p>{SITE.business.address}</p>
          {SITE.business.register ? (
            <p className="mt-1 text-xs">{SITE.business.register}</p>
          ) : null}
          <p className="mt-3">
            <a href={`mailto:${SITE.email}`} className="text-ink underline underline-offset-4">
              {SITE.email}
            </a>
          </p>
          <p className="mt-4 flex gap-4">
            <a href="/ochrana-udajov" className="underline underline-offset-4 hover:text-ink">
              Ochrana údajov
            </a>
            <a href="/obchodne-podmienky" className="underline underline-offset-4 hover:text-ink">
              Obchodné podmienky
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
