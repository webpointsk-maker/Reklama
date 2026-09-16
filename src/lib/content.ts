/**
 * Vsetky texty stranky na jednom mieste.
 * Toto je jediny subor, ktory treba menit pri uprave obsahu.
 *
 * POZOR — Meta ma pre fitness a chudnutie prisnejsie pravidla nez pre
 * ostatne odvetvia. Podrobne v BRIEF.md, sekcia "Pravidla Meta reklamy".
 * V skratke: ziadne fotky pred/po, ziadne konkretne sluby o kilogramoch
 * a ziadne oslovovanie typu "nepacite sa sami sebe".
 *
 * ============================================================
 * ZASTUPNE UDAJE — VYMEN PRED SPUSTENIM KAMPANE
 * ============================================================
 * Znacka je SPerformance, mesto Bratislava. Za znackou su dvaja
 * treneri — viz TRAINERS nizsie.
 *
 * Fakturacne udaje uz su skutocne (S Performance s.r.o.). TODO ostava
 * pri DOMENE a TELEFONE a prazdny je zapis v obchodnom registri.
 * Nikdy tam nedavaj vymyslene hodnoty — falosne ICO v pate je horsie
 * nez viditelne TODO.
 *
 * Rovnako STORIES — su oznacene `placeholder: true` a kym ten priznak
 * na niektorom pribehu ostane, stranka nad sekciou zobrazuje upozornenie,
 * ze nejde o realnych klientov.
 */

export const BRAND = {
  /** Nazov znacky. Pouziva sa ako logo, v titulkoch aj v podpise e-mailov. */
  name: "SPerformance",
  city: "Bratislava",
};

export const SITE = {
  url: "https://sperformance.webpointsk.com",
  title: `${BRAND.name} — osobný tréning ${BRAND.city}`,
  description:
    "Vedené tréningy a plán na mieru pre ľudí, ktorí chcú cvičiť pravidelne a s technikou pod kontrolou.",
  email: "petersamal.trener@gmail.com",
  phone: "TODO", // ZASTUPNE — doplnit telefon
  business: {
    name: "S Performance s.r.o.",
    ico: "57732353",
    dic: "2122908722",
    address: "Doležalova 3424/15C, 821 04 Bratislava – Ružinov",
    /**
     * Zapis v obchodnom registri — § 3a Obchodneho zakonnika ho na webe
     * s.r.o. vyzaduje spolu s obchodnym menom, sidlom, pravnou formou a ICO.
     * Tvar: "Obchodny register Mestskeho sudu Bratislava III, oddiel: Sro,
     * vlozka c. XXXXX/B". Kym je prazdny, v pate sa nezobrazi — ale CHYBA
     * TAM, doplnit pred spustenim kampane.
     */
    register: "",
  },
};

export interface Trainer {
  id: string;
  name: string;
  /** Jednoriadkovy popis — na co sa zameriava */
  role: string;
  /** Cesta do public/, alebo prazdne = zobrazi sa iniciala v kruhu */
  photo: string;
  bio: string;
}

/**
 * Treneri.
 *
 * POZOR: pocet trenerov urcuje aj TON celej stranky. Kym bol trener jeden,
 * texty boli v prvej osobe jednotneho cisla ("zostavim vam plan"). Odkedy
 * su dvaja, hovoria v mnoznom ("zostavime"). Ak by ostal jeden, treba
 * texty vratit spat — striedanie "ozvem sa" a "ozveme sa" je najviditelnejsi
 * znak toho, ze stranka vznikla kopirovanim.
 */
