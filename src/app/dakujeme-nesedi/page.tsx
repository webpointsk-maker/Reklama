import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Hero";
import { BRAND } from "@/lib/content";

export const metadata: Metadata = {
  title: `Ďakujeme za vyplnenie | ${BRAND.name}`,
  robots: { index: false, follow: false },
};

/**
 * Dakovna stranka pre leady, ktore neprešli filtrom.
 *
 * KTO SEM PRIDE: iba clovek, ktory na otazku "Kedy chcete začať?"
 * odpovedal "Zatiaľ sa len obzerám". Formular ho po tejto odpovedi dalej
 * nepusti a posle rovno sem. Pasmo D inak nevznika — nizke skore
 * z chybajucich odpovedi znamena len pasmo C.
 *
 * Znenie urcil zadavatel. Takych leadov nechce: jeho cislo uz v tabulke
 * je (kontakt je na druhom kroku), ale riadok dostane pasmo D
 * a poznamku NEVOLAŤ.
 */
export default function DakujemeNesedi() {
  return (
    <main className="min-h-screen px-5 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-8">
          <Logo />
        </div>

        <div className="rounded-card border border-line bg-surface p-7 sm:p-10">
          <h1 className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
            Na základe vašich odpovedí sme usúdili, že to nie je pre vás.
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
