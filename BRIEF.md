# SPerformance — landing page, zadanie a stav

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

Stránka je **hotová, nasadená a beží** na https://reklama-gold.vercel.app
(Vercel, tím Webpoint, plán Hobby; repozitár `webpointsk-maker/Reklama`,
súkromný). Obsah, obrázky aj právne stránky sú na mieste.

**Potvrdené:** meno Peter Sámal, mesto Bratislava, telefonická konzultácia
zadarmo, frekvencia tréningov podľa dohody, online vedenie robí.

**Chýba, zoradené podľa dôležitosti:**

1. **Premenné prostredia na Verceli** — bez nich sa odoslaný lead len zapíše
   do logov a je nenávratne preč. Nastavené sú Telegram a Meta; chýba
   `RESEND_API_KEY` (bez neho `MAIL_FROM` a `MAIL_TO` nespravia nič) a všetky
   štyri `GOOGLE_*`. Po pridaní treba **Redeploy**, inak sa neprejavia.
   Kým to nie je hotové, na stránku nesmie viesť reklama.
2. **Fakturačné údaje** — doména, telefón, e-mail, IČO a adresa sú `TODO`
   v `SITE` v `content.ts`. Návštevník ich vidí v pätičke aj v ochrane údajov.
   Zámerne tam nie sú vymyslené hodnoty: falošné IČO je horšie než viditeľné
   TODO.
3. **Právnu kontrolu textov** — `/ochrana-udajov` a `/obchodne-podmienky` sú
   napísané, ale sú to návrhy, nie právny posudok. Je to na nich uvedené.
4. **Súhlasy klientov s recenziami** — na stránke je 11 screenshotov, na
   siedmich je celé meno a profilová fotka. Deployment je verejne prístupný
   (má `noindex`, takže ho vyhľadávače nenájdú, ale kto pozná odkaz, uvidí ho).
5. **Vlastná doména** — `reklama-gold.vercel.app` nie je adresa, ktorej ľudia
   v reklame veria. Pripája sa vo *Settings → Domains*.
6. **Overiť zvyšné tvrdenia o službe** — texty sľubujú odpoveď na WhatsApp do
   24 hodín, vyhodnotenie raz za štyri týždne a náhradu tréningu zrušeného
   trénerom v tom istom týždni. Ak to tak nerobí, treba to prepísať.
7. **Video** → YouTube ako „nezaradené", ID do `HERO.youtubeId`. Kým je
   prázdne, hero video blok vôbec nezobrazuje — stránka tým nevyzerá
   nedokončene.
8. **Vlastné logo** — komponenta `Logo` v `src/components/Hero.tsx` zatiaľ
   vypisuje `TRAINER.name` ako text.
9. **`META_TEST_EVENT_CODE` po testovaní zmazať** — kým tam je, udalosti idú
   do testovacieho prúdu a nerátajú sa ako skutočné konverzie.

**Pridávanie obrázkov nevyžaduje zásah do kódu.** Súbory v `public/img/reviews`
a `public/img/uspechy` sa načítajú samé, zoradené podľa názvu. Pred nahratím
si over, že neobsahujú konkrétne čísla o chudnutí ani zameranie na vzhľad.

## Nasadzovanie — pozor na autora commitov

Projekt beží na Verceli (tím Webpoint, plán **Hobby**) a je napojený na
súkromný repozitár `webpointsk-maker/Reklama`.

**Hobby plán pri súkromnom repozitári nasadí len commity, ktorých autor má
prístup k projektu na Verceli.** Commit s cudzou e-mailovou adresou sa
nenasadí — Vercel ho označí ako `Blocked` a naživo zostane predošlá verzia.
Nie je to chyba buildu a v logoch to nevyzerá ako chyba, takže sa to hľadá
zle.

Preto je v repozitári nastavené:

```
git config user.name  "webpointsk-maker"
git config user.email "326204548+webpointsk-maker@users.noreply.github.com"
```

Ak by nasadenia znova začali byť `Blocked`, over ako prvé `git log --format="%an <%ae>"`.

## Rozhodnutia, ktoré už padli (prevzaté z WebPointu)

Boli overené v praxi na predošlom projekte, netreba ich znova riešiť:

