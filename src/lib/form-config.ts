/**
 * Definícia kvalifikačného formulára.
 * Zdroj pravdy pre klientský formulár aj pre serverové skórovanie.
 * Zmena znenia otázok alebo možností sa robí TU, nikde inde.
 *
 * PORADIE JE ZAMERNE "KONTAKT NA DRUHOM MIESTE".
 * Povodne isiel kontakt az na koniec, za pat otazok — a prave tam vacsina
 * ludi odisla. Teraz: jedna lahka otazka na zahriatie, hned potom meno
 * a telefon, a za nimi uz len dve kliknutia. Lead mame, aj ked clovek
 * zvysok neodklika.
 *
 * ODSTRANENE (rozhodnutie zadavatela): e-mail (volame, telefon staci),
 * otvorena otazka "Čo ste skúšali", otazka na uroven ("Kde ste teraz"),
 * na vaznost, na investiciu a vyber casu hovoru.
 *
 * ZAMERNE SA NEPYTAME NA VAHU, BMI ANI NA NESPOKOJNOST S POSTAVOU.
 * Je to citlivy udaj, zbytocne znizuje dokoncenost formulara a v Meta
 * reklame je oslovovanie osobnych charakteristik zakazane.
 */


export type StepType = "single" | "contact";

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
    id: "contact",
    question: "Kam vám máme zavolať?",
    help: "Na základe vašich odpovedí vám pripravíme plán zadarmo.",
    type: "contact",
  },
  {
    id: "frequency",
    question: "Koľkokrát týždenne reálne stihnete cvičiť?",
    help: "Podľa bežného týždňa — nie podľa toho, ako by ste chceli, aby vyzeral.",
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
      { id: "later", label: "Zatiaľ sa len obzerám" },
    ],
  },
];

/** Index kontaktneho kroku — vsetko pred nim je rozohrievka, za nim doplnky. */
export const CONTACT_INDEX = STEPS.findIndex((s) => s.type === "contact");

/**
 * Odpovede, po ktorych formular SKONCI a dalej cloveka nepusti.
 *
 * Takych leadov zadavatel nechce. Clovek uvidi stranku /dakujeme-nesedi
 * ("na základe vašich odpovedí to nie je pre vás") a v tabulke dostane
 * pasmo D s poznamkou NEVOLAŤ.
 */
export const DISQUALIFYING: { step: string; option: string }[] = [
  { step: "start", option: "later" },
];