export const TRAINERS: Trainer[] = [
  {
    id: "peter",
    name: "Peter Sámal",
    role: "Osobný tréning a vedenie v posilňovni",
    photo: "/img/trener.png",
    bio:
      "Vedie klientov od úplných začiatkov aj po dlhšej pauze. Dbá na techniku " +
      "od prvého tréningu a plán prispôsobuje tomu, čo človeku reálne vychádza " +
      "v týždni.",
  },
  {
    /**
     * Meno je z jeho Instagramu (@p_holubcik), kde je uvedene bez
     * diakritiky ako "Peter Holubcik" — OVERIT SPRAVNY TVAR.
     *
     * ROLE A BIO SU NAPISANE NASLEPO, na ziadost zadavatela, kym pride
     * jeho vlastne znenie. Daj mu ich precitat — je to text o realnom
     * cloveku pod jeho fotkou.
     *
     * POZOR NA "vystudoval medicinu": to je JEDINE overitelne tvrdenie na
     * celej stranke o konkretnom cloveku a zadavatel ho chce mat vpredu.
     * Kym ho Peter nepotvrdi, je to riziko — nepravdive tvrdenie o vzdelani
     * je horsie nez ziadne. Formulacia je zamerne o VZDELANI a pohlade na
     * pohyb, nie o zdravotnej starostlivosti: stranka nesmie vyzerat, ze
     * tu niekto diagnostikuje alebo lieci.
     */
    id: "holubcik",
    name: "Peter Holubčík",
    role: "Vyštudovaná medicína · tréning s dôrazom na techniku",
    photo: "/img/trener-holubcik.png",
    bio:
      "Vyštudoval medicínu, takže sa na pohyb pozerá aj z pohľadu toho, ako telo " +
      "funguje a čo mu škodí. Tréningy vedie pokojne a s dôrazom na to, aby pohyb " +
      "sedel telu, ktoré ho robí. Rád pracuje s ľuďmi, ktorí sa vracajú po pauze " +
      "alebo chcú mať istotu, že cvičia správne.",
  },
];

export const HERO = {
  eyebrow: "Pre začiatočníkov aj návraty po pauze",
  headline: "Prestaňte s pokusmi a omylmi.",
  headlineAccent: "Získajte postavu vďaka presnému plánu a trénerom, ktorí dbajú na vašu techniku.",
  // Tri veci a dost: plan, spolocne treningy, dostupnost medzi nimi.
  // Detaily patria do sekcie "Co dostanete", nie do hero.
  sub:
    "Systém na mieru, bezpečné tréningy pod odborným dohľadom a neustála " +
    "podpora vždy, keď ju potrebujete.",
  cta: "Chcem nezáväznú konzultáciu",
  ctaNote: "2 minúty · 5 otázok · konzultácia po telefóne zadarmo",
  // Ked pribudne video, sem pride ID z YouTube (nastavene ako "nezaradene").
  // Kym je prazdne, hero video blok vobec nezobrazuje.
  youtubeId: "",
};

/**
 * Ukazovatel volnej kapacity.
 *
 * MOMENTALNE SA NEZOBRAZUJE — vypnuty zamerne, lebo cislo by sa muselo
 * rucne udrziavat pravdive a nepravdiva nalehavost sa vypomsti.
 * Zapnut spat: vrat <Capacity /> do src/app/page.tsx (dve miesta).
 *
 * Ked ho zapnes, DRZ TO PRAVDIVE — cislo meň rucne vzdy, ked sa realne
 * zmeni. U trenera je kapacita realna: ma obmedzeny pocet hodin v tyzdni.
 */
export const CAPACITY = {
  taken: 7,
  total: 10,
  period: "na tento mesiac",
  note:
    "Trénujeme osobne, takže máme v týždni obmedzený počet hodín. Keď sa naplnia, " +
    "ďalších klientov berieme až od nasledujúceho mesiaca.",
};

export const WHAT_YOU_GET = {
  title: "Čo dostanete",
  sub: "Nie je to plán v PDF, ktorý si otvoríte raz. Je to vedenie, ktoré vás sprevádza každý týždeň.",
  items: [
    {
      t: "Tréningový plán na mieru",
      d: "Zostavený podľa vašej úrovne, času a toho, čo vás nebolí. Meníme ho priebežne, nie raz za pol roka.",
    },
    {
      t: "Stravovacie odporúčania",
      d: "Jednoduché pravidlá do vášho bežného dňa. Žiadny jedálniček, kde sa dokola opakuje päť jedál, ani zoznam zakázaných potravín.",
    },
    {
      t: "Spoločné tréningy",
      d: "Trénujeme spolu v posilňovni a vedieme vás od rozcvičky po posledný cvik. Koľkokrát týždenne, na tom sa dohodneme podľa toho, čo vám vychádza.",
    },
    {
      t: "Kontrola techniky",
      d: "Každý nový cvik si prejdeme spolu. Zlá technika je najrýchlejšia cesta k tomu, aby ste skončili.",
    },
    {
      t: "Komunikácia medzi tréningami",
      d: "Napíšete nám na WhatsApp a odpovieme do 24 hodín — či ide o cvik, jedlo alebo o to, že vám niečo nesadlo.",
    },
    {
      t: "Pravidelné vyhodnotenie",
      d: "Raz za štyri týždne si sadneme nad tým, čo funguje a čo nie, a plán podľa toho upravíme.",
    },
  ],
  /** Co je na klientovi. Drz to na 2 polozkach a bez zmienky o platbe. */
  yours: [
    {
      t: "Prídete na tréning",
      d: "V časoch, na ktorých sa vopred dohodneme. Keď nestíhate, dáte vedieť deň dopredu.",
    },
    {
      t: "Držíte sa plánu medzi tréningami",
      d: "Nie dokonale. Stačí, keď nám poviete, keď sa to nepodarí — podľa toho plán upravíme.",
    },
  ],
};

