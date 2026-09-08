/**
 * Definícia kvalifikačného formulára.
 * Zdroj pravdy pre klientský formulár aj pre serverové skórovanie.
 * Zmena znenia otázok alebo možností sa robí TU, nikde inde.
 *
 * PRECO JE TENTO FORMULAR KRATSI NEZ VO WEBPOINTE:
 * tam sa kvalifikoval podnikatel na sluzbu za 600 € mesacne, tu clovek
 * na osobny trening. Cena je radovo nizsia, takze aj ochota vyplnat
 * formular je nizsia. Osem otazok by tu polovicu ludi odradilo.
 * Pat otazok je horna hranica — ak budes chciet pridavat, radsej
 * najprv zvaz, ci sa to neda zistit na telefonate.
 *
 * ZAMERNE SA NEPYTAME NA VAHU, BMI ANI NA NESPOKOJNOST S POSTAVOU.
 * Je to citlivy udaj, zbytocne znizuje dokoncenost formulara a v Meta
 * reklame je oslovovanie osobnych charakteristik zakazane.
 */


export type StepType = "single" | "text" | "contact";

export interface Option {
  id: string;
  label: string;
}

export interface Step {
  id: string;
  question: string;
  help?: string;
  type: StepType;
  options?: Option[];
  /** minimálny počet znakov pri type "text" */
  minLength?: number;
  placeholder?: string;
}

export const STEPS: Step[] = [
  {
    id: "goal",
    question: "Čo chcete tréningom dosiahnuť?",
    type: "single",
    options: [
      { id: "lose", label: "Schudnúť a spevniť sa" },
      { id: "muscle", label: "Nabrať svalovú hmotu" },
      { id: "health", label: "Zlepšiť kondíciu a cítiť sa lepšie" },
      { id: "pain", label: "Zbaviť sa bolestí chrbta alebo zlého držania tela" },
      { id: "performance", label: "Pripraviť sa na konkrétny výkon alebo súťaž" },
    ],
  },
  {
    id: "level",
    question: "Kde ste teraz?",
    type: "single",
    options: [
      { id: "none", label: "Necvičím vôbec" },
      { id: "sometimes", label: "Cvičím občas, nepravidelne" },
      { id: "regular_noresult", label: "Cvičím pravidelne, ale nikam sa to nehýbe" },
      { id: "had_trainer", label: "Už som mal(a) trénera" },
    ],
  },
  {
    id: "frequency",
    question: "Koľkokrát týždenne reálne stihnete cvičiť?",
    help: "Odpovedzte úprimne podľa toho, ako vyzerá bežný týždeň — nie podľa toho, ako by ste chceli, aby vyzeral.",
    type: "single",
    options: [
      { id: "f1", label: "1×" },
      { id: "f2", label: "2×" },
      { id: "f3", label: "3×" },
      { id: "f4", label: "4× a viac" },
    ],
  },
  {
    id: "start",
    question: "Kedy chcete začať?",
    type: "single",
    options: [
      { id: "now", label: "Čo najskôr" },
      { id: "month", label: "Do mesiaca" },
      { id: "later", label: "Zatiaľ len zisťujem možnosti" },
    ],
  },
  {
    /**
     * Otvorena otazka namiesto dalsieho vyberu z moznosti.
     *
     * PRECO PRAVE TAKATO FILTRUJE NAJLEPSIE: kto nie je ochotny napisat
     * dve vety, nepride ani na telefonat. Vyber z moznosti sa odklikne
     * bez rozmyslu, text nie — a to je presne ten rozdiel medzi clovekom,
     * ktory to riesi, a clovekom, ktory sa obzera.
     *
     * Druhy efekt: je to jedina odpoved, s ktorou sa da zacat telefonat.
     * Trener vie dopredu, o com hovor bude.
     *
     * Nepyta sa na peniaze ani na vahu — oboje znizuje dokoncenost
     * a pri vahe to navyse zakazuju pravidla Meta reklamy.
     */
    id: "note",
    question: "Čo ste doteraz skúšali a prečo to nevyšlo?",
    help: "Stačia dve vety. Podľa toho vieme, či vám vieme pomôcť a čo by sme robili inak.",
    type: "text",
    minLength: 40,
    placeholder:
      "Napríklad: chodil som do posilňovne sám, ale po mesiaci ma to prestalo baviť, lebo som nevidel žiadnu zmenu a nevedel som, či cvičím správne.",
  },
  {
    id: "contact",
    question: "Kam sa vám mám ozvať?",
    type: "contact",
  },
];

export const CALL_TIME_OPTIONS: Option[] = [
  { id: "morning", label: "Dopoludnia (9 – 12)" },
  { id: "afternoon", label: "Popoludní (12 – 17)" },
  { id: "evening", label: "Podvečer (17 – 20)" },
  { id: "any", label: "Kedykoľvek" },
];

/**
 * Odpovede, po ktorych lead nejde na telefonat.
 *
 * Nevyhadzujeme ho — dostane inu dakovnu stranku bez ponuky a ozve sa
 * sam, ked bude pripraveny. Dnesne "este nie" byva buducorocny klient.
 *
 * Otazka na dostupnost tu bola a bola odstranena — Peter robi aj online
 * vedenie, takze mesto nerozhoduje o tom, ci sa da spolupracovat.
 */
export const DISQUALIFYING: { step: string; option: string }[] = [
  { step: "start", option: "later" },
];
