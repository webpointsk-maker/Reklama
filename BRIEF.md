# Landing page pre fitness trénera — zadanie a stav

> **Pre nový chat:** prečítaj tento súbor a pokračuj podľa neho.
> Projekt už beží, kompiluje sa a má hotovú celú technickú časť.
> Chýba obsah a rozhodnutia označené `TODO`.

Kostra vznikla odvodením z projektu **WebPoint** (`C:\Users\mdhol\Desktop\WebPointReklama`),
kde je rovnaký systém nasadený pre marketingovú agentúru. Technika je overená
a otestovaná — sem sa prebrala celá, mení sa obsah, farby a otázky vo formulári.

---

## Ako to spustiť

```bash
npm install
```

```bash
npm run dev
```

Beží na **http://localhost:3001** (zámerne iný port než WebPoint na 3000,
aby sa dali spustiť oba naraz). Alebo dvojklik na `SPUSTIT-WEB.cmd`.

**Nikdy nespúšťaj `npm run build`, kým beží `npm run dev`** — build prepíše
priečinok `.next` a dev serveru sa rozsypú chunky.

---

## Čo je hotové

| Časť | Stav |
|---|---|
| Tmavý dizajn + systém svetelných efektov | hotové, prefarbené na modro-čiernu |
| Animácie (nábeh, odhaľovanie pri skrolovaní, hover) | hotové |
| Päťkrokový kvalifikačný formulár | hotové, znenia v `src/lib/form-config.ts` |
| Skórovanie leadov A/B/C/D | hotové, `src/lib/scoring.ts` |
| Priebežné ukladanie rozpracovaných formulárov | hotové, vlastný hárok „Rozpracované" |
| Zápis leadov do Google Sheets | hotové, treba len premenné prostredia |
| E-maily (Resend) + notifikácia na Telegram | hotové, treba premenné prostredia |
| Meta Pixel + Conversions API | hotové, treba Pixel ID |
| Dve ďakovné stránky (kvalifikovaný / nepripravený) | hotové, texty napísané pre telefonát |
| Ukazovateľ voľnej kapacity | hotové, číslo v `CAPACITY` |

Bez premenných prostredia sa integrácie len vypíšu do konzoly, takže
formulár sa dá prejsť hneď. Vzor premenných je v `.env.example`.

---

## Čo treba doplniť

Stránka je **obsahovo hotová a dá sa pozrieť celá** — texty vo `content.ts` sú
napísané, nie sú to už `TODO`. Ostáva ich nahradiť skutočnosťou.

**Zástupné (vymyslené) údaje — vymeniť pred spustením kampane:**

1. **Zvyšok identity** — meno (Peter Samal) je doplnené, ale mesto, doména,
   telefón, e-mail, obchodné meno, IČO a adresa sú stále zástupné. Sú v `SITE`
   v `content.ts`, každý riadok označený `ZASTUPNE`.
2. **Recenzie sú podpísané krstným menom a iniciálou** (Anit Š., Dagmar B.,
   Matúš P. …), lebo verejné odporúčanie na Facebooku nie je to isté ako súhlas
   so zverejnením na webe. Ak si od klientov vypýtaš písomný súhlas, celé mená
   sa dajú vrátiť — plné meno je silnejší dôkaz než iniciála.
3. **Overiť zvyšné tvrdenia o službe** — frekvencia je už riešená ako
   „podľa dohody", ale texty stále sľubujú odpoveď na WhatsApp do 24 hodín,
   vyhodnotenie raz za štyri týždne a náhradu tréningu zrušeného trénerom
   v tom istom týždni. Ak to tak nerobí, treba to prepísať.

**Čo ešte chýba úplne:**

4. **Screenshoty recenzií** → nahrať do `public/img/reviews`. Načítajú sa samé,
   netreba nič dopisovať do kódu. Kým je priečinok prázdny, stránka zobrazuje
   prepísané recenzie z `REVIEWS`; prvým nahratým obrázkom sa prepne na
   screenshoty a text sa prestane zobrazovať.
5. **Nové screenshoty správ** → nahrať do `public/img/uspechy`. Tiež sa
   načítajú samé. Pred nahratím si over, že neobsahujú konkrétne čísla
   o chudnutí ani zameranie na vzhľad — inak hrozí zamietnutie reklamy.
5. **Video** → YouTube ako „nezaradené", ID do `HERO.youtubeId`. Kým je prázdne,
   hero video blok vôbec nezobrazuje — stránka tým nevyzerá nedokončene.