export const FOR_WHOM = {
  title: "Pre koho to je — a pre koho nie",
  yes: {
    title: "Sadneme si, ak",
    items: [
      "chcete systém namiesto náhodných tréningov",
      "viete si na tréning pravidelne vyhradiť čas",
      "chcete, aby vám niekto strážil techniku, nie iba počítal opakovania",
      "skúšali ste to sami a po pár týždňoch to vždy vyšumelo",
    ],
  },
  no: {
    title: "Radšej si nevoláme, ak",
    items: [
      "hľadáte rýchle riešenie na pár týždňov",
      "chcete len plán do e-mailu bez spoločných tréningov",
      "neviete sa zaviazať ani na jeden tréning týždenne",
    ],
  },
};

export interface Story {
  id: string;
  person: string;
  situation: string;
  work: string;
  result: string;
  resultNote: string;
  placeholder?: boolean;
}

/**
 * Pribehy klientov — struktura "vychodisko / co sme robili / vysledok".
 *
 * ZAMERNE PRAZDNE. Boli tu tri vymyslene pribehy, ktore sa nahradili
 * realnymi recenziami nizsie. Sekcia sa pri prazdnom poli vobec
 * nezobrazi, takze stranka nema dieru.
 *
 * Ak sem raz pribudnu realne pribehy: ku kazdemu udaju maj podklad a
 * pisomny suhlas klienta, vysledok formuluj ako PROCES (co uz zvladne,
 * ako dlho trenuje), nie ako kilogramy — inak je to porusenie pravidiel
 * Meta reklamy. Fotky pred/po na stranku NEDAVAJ, viz BRIEF.md.
 */
export const STORIES: Story[] = [];

export type ReviewSource = "facebook" | "google" | "sprava";

export interface Review {
  id: string;
  text: string;
  /** Meno tak, ako je zverejnene pri recenzii. Pri sprave nechaj prazdne. */
  author?: string;
  source: ReviewSource;
}

/**
 * Realne recenzie.
 *
 * Prepisane zo screenshotov z Facebooku, Googlu a zo sprav od klientov.
 * Text je ponechany v povodnom zneni vratane chybajucich diakritik —
 * upravovanie by z nich spravilo marketingovy text a to je presne to,
 * comu ludia neveria.
 *
 * MENA SU ZAMERNE SKRATENE na krstne meno a inicialu. Verejne odporucanie
 * na Facebooku nie je to iste ako suhlas so zverejnenim na webe, a skratene
 * meno je slabsi osobny udaj — clovek sa cez neho neda bezne identifikovat.
 * Dve Lucie su odlisene inicialou (Lucia T. a Lucia M.), aby nevyzerali
 * ako jedna osoba.
 *
 * Ak si od klientov vypytas pisomny suhlas, mozes cele mena vratit —
 * plne meno je silnejsi dokaz nez inicialka.
 */