- ~~Tmavý dizajn~~ → **biele pozadie** (zmenené 8. 9. 2026 na žiadosť zadávateľa)
- **Formulár hneď pod videom**, teda úplne hore — nie na konci stránky
- **Žiadny cenník na stránke**
- **Sľubujeme proces a dodávku, nikdy nie výsledok**
- **Nekvalifikovaného neodmietame natvrdo** — dostane inú ďakovnú stránku
  bez ponuky, s jasnou cestou, ako sa vrátiť
- **Ukazovateľ kapacity sa mení ručne** a musí byť pravdivý
- Texty na jednom mieste (`content.ts`), obsah sa needituje v komponentoch

Rozhodnuté 8. 9. 2026:

- **Značka je SPerformance**, nie meno trénera. Nesie ju `BRAND` v `content.ts`;
  logo je typografický znak (wordmark) so zvýrazneným „S", lebo vektorové logo
  zatiaľ neexistuje. Keď príde, mení sa len komponenta `Logo` v `Hero.tsx`.
- **Za značkou sú dvaja tréneri** (`TRAINERS`). Peter Sámal je doplnený, druhý
  má zástupné údaje a zobrazuje sa s otáznikom namiesto fotky.
- **Svetlý dizajn na bielom podklade.** Pozor na odtiene modrej: `brand-500`
  je plocha pod bielym textom, akcentový TEXT musí byť `brand-600` (na bielom
  má 6,57 oproti 4,23 pri `brand-500`, čo by pri malom písme nesplnilo AA).
  `brand-400` je len na plochy a obrysy, nikdy nie na text. Tiene sú neutrálne
  sivé, nie modré — modrý tieň na bielom vyzerá ako chyba tlače.
- **Texty hovoria v množnom čísle**, lebo tréneri sú dvaja. Ak by ostal jeden,
  treba ich vrátiť do jednotného — striedanie „ozvem sa" a „ozveme sa" je
  najviditeľnejší znak toho, že stránka vznikla kopírovaním.

Rozhodnuté 7. 9. 2026:

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

## Čo sa spravilo 23. 9. 2026 — prestavba formulára

Väčšina ľudí odchádzala na kontaktnom kroku (bol až na konci, za piatimi
otázkami). Formulár je teraz **4 kroky, kontakt na druhom mieste**:

1. Čo chcete tréningom dosiahnuť?
2. Meno + telefón (+ súhlas) — `Kam vám máme zavolať?`
3. Koľkokrát týždenne reálne stihnete cvičiť? (dá sa preskočiť)
4. Kedy chcete začať? — **„Zatiaľ sa len obzerám" formulár hneď ukončí**
   a pošle človeka na `/dakujeme-nesedi`. Takéto leady zadávateľ nechce;
   v tabuľke dostanú pásmo D a poznámku `NEVOLAŤ`.

**Odstránené:** e-mail, Instagram, výber času hovoru, otvorená otázka
„Čo ste skúšali", otázka na úroveň.

**Telefón** (`src/lib/phone.ts`): pole je predvyplnené `+421 `, prijme sa
číslo s medzerami aj bez, s `+421`/`00421` aj bez, s úvodnou nulou aj bez.
Server ho uloží v tvare `+421 905 123 456`. Chyby sa ukazujú pri konkrétnom
poli, nie všeobecné „Odoslanie sa nepodarilo".

**Ukladanie:**
- pri opustení poľa meno/telefón → `rozpracovane` (ešte pred odoslaním)
- po kliknutí „Chcem výsledky" → `lead`, `faza: "kontakt"`
- odpovede na krokoch 3–4 → `rozpracovane`
- koniec formulára → `lead`, `faza: "dokoncene"` (rovnaký `leadId`)

**n8n workflow „SPerformance — Lead Capture" (upravený 23. 9. 2026):**
- vetva `lead`: `Hľadám lead` (NocoDB podľa `LeadId`) → `Lead už máme?`
  - nie → `NocoDB — leady` (create) → `E-mail trénerovi` — Peter dostane
    e-mail iba raz, po zadaní telefónu
  - áno → `Prepísať lead` (PATCH bez `Stav` a `Cas`) → ak
    `kvalifikovany = false`, príde Petrovi e-mail „❌ Nevolať"
- uzol „Potvrdenie klientovi" je preč — e-mail sa nezbiera
- vetva `rozpracovane` ostala, PATCH len skladá telo cez `JSON.stringify`

**Meta:** po zadaní kontaktu ide udalosť `Contact` (pixel aj CAPI, rovnaké
eventID) — základ pre retargeting. `Lead` ostáva ako predtým: iba
kvalifikovaný, iba na `/dakujeme`.
