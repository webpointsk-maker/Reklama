"use client";

import { useState } from "react";

/**
 * YouTube sa nacita az po kliku na nahlad.
 * Skript prehravaca je tazky a na mobile z Meta reklamy je kazda desatina
 * sekundy nacitania vidiet na konverzii.
 */
export default function VideoEmbed({
  youtubeId,
  title = "Ako to robím",
}: {
  youtubeId: string;
  title?: string;
}) {
  const [playing, setPlaying] = useState(false);

  // Žiara ide priamo na rám — rozptýlené halo za videom prekryje samotný
  // prehrávač a navonok z neho ostane len sotva viditeľný opar.
  const frame =
    "relative aspect-video w-full overflow-hidden rounded-2xl border border-brand-500/25 bg-surface " +
    "shadow-[0_0_0_1px_rgba(31,111,235,0.12),0_0_60px_-12px_rgba(31,111,235,0.16),0_30px_100px_-30px_rgba(13,21,32,0.14)]";

  if (!youtubeId) {
    return (
      <div className={`${frame} flex items-center justify-center`}>
        <div className="px-6 text-center">
          <p className="text-sm font-bold text-ink">Sem príde hlavné video</p>
          <p className="mt-1.5 text-sm text-ink-2">
            Doplň ID z YouTube do{" "}
            <code className="rounded bg-surface-2 px-1.5 py-0.5 text-ink">
              HERO.youtubeId
            </code>{" "}
            v súbore{" "}
            <code className="rounded bg-surface-2 px-1.5 py-0.5 text-ink">
              src/lib/content.ts
            </code>
          </p>
        </div>
      </div>
    );
  }

  if (!playing) {
    return (
      <button
        type="button"
        onClick={() => setPlaying(true)}
        aria-label="Prehrať video"
        className={`${frame} group block`}
      >
        <img
          src={`https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`}
          alt=""
          className="h-full w-full object-cover opacity-80 transition group-hover:opacity-100"
          loading="eager"
        />
        <span className="absolute inset-0 flex items-center justify-center bg-ground/25">
          <span className="wp-pulse relative flex h-16 w-16 items-center justify-center rounded-full bg-brand-500 shadow-[0_0_40px_rgba(31,111,235,0.30)] transition duration-300 group-hover:scale-110 sm:h-20 sm:w-20">
            <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-white sm:h-8 sm:w-8">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
      </button>
    );
  }

  return (
    <div className={frame}>
      <iframe
        className="h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
