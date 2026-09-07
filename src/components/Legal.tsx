import { Logo } from "./Hero";

/**
 * Spolocna kostra pravnych stranok.
 *
 * Su to jedine stranky na webe, kde ide o citatelnost dlheho textu, nie
 * o konverziu — preto uzsi stlpec, vacsi riadkovy prestup a ziadne
 * animacie ani svetelne efekty.
 */
export function Legal({
  title,
  updated,
  children,
}: {
  title: string;
  /** datum poslednej zmeny — pri pravnom texte to clovek hlada ako prve */
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen px-5 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-10">
          <Logo />
        </div>

        <h1 className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-sm text-ink-3">Naposledy upravené {updated}</p>

        <div className="mt-10 text-ink-2">{children}</div>
      </div>
    </main>
  );
}

export function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-10 text-lg font-bold text-ink first:mt-0">{children}</h2>
  );
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 text-[15px] leading-relaxed">{children}</p>;
}

export function Ul({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 grid gap-2 text-[15px] leading-relaxed">
      {items.map((t) => (
        <li key={t} className="flex gap-3">
          <span className="mt-2.5 h-px w-3 flex-none bg-ink-3/60" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

/** Upozornenie pre teba, nie pre navstevnika — pred spustenim vyries. */
export function Todo({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-8 rounded-xl border border-dashed border-brand-500/40 bg-brand-500/8 px-4 py-3 text-sm text-brand-400">
      {children}
    </p>
  );
}
