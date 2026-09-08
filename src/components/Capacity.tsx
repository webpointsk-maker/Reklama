import { CAPACITY } from "@/lib/content";

/**
 * Ukazovatel obsadenej kapacity.
 *
 * Cislo pochadza z CAPACITY v content.ts a meni sa rucne. Zamerne tu nie
 * je ziadna automatika, ktora by cislo sama zvysovala alebo nahodne menila
 * — vymyslena naliehavost je jedina vec na tejto stranke, ktoru vie
 * navstevnik odhalit jednou otazkou na telefonate.
 */
/** Slovenske sklonovanie: 1 miesto, 2–4 miesta, 5+ miest. */
function freeLabel(free: number): string {
  if (free === 1) return "Zostáva posledné miesto";
  if (free >= 2 && free <= 4) return `Voľné sú ${free} miesta`;
  return `Voľných je ${free} miest`;
}

export default function Capacity({ compact = false }: { compact?: boolean }) {
  const { taken, total, period, note } = CAPACITY;
  const free = Math.max(total - taken, 0);
  const pct = total > 0 ? Math.min((taken / total) * 100, 100) : 0;
  const full = free === 0;

  return (
    <div
      className={[
        "mx-auto w-full rounded-2xl border border-brand-500/25 bg-surface/80 backdrop-blur",
        "shadow-[0_0_40px_-18px_rgba(31,111,235,0.20)]",
        compact ? "max-w-md p-4" : "max-w-xl p-5",
      ].join(" ")}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-brand-500">
          Kapacita {period}
        </p>
        <p className="text-sm font-semibold text-ink">
          Obsadených{" "}
          <span className="tabular-nums text-brand-600">
            {taken} z {total}
          </span>{" "}
          miest
        </p>
      </div>

      {/* bodky — na prvy pohlad povedia, kolko miest zostava */}
      <div className="mt-3.5 flex gap-1.5" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={[
              "h-2 flex-1 rounded-full transition-colors",
              i < taken
                ? "bg-brand-500 shadow-[0_0_10px_-1px_rgba(31,111,235,0.45)]"
                : "bg-surface-2 ring-1 ring-inset ring-line-2",
            ].join(" ")}
          />
        ))}
      </div>

      <p className="sr-only">
        Obsadených {taken} z {total} miest {period}.
      </p>

      <p className="mt-3.5 text-[13px] leading-relaxed text-ink-2">
        {full ? (
          <>
            <span className="font-semibold text-ink">Tento mesiac je plno.</span> Formulár
            môžete vyplniť aj tak — ozveme sa vám hneď, ako sa miesto uvoľní.
          </>
        ) : (
          <>
            <span className="font-semibold text-ink">{freeLabel(free)}.</span> {note}
          </>
        )}
      </p>

      {/* rezerva pre citacky obrazovky aj pre pripad, ze bodky nevidno */}
      <div
        className="mt-3 h-1 w-full overflow-hidden rounded-full bg-surface-2"
        role="progressbar"
        aria-valuenow={taken}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`Obsadených ${taken} z ${total} miest`}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-400"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
