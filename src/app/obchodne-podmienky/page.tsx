import type { Metadata } from "next";
import Link from "next/link";
import { SITE, BRAND } from "@/lib/content";
import { Legal, P, H2, Ul, Todo } from "@/components/Legal";

export const metadata: Metadata = {
  title: `Obchodné podmienky | ${BRAND.name}`,
  robots: { index: false, follow: false },
};

/**
 * NAVRH na pravnu kontrolu, nie pravny posudok.
 *
 * Dolezite: cez tuto stranku sa nic nepredava ani neplati — formular je
 * len ziadost o bezplatny telefonat. Podmienky preto popisuju, co sa
 * deje PRED spolupracou; samotna zmluva vznika az dohodou s trenerom.
 *
 * Zdravotne upozornenie nizsie NEODSTRANUJ. Pri fitness je to jedina
 * vec, ktora realne obmedzuje zodpovednost za zranenie.
 */
export default function ObchodnePodmienky() {
  return (
    <Legal title="Obchodné podmienky" updated="7. septembra 2026">
      <Todo>
        Návrh na kontrolu. Pred spustením doplň chýbajúce údaje v{" "}
        <code>SITE</code>, over podmienky rušenia tréningov a daj text prejsť
        niekomu, kto tomu rozumie právne.
      </Todo>

      <H2>Kto službu poskytuje</H2>
      <P>
        {SITE.business.name}, IČO {SITE.business.ico}, DIČ {SITE.business.dic},
        so sídlom {SITE.business.address}. Kontakt: {SITE.email}
        {SITE.phone !== "TODO" ? `, ${SITE.phone}` : ""}.
      </P>

      <H2>Čo sa deje cez túto stránku</H2>
      <P>
        Cez formulár na tejto stránke si nič nekupujete a za nič neplatíte.
        Odoslaním formulára žiadate o bezplatnú telefonickú konzultáciu, ktorá
        trvá zhruba pätnásť minút a k ničomu vás nezaväzuje.
      </P>
      <P>
        Ak vám podľa odpovedí vieme pomôcť, ozveme sa vám. Ak nie, povieme vám
        to a volať nebudeme. Zmluvný vzťah vzniká až vtedy, keď sa po
        konzultácii dohodneme na spolupráci, jej rozsahu a cene.
      </P>

      <H2>Ako spolupráca prebieha</H2>
      <Ul
        items={[
          "Tréningy prebiehajú osobne alebo online, podľa dohody.",
          "Počet tréningov v týždni sa dohaduje individuálne.",
          "Termíny sa dohadujú vopred.",
          "Zrušiť alebo presunúť tréning treba najneskôr deň vopred.",
          "Ak tréning zruší tréner, nahradí ho v tom istom týždni.",
        ]}
      />

      <H2>Čo sľubujeme a čo nie</H2>
      <P>
        Sľubujeme dodávku a starostlivosť: odtrénovanie dohodnutých tréningov,
        prejdenie techniky pri každom novom cviku, odpoveď na správu do 24 hodín
        a pravidelné vyhodnotenie plánu.
      </P>
      <P>
        <strong className="font-bold text-ink">
          Nesľubujeme konkrétny výsledok.
        </strong>{" "}
        Žiadny tréner nevie zaručiť úbytok hmotnosti, prírastok svalov ani iný
        merateľný výsledok v danom čase — závisí to od genetiky, spánku, stravy,
        stresu a od toho, koľko práce do toho vložíte vy. Ktokoľvek vám vopred
        sľubuje čísla, sľubuje niečo, čo nemá ako splniť.
      </P>

      <H2>Zdravie a bezpečnosť</H2>
      <P>
        Tréner nie je lekár ani fyzioterapeut a tréning nenahrádza lekársku
        starostlivosť. Ak máte zdravotné ťažkosti, chronické ochorenie, ste po
        úraze alebo operácii, alebo ste tehotná, poraďte sa pred začiatkom
        tréningu s lekárom.
      </P>
      <P>
        Pred prvým tréningom nás informujte o všetkých zdravotných obmedzeniach,
        ktoré by mohli mať vplyv na cvičenie. Počas tréningu dodržiavajte
        pokyny trénera; ak vás niečo bolí, prestaňte a povedzte to.
      </P>

      <H2>Ceny a platba</H2>
      <P>
        Cena sa dohaduje individuálne podľa rozsahu spolupráce a oznamuje sa na
        konzultácii pred jej začiatkom. Na tejto stránke ceny zámerne
        neuvádzame, pretože závisia od toho, čo dohodneme.
      </P>

      <H2>Ukončenie spolupráce</H2>
      <P>
        Spolupráca sa dá ukončiť ku koncu zaplateného obdobia bez udania dôvodu
        a bez výpovednej lehoty. Pri chorobe alebo úraze sa spolupráca
        pozastavuje, neukončuje.
      </P>

      <H2>Riešenie sporov</H2>
      <P>
        Ak nie ste s niečím spokojní, ozvite sa na {SITE.email} — väčšina vecí
        sa dá vyriešiť rozhovorom. Ako spotrebiteľ máte právo obrátiť sa na
        Slovenskú obchodnú inšpekciu alebo využiť platformu Európskej komisie na
        riešenie sporov online.
      </P>

      <p className="mt-10 text-center text-sm">
        <Link href="/" className="underline underline-offset-4 hover:text-ink">
          Späť na úvod
        </Link>
      </p>
    </Legal>
  );
}