export const REVIEWS: Review[] = [
  {
    id: "r-anit",
    author: "Anit Š.",
    source: "facebook",
    text:
      "Trénera odporúčam všetkými desiatimi, som veľmi spokojná. Tréningy prispôsobuje " +
      "individuálne podľa mojich potrieb a cieľov, vie správne motivovať, dbá na správnu " +
      "techniku cvikov. Na každý tréning sa teším a výsledky hovoria za všetko.",
  },
  {
    id: "r-denisa",
    author: "Denisa S.",
    source: "facebook",
    text:
      "Peťo je tréner, ktorého som našla čisto náhodne na FB. Rozhodla som sa ho skontaktovať " +
      "a začali sme tréningy. Oceňujem jeho nadšenie pre prácu trénera a s tým spojené " +
      "odovzdávanie množstva rád či skúsenosti a takisto profesionálny prístup. Peťo vždy " +
      "motivuje, keď treba poradiť, povzbudí a obohatí tréning svojím humorom. Odporúčam " +
      "všetkými desiatimi a ak hľadáte super trénera, tak už ďalej nehľadajte!",
  },
  {
    id: "r-lucia-t",
    author: "Lucia T.",
    source: "facebook",
    text:
      "Peto je skvely a profesionalny trener. Je vidieť, ze ho tato profesia napĺňa a napreduje " +
      "v nej, zaujíma sa o nove informacie, vzdelava sa v obore. Mne osobne pomohol s bolestami " +
      "chrbtice. Zvolil individualny trening a po par mesiacoch je po bolesti. Ako bonus je " +
      "skvely clovek a vela sa spolu pri treningoch nasmejeme.",
  },
  {
    id: "r-dagmar",
    author: "Dagmar B.",
    source: "facebook",
    text:
      "Peťo je tréner s vždy dobrou náladou, vie človeka vždy dobre naladiť a povzbudiť. Po celý " +
      "čas tréningu dohliada, aby ste cvičili správne. Nie je to typ trénera, ktorý sa o vás " +
      "nezaujíma, práve naopak. Kladie dôraz na každý detail a zároveň všetko názorne predvedie. " +
      "Aj keď sú cvičenia s Peťom dosť náročné, vždy odchádzam s dobrým pocitom. Odporúčam " +
      "každému, kto chce niečo so sebou urobiť a posunúť sa ďalej.",
  },
  {
    id: "r-zdenka",
    author: "Zdenka R.",
    source: "facebook",
    text:
      "Tých niekoľko mesiacov strávených s Peťom bolo jedným z najlepších rozhodnutí. Aj napriek " +
      "mojim, niekedy častým rečiam a túžbe, aby boli výsledky viditeľné hneď, trpezlivo " +
      "odpovedal, že to príde. A čuduj sa svete, mal pravdu. Tréningy s ním neboli len o makačke, " +
      "aj keď niekedy dávali zabrať, ale aj o príjemne strávenom čase s človekom, s ktorým sa dá " +
      "porozprávať a zasmiať.",
  },
  {
    id: "r-matus",
    author: "Matúš P.",
    source: "google",
    text:
      "S Peťom som trénoval niečo cez rok a za ten som sa dosť posunul. Vždy sa s ním dalo aj " +
      "pokecať, ale hlavne aj zamakať. Hlavne mi vyhovoval jeho systematický postup k tréningom " +
      "a ich organizácia. Výborný tréner, odporúčam.",
  },
  {
    id: "r-lucia-m",
    author: "Lucia M.",
    source: "facebook",
    text:
      "Najlepší tréner. Aj keď som musela prerušiť tréningy kvôli zdravotným problémom, Peťko vie, " +
      "že ma má o chvíľku naspäť na krku a makáme ďalej. Okrem toho, že je skvelý tréner, vždy ma " +
      "podporil aj v iných veciach a za to som mu neskutočne vďačná.",
  },
  {
    id: "r-sprava-1",
    source: "sprava",
    text:
      "Ja ti moc ďakujem za všetky tvoje rady a osobitný prístup. Škoda, že ma skôr nenapadlo " +
      "poradiť sa s niekým, kto sa tomu naozaj rozumie. Teším sa neskutočne, že v podstate " +
      "bezbolestne vidím na sebe výsledky. Ak niekto zo známych bude potrebovať guidance, hneď " +
      "im posuniem kontakt.",
  },
  {
    id: "r-sprava-2",
    source: "sprava",
    text:
      "Neskutočný klobúk dole pred tebou, že takto pracuješ a stále sa vzdelávaš. Lebo nie každý " +
      "je taký a myslí si, že už má nejaké vzdelanie a papier, že to stačí.",
  },
  {
    id: "r-sprava-3",
    source: "sprava",
    text:
      "Musím Ti to napísať, veľmi ma potešilo, že som znova obliekla také biele sako, čo som mala " +
      "doma. Dva mesiace dozadu ešte nie.",
  },
];

