import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Hero";
import { BRAND } from "@/lib/content";

export const metadata: Metadata = {
  title: `Ďakujeme za vyplnenie | ${BRAND.name}`,
  robots: { index: false, follow: false },
};

/**
 * Dakovna stranka pre nekvalifikovanych — teda pre toho, kto v poslednej
 * otazke oznacil "zatial len zistujem moznosti".
 *
 * Nikdy nezobrazuj "nesplnate podmienky". Clovek to povie dalej a je to
 * zbytocna zla reklama. Rovnaka informacia, opacny pocit.
 *
 * Zamerne tu nie je ziadna ponuka ani lead magnet — nesluby sa nedaju
 * porusit. Cielom je, aby clovek odisiel s dobrym pocitom a vedel, ako a
 * kedy sa vratit. Kto dnes "len zistuje", byva o pol roka klient.
 *
 * POZOR na Meta pravidla: tato stranka sa NESMIE dotknut vzhladu, vahy
 * ani nespokojnosti so sebou. Ziadne "az budete pripraveny na zmenu".
 */
export default function DakujemeNeskor() {
  return (
    <main className="min-h-screen px-5 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <div className="wp-in mb-8">
          <Logo />
        </div>

        <div className="wp-in wp-d1 rounded-card border border-line bg-surface p-7 sm:p-10">
          <h1 className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
            Ďakujem. Volať vám zatiaľ nebudem.
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-2">
            Napísali ste, že si zatiaľ len zisťujete možnosti — tak vás nebudem tlačiť
            do rozhodnutia telefonátom. Vedené tréningy dávajú zmysel až vtedy, keď si
            viete vyhradiť čas pravidelne. Predtým sú to vyhodené peniaze.
          </p>

          <div className="mt-8 border-t border-line pt-8">
            <h2 className="text-base font-bold text-ink">Čo môžete robiť dovtedy</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-2">
              Skúste štyri týždne po sebe zapísať do kalendára dva pevné termíny
              a jednoducho ich dodržať — aj keby ste v tom čase len rýchlo prešli
              trasu okolo domu. Nejde o výkon, ide o to zistiť, či ten čas v týždni
              reálne existuje. Keď vám to vyjde, ostatné sa už dá naplánovať.
            </p>
          </div>

          <p className="mt-8 rounded-xl border border-brand-500/30 bg-brand-500/12 px-5 py-4 text-[15px] font-semibold leading-relaxed text-ink">
            Nebudem vám volať ani nič ďalšie posielať. Keď budete chcieť začať,
            vyplňte formulár znova — a nájdeme si na vás čas.
          </p>
        </div>

        <p className="mt-8 text-center text-sm text-ink-2">
          <Link href="/" className="underline underline-offset-4 hover:text-ink">
            Späť na úvod
          </Link>
        </p>
      </div>
    </main>
  );
}
