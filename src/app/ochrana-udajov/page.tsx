import type { Metadata } from "next";
import Link from "next/link";
import { SITE, BRAND } from "@/lib/content";
import { Legal, P, H2, Ul, Todo } from "@/components/Legal";

export const metadata: Metadata = {
  title: `Ochrana osobných údajov | ${BRAND.name}`,
  robots: { index: false, follow: false },
};

/**
 * NAVRH na pravnu kontrolu, nie pravny posudok.
 *
 * Vychadza z toho, co stranka realne robi: formular zbiera meno, telefon,
 * e-mail a odpovede, priebezne uklada rozpracovane vyplnenie, zapisuje do
 * Google Sheets, posiela e-maily cez Resend, notifikuje na Telegram a pri
 * kvalifikovanom leade odosiela udalost do Meta Conversions API.
 *
 * Ked sa nieco z toho zmeni, MUSI sa zmenit aj tento text — inak
 * vyhlasenie nesedi so skutocnostou a to je horsie nez ziadne.
 */
export default function OchranaUdajov() {
  return (
    <Legal title="Ochrana osobných údajov" updated="7. septembra 2026">
      <Todo>
        Návrh na kontrolu. Pred spustením doplň chýbajúce údaje prevádzkovateľa
        v <code>SITE</code> a daj text prejsť niekomu, kto tomu rozumie právne.
      </Todo>

      <H2>Kto spracúva vaše údaje</H2>
      <P>
        Prevádzkovateľom je {SITE.business.name}, IČO {SITE.business.ico},
        so sídlom {SITE.business.address}. Kontakt: {SITE.email}
        {SITE.phone !== "TODO" ? `, ${SITE.phone}` : ""}.
      </P>

      <H2>Aké údaje zbierame a prečo</H2>
      <P>
        Cez formulár na tejto stránke zbierame meno a priezvisko, telefónne
        číslo, e-mailovú adresu, nepovinný odkaz na profil na sociálnej sieti,
        preferovaný čas hovoru a vaše odpovede na otázky o tréningových cieľoch
        a doterajších skúsenostiach.
      </P>
      <P>
        Účelom je jediná vec: ozvať sa vám a na telefonáte zistiť, či vám vieme
        pomôcť. Údaje nepoužívame na nič iné a nikomu ich nepredávame.
      </P>
      <P>
        Právnym základom je váš súhlas, ktorý udeľujete zaškrtnutím políčka pri
        odoslaní formulára. Súhlas môžete kedykoľvek odvolať — stačí napísať na{" "}
        {SITE.email} a údaje zmažeme.
      </P>

      <H2>Rozpracovaný formulár</H2>
      <P>
        Ak formulár začnete vypĺňať a nedokončíte ho, vaše doterajšie odpovede
        sa priebežne ukladajú. Robíme to preto, aby sme vedeli, kde ľuďom
        vypĺňanie prestane dávať zmysel, a formulár podľa toho zjednodušili.
        Kým nevyplníte kontaktné údaje, nevieme, o koho ide, a ozvať sa vám
        nemôžeme.
      </P>

      <H2>Komu sa údaje dostanú</H2>
      <P>
        Údaje spracúvame pomocou týchto služieb. Každá z nich je samostatný
        sprostredkovateľ s vlastnými podmienkami:
      </P>
      <Ul
        items={[
          "Vercel — prevádzka a hosting tejto stránky",
          "Google (Google Sheets) — evidencia dopytov",
          "Resend — odosielanie potvrdzovacích e-mailov",
          "Telegram — upozornenie na nový dopyt",
          "Meta Platforms — vyhodnotenie účinnosti reklamy (viď nižšie)",
        ]}
      />

      <H2>Meta Pixel a meranie reklamy</H2>
      <P>
        Ak s tým súhlasíte v cookie lište, načíta sa meracia značka Meta Pixel,
        ktorá umožňuje vyhodnotiť, či reklama priviedla záujemcu. Bez vášho
        súhlasu sa značka nenačíta a stránka nenastaví žiadne sledovacie
        cookies.
      </P>
      <P>
        Pri odoslanom formulári posielame spoločnosti Meta informáciu o tom, že
        došlo ku kontaktu. Vaša e-mailová adresa a telefónne číslo sa pritom
        odosielajú výhradne v zašifrovanej podobe (hash), z ktorej sa pôvodný
        údaj nedá spätne prečítať.
      </P>

      <H2>Ako dlho údaje držíme</H2>
      <P>
        Dopyty uchovávame tri roky od poslednej komunikácie. Ak sa nestanete
        klientom, po uplynutí tejto doby ich zmažeme. Ak požiadate o vymazanie
        skôr, zmažeme ich bezodkladne.
      </P>

      <H2>Vaše práva</H2>
      <P>
        Máte právo na prístup k svojim údajom, na ich opravu alebo vymazanie, na
        obmedzenie spracúvania, na prenosnosť, na námietku proti spracúvaniu a
        na odvolanie súhlasu. Stačí napísať na {SITE.email}; ozveme sa
        najneskôr do jedného mesiaca.
      </P>
      <P>
        Ak si myslíte, že s vašimi údajmi nakladáme nesprávne, môžete podať
        sťažnosť na Úrad na ochranu osobných údajov Slovenskej republiky,
        Hraničná 12, 820 07 Bratislava.
      </P>

      <p className="mt-10 text-center text-sm">
        <Link href="/" className="underline underline-offset-4 hover:text-ink">
          Späť na úvod
        </Link>
      </p>
    </Legal>
  );
}