/**
 * Screenshoty recenzii v povodnej podobe.
 *
 * Prazdne — obrazky treba ulozit do public/img/reviews a zapisat sem.
 * Screenshot je silnejsi dokaz nez prepisany text, lebo je na nom vidiet
 * zdroj. Ked sem pribudnu, zobrazia sa POD prepisanymi recenziami.
 */
export const REVIEW_SHOTS: { src: string; alt: string }[] = [];

export const PROCESS = [
  {
    t: "Vyplníte formulár",
    d: "Päť otázok, dve minúty. Potrebujeme vedieť, či vám vieme reálne pomôcť.",
  },
  {
    t: "Zavoláme vám",
    d: "Konzultácia po telefóne, zhruba 15 minút a nič za ňu neplatíte. Prejdeme, čo chcete dosiahnuť a či vám vieme pomôcť.",
  },
  {
    t: "Úvodná konzultácia",
    d: "Stretneme sa na dvadsaťminútový pokec, kde sa bližšie porozprávame o tom, čo chcete dosiahnuť a ako vám s tým vieme pomôcť. Keď to bude dávať zmysel obom stranám, dohodneme prvé tréningy a cenu za spoluprácu.",
  },
  {
    t: "Prvý tréning",
    d: "Býva do týždňa. Prejdeme zdravotnú anamnézu, pozrieme sa, ako sa hýbete, a skúsime prvé cviky. Stačí športové oblečenie, obuv do posilňovne a fľaša na vodu.",
  },
];

export const FAQ = [
  {
    q: "Musím už niečo vedieť alebo mať kondíciu?",
    a: "Nie. Väčšina ľudí k nám prichádza po dlhšej pauze alebo úplne od nuly. Prvé tréningy sú o tom naučiť sa pohyb správne, nie o výkone.",
  },
  {
    q: "Koľkokrát týždenne musím chodiť?",
    a: "Koľko si dohodneme. Väčšina ľudí chodí dvakrát týždenne, ale začať sa dá aj raz. Dôležitejšie než počet je pravidelnosť — jeden tréning každý týždeň spraví viac než štyri raz za mesiac.",
  },
  {
    q: "Čo ak nestíham alebo ochoriem?",
    a: "Tréning presunieme, stačí dať vedieť deň dopredu. Po chorobe alebo úraze si zameškané tréningy postupne dobehneme.",
  },
  {
    q: "Viažem sa na dlhé obdobie?",
    a: "Nie. Funguje to po mesiacoch a skončiť môžete kedykoľvek ku koncu zaplateného mesiaca.",
  },
  {
    q: "Musím držať prísnu diétu?",
    a: "Nie. Dostanete niekoľko jednoduchých pravidiel, ktoré sa dajú dodržať aj v práci a na obede s kolegami. Nič nezakazujeme.",
  },
];

/**
 * POZOR: ak sem das akykolvek zavazok, musis ho vediet splnit.
 * Garancia VYSLEDKU sa pri fitness v Meta reklame pouzivat NESMIE —
 * preto je tu garantovana dodavka a starostlivost, nie cisla.
 */
export const GUARANTEE = {
  title: "Čo vám vieme sľúbiť",
  body:
    "Nesľubujeme vám zázraky za 30 dní. Sľubujeme vám 100 % podporu, precízny systém " +
    "a to, že vás naučíme, ako sa starať o svoje telo udržateľne, bez jojo efektu. " +
    "Odtrénujeme s vami všetky dohodnuté tréningy, na každom novom cviku si s vami " +
    "prejdeme techniku, na správu odpovieme do 24 hodín a raz za štyri týždne plán " +
    "spolu prehodnotíme. Ak niektorý tréning zrušíme my, nahradíme ho v tom istom " +
    "týždni. Koľko toho zo svojej strany urobíte vy, ovplyvniť nevieme — a nikto, kto " +
    "vám vopred sľubuje čísla, to nevie tiež.",
};