6. **Ochrana osobných údajov + obchodné podmienky + cookie lišta** — povinné,
   stránky ešte neexistujú, hoci pätička aj formulár na ne odkazujú
7. **Vlastné logo** — komponenta `Logo` v `src/components/Hero.tsx` zatiaľ
   vypisuje `TRAINER.name` ako text
8. **Premenné prostredia** podľa `.env.example` (Sheets, Resend, Telegram, Pixel)

## Rozhodnutia, ktoré už padli (prevzaté z WebPointu)

Boli overené v praxi na predošlom projekte, netreba ich znova riešiť:

- **Tmavý dizajn**, nie biele pozadie
- **Formulár hneď pod videom**, teda úplne hore — nie na konci stránky
- **Žiadny cenník na stránke**
- **Sľubujeme proces a dodávku, nikdy nie výsledok**
- **Nekvalifikovaného neodmietame natvrdo** — dostane inú ďakovnú stránku
  bez ponuky, s jasnou cestou, ako sa vrátiť
- **Ukazovateľ kapacity sa mení ručne** a musí byť pravdivý
- Texty na jednom mieste (`content.ts`), obsah sa needituje v komponentoch

Rozhodnuté priamo pre tento projekt (7. 9. 2026):

- **Tréner je Peter Sámal.** Mesto, doména, telefón, e-mail a fakturačné údaje
  sú zatiaľ zástupné — v `SITE` v `content.ts`, označené `ZASTUPNE`.
- **Konzultácia je telefonická a zadarmo.** Osobné stretnutie zadarmo nie je —
  prvé osobné je už platený tréning. Priebeh má preto kroky: formulár →
  bezplatný hovor → dohoda o forme a cene → prvý tréning.
- **Frekvencia tréningov nie je fixná**, dohaduje sa s klientom. Texty preto
  nikde netvrdia „2× týždenne" — bolo to na piatich miestach a keby to tréner
  robil inak, bol by to sľub, ktorý nevie splniť.
- **Ukazovateľ kapacity je vypnutý.** Číslo by sa muselo ručne udržiavať
  pravdivé; nepravdivá naliehavosť sa vypomstí. Komponenta aj `CAPACITY`
  ostávajú v projekte — zapnutie je vrátenie `<Capacity />` do `page.tsx`.

- **Lead sa kontaktuje telefonátom**, tak ako vo WebPointe. Vo formulári preto
  ostáva výber času volania, ďakovná stránka sľubuje hovor ešte dnes a e-mail
  leadovi hovorí to isté. Ak sa to niekedy zmení na správu alebo kalendár,
  treba prepísať `src/app/dakujeme/page.tsx`, `mailLead` v `src/lib/notify.ts`
  a kontaktný krok v `QualForm.tsx`.
- **Farby sú modro-čierne.** Podklad `#05070b`, akcent `#1f6feb`, doplnková
  azúrová len na svetelné efekty. Modrá na tlačidlách je zámerne tmavšia, aby
  na nej bol biely text čitateľný (kontrast 4,63:1). Svetlejší `brand-400`
  slúži na text na tmavom podklade, nie na plochy. Ak príde logo trénera
  s inou modrou, mení sa len `@theme` v `globals.css`.

---

## Čo je tu inak než vo WebPointe — a prečo

**Formulár má 6 otázok.** Pôvodne ich bolo 5 (WebPoint mal 8, ale ten
kvalifikoval podnikateľa na službu za 600 € mesačne). Na výslovnú žiadosť
zadávateľa pribudli dve otázky, aby chodili kvalitnejšie leady:

**Formulár má 5 otázok, posledná je otvorená.** Otázka na dostupnosť
(„Viete sa dostať na tréning do mesta X?") tu bola a bola odstránená —
Peter robí aj online vedenie, takže mesto nerozhoduje o tom, či sa dá
spolupracovať. Rovnako bola odstránená otázka na odhodlanie.

Namiesto nich je **otvorená otázka „Čo ste doteraz skúšali a prečo to
nevyšlo?"** s minimom 40 znakov a 6 slov.

Filtruje inak než výber z možností a je to zámer:

- **Filtruje odchodom z formulára, nie skóre.** Kto nie je ochotný napísať
  dve vety, formulár nedokončí — tlačidlo Pokračovať je do splnenia minima
  vypnuté. To je silnejší filter než akékoľvek bodovanie, lebo zlý lead
  sa do tabuľky vôbec nedostane.
- **Nedá sa obísť medzerami** — počíta sa text po zlúčení medzier a zároveň
  musí mať aspoň 6 slov.
- **Je to jediná odpoveď, s ktorou sa dá začať telefonát.** Tréner vie
  dopredu, o čom hovor bude.
- V skóre má 16 bodov podľa dĺžky odpovede (140+ znakov = plný počet).
  Zámerne nerozhoduje o pásme — kto chce začať hneď a stíha trikrát
  týždenne, je dobrý lead aj so stručnou odpoveďou.

**Prečo nie otázka na rozpočet:** je to najsilnejší filter na papieri, ale
zároveň najväčší dôvod nedokončenia. Keďže konzultácia je bezplatný
15-minútový hovor, cenu odfiltruje ten hovor lacnejšie. Navyše zatiaľ nie sú
známe Petrove ceny, a vymyslené cenové pásma by ľudí ukotvili nesprávne.

**Bodovanie:** kedy začať 34, frekvencia 28, úsilie v odpovedi 16,
úroveň 16, cieľ 6. Diskvalifikátor ostal jeden: „zatiaľ len zisťujem".

**Skórujeme pripravenosť, nie kúpyschopnosť.** Tam rozhodoval obrat a
rozpočet. Tu rozhoduje *kedy chce začať* a *koľkokrát týždenne reálne stihne
cvičiť* — to sú najlepšie prediktory toho, či klient vydrží dlhšie než mesiac.

**Nepýtame sa na váhu, BMI ani na nespokojnosť s postavou.** Je to citlivý
údaj, znižuje dokončenosť formulára a v Meta reklame je oslovovanie osobných
charakteristík zakázané.

**Hovorí jeden človek, nie tím.** Vo WebPointe boli texty v množnom čísle
(„ozveme sa vám"). Tu je za tým jeden tréner, takže celá stránka, ďakovné
stránky aj e-maily hovoria v prvej osobe jednotného čísla. Keď budeš pridávať
text, drž sa toho — striedanie „ozvem sa" a „ozveme sa" je najviditeľnejší
znak toho, že web vznikol kopírovaním.

---

## Pravidlá Meta reklamy — fitness má prísnejšie než ostatné odvetvia

Toto je najväčšie riziko celej kampane. Porušenie znamená zamietnutú reklamu
alebo zablokovaný účet, a pri opakovaní aj trvalý zákaz inzercie.

| Nepoužívať | Použiť namiesto toho |
|---|---|
| Fotky **pred/po** a fotky detailov postavy | Fotky z tréningu, technika cviku, atmosféra |
| „Schudnite 10 kg za mesiac" | „Tréningový plán a vedenie na mieru" |
| „Nepáčite sa sami sebe?" · „Hanbíte sa za svoje telo?" | „Chcete začať cvičiť s vedením?" |
| Zameriavanie na váhu alebo vzhľad diváka | Zameriavanie na cieľ a na to, čo služba obsahuje |
| Garancia výsledku | Garancia počtu tréningov a starostlivosti |

Pravidlo Mety hovorí, že reklama nesmie naznačovať znalosť osobných
charakteristík diváka ani vyvolávať negatívne vnímanie vlastného tela.
Pri fitness sa to porušuje najľahšie zo všetkých odvetví.

Rovnaké pravidlá platia aj pre **cieľovú stránku**, nielen pre reklamu —
Meta ju kontroluje tiež.

---

## Kde čo je

| Cesta | Čo tam je |
|---|---|
| `src/lib/content.ts` | **všetky texty** — jediný súbor na úpravu obsahu |
| `src/lib/form-config.ts` | znenia otázok formulára |
| `src/lib/scoring.ts` | bodovanie leadu a pásma A/B/C/D |
| `src/lib/sheets.ts` | zápis do Google Sheets |
| `src/lib/notify.ts` | e-maily + Telegram |
| `src/lib/meta.ts` | Conversions API |
| `src/app/globals.css` | farby (`@theme`), animácie, svetelné efekty |
| `src/components/Sections.tsx` | bloky stránky |
| `src/components/form/QualForm.tsx` | formulár |
| `src/components/Capacity.tsx` | ukazovateľ voľných miest |

---

## Prvé kroky v novom chate

Kontaktná cesta, farby aj texty sú hotové. Ostáva pravda a právne veci:

1. Vymeniť **identitu trénera** v `SITE` a `TRAINER` za skutočnú
2. Prejsť texty s trénerom a **overiť každý konkrétny sľub** (frekvencia
   tréningov, časy odpovedí, náhrady zrušených tréningov)
3. Nahradiť **ilustračné príbehy** reálnymi a odstrániť `placeholder: true`
4. Dopísať `/ochrana-udajov` a `/obchodne-podmienky` a cookie lištu,
   ktorá spúšťa Pixel až po súhlase

## Čo sa spravilo 7. 9. 2026

- Prefarbenie na modro-čiernu paletu (`@theme` v `globals.css` + natvrdo
  zapísané farby vo svetelných efektoch)
- Prepísané obe ďakovné stránky — mali ešte text marketingovej agentúry
  („zatiaľ vám platenú reklamu neodporúčame")
- Odstránené pole **Názov firmy** z kontaktného kroku a všade, kde sa ťahalo
- **Oprava zápisu do Google Sheets:** `SHEET_HEADER` mala ešte 20 stĺpcov
  z WebPointu (Firma, Odvetvie, Obrat, Rozpočet), zatiaľ čo `route.ts` posiela
  16 fitness stĺpcov — dáta by padali do posunutých stĺpcov
- **Oprava priebežného ukladania:** `api/lead/partial` čítal `answers.industry`,
  `revenue`, `budget` a `history`, čo vo fitness formulári vôbec neexistuje —
  ukladali sa prázdne stĺpce. Teraz zapisuje `goal`/`level`/`frequency`/`start`
  ako čitateľné texty, má vlastnú hlavičku `PARTIAL_HEADER` a ide na samostatný
  hárok „Rozpracované" — dovtedy to komentár sľuboval, ale kód to nerobil
- **Oprava `.claude/launch.json`** — cesta k `node.exe` mala neescapované
  spätné lomítka, súbor nebol platný JSON
- Zjednotené „osem otázok" → päť (stránka sľubovala iný počet, než mala forma)
  a množné číslo → jednotné
- **Napísaný celý obsah stránky** (hero, čo dostanete, pre koho, príbehy,
  garancia, priebeh, FAQ) so zástupnou identitou trénera — stránka sa dá
  po prvý raz pozrieť ako celok
- Hero **nezobrazuje prázdny rám po videu**, kým nie je doplnené `youtubeId`
- Upozornenie nad príbehmi sa už neriadi hádaním podľa reťazca „TODO",
  ale výslovným príznakom `placeholder` na príbehu
- **Nová kvalifikačná otázka na dostupnosť** a prepočítané bodovanie
  (kedy začať 34, frekvencia 25, dostupnosť 20, úroveň 15, cieľ 6).
  Diskvalifikátory sú dva a stačí jeden — ani samé najlepšie odpovede
  neprebijú „som z inej časti Slovenska". Ukazovateľ postupu už nepočíta
  kontaktný krok medzi otázky.
- **Fotka trénera v hero sekcii** (`public/img/trener.png`) a nová sekcia
  **„Čo mi klienti píšu cestou"** so screenshotmi správ z priebehu spolupráce
  (`public/img/uspechy`). Je oddelená od recenzií zámerne: recenzia je
  hodnotenie trénera, toto je dôkaz, že sa počas spolupráce niečo deje.
- **Peter online vedenie robí** (vyplynulo zo screenshotu o online coachingu),
  takže odpoveď „radšej online" vo formulári nediskvalifikuje a má 12 bodov.
- **Recenzie prepnuté na screenshoty.** Obrázky sa načítavajú z priečinka cez
  `src/lib/gallery.ts`, takže pridanie fotky je nahratie súboru, nie zásah
  do kódu.
- **Stránka bola zosúladená s pravidlami Meta reklamy.** Sekcia „Premeny"
  s fotkami pred/po bola odstránená aj s obrázkami a tri screenshoty
  s konkrétnymi číslami o chudnutí (70,3 → 64,7 kg, −10 kg) a so zameraním
  na vzhľad boli stiahnuté. Nič sa nezmazalo — všetko je v priečinku
  `_nepouzite-meta/` mimo `public/`, takže to web neservíruje, ale na
  organický obsah na Instagrame sa to použiť dá. Dôvody sú v
  `_nepouzite-meta/PRECITAJ.md`.
- **Vymyslené príbehy nahradené desiatimi reálnymi recenziami.** `STORIES` je
  teraz prázdne a sekcia sa pri prázdnom poli vôbec nevykreslí. Recenzie majú
  vlastnú štruktúru (`REVIEWS` — text, autor, zdroj) a sadzia sa do troch
  stĺpcov, lebo majú veľmi rôzne dĺžky. Ďakovná stránka ukazuje pred hovorom
  dve z nich.
