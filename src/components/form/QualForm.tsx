"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  STEPS,
  CONTACT_INDEX,
  DISQUALIFYING,
  type Step,
} from "@/lib/form-config";
import { scoreLead } from "@/lib/scoring";
import { SITE } from "@/lib/content";
import {
  PHONE_PREFIX,
  cleanPhoneInput,
  normalizePhone,
  phoneIsEmpty,
} from "@/lib/phone";

type Answers = Record<string, string>;
type Faza = "kontakt" | "dokoncene";

interface Contact {
  name: string;
  phone: string;
  consent: boolean;
}

type FieldName = "name" | "phone" | "consent";
type FieldErrors = Partial<Record<FieldName, string>>;

const EMPTY_CONTACT: Contact = {
  name: "",
  phone: PHONE_PREFIX,
  consent: false,
};

// v2 — poradie krokov sa zmenilo. Stary rozpracovany formular by cloveka
// vratil na krok, ktory teraz znamena nieco ine.
const STORAGE_KEY = "wp_lead_draft_v2";

const LAST_INDEX = STEPS.length - 1;

/** Kolko otazok ostava po kontakte — pre text "potom už len …". */
const AFTER_CONTACT = LAST_INDEX - CONTACT_INDEX;

/**
 * Chybove hlasky hovoria, CO opravit — nie len ze sa nieco nepodarilo.
 * Predtym kazda chyba skoncila vetou "Odoslanie sa nepodarilo" a clovek
 * nevedel, ci je chyba v nom, alebo v stranke.
 */
const ERR = {
  name: "Napíšte nám prosím, ako vás máme osloviť.",
  phoneEmpty: "Bez čísla vám nemáme ako zavolať.",
  phoneBad: "Toto číslo nevieme vytočiť. Skontrolujte ho, napríklad 0905 123 456.",
  consent: "Bez súhlasu so spracovaním údajov vám nemôžeme zavolať.",
};

function validateName(name: string) {
  return name.trim().length >= 2 ? undefined : ERR.name;
}

function validatePhone(phone: string) {
  if (phoneIsEmpty(phone)) return ERR.phoneEmpty;
  return normalizePhone(phone) ? undefined : ERR.phoneBad;
}

/**
 * Odpoved, po ktorej formular skonci a dalej cloveka nepusti ("Zatiaľ sa
 * len obzerám"). Takych leadov zadavatel nechce.
 */
function isStopAnswer(stepId: string, optionId: string) {
  return DISQUALIFYING.some((d) => d.step === stepId && d.option === optionId);
}

/** Kontakt, ktory uz odisiel ako lead — ked sa nezmeni, neposielame ho znova. */
function contactKey(c: Contact) {
  return `${c.name.trim()}|${normalizePhone(c.phone) ?? ""}`;
}

function newLeadId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : String(Date.now()) + Math.random().toString(16).slice(2);
}

/**
 * Pixel udalost "Contact" — clovek zadal telefon. Zaklad pre retargeting
 * tych, co zvysok nedoklikali. Bez suhlasu s cookies fbq neexistuje
 * a udalost ide len zo servera (Conversions API) s rovnakym eventID.
 */
function trackContact(leadId: string) {
  try {
    const fbq = (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq;
    fbq?.("track", "Contact", {}, { eventID: `${leadId}-contact` });
  } catch {
    /* meranie nesmie zastavit formular */
  }
}

export default function QualForm() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [contact, setContact] = useState<Contact>(EMPTY_CONTACT);
  const [leadId, setLeadId] = useState("");
  /** contactKey kontaktu, ktory uz server prijal; prazdne = este nie */
  const [sentKey, setSentKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const honeypot = useRef<HTMLInputElement>(null);
  const hpValue = useRef("");
  const lastDraft = useRef("");
  const advanceTimer = useRef<number | null>(null);
  const finishing = useRef(false);
  const topRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);

  const step = STEPS[index];
  const afterContact = index > CONTACT_INDEX;

  /* ---- rozpracovany formular prezije obnovenie stranky ---- */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.leadId) {
          const sent = typeof saved.sentKey === "string" ? saved.sentKey : "";
          setLeadId(saved.leadId);
          setSentKey(sent);
          if (saved.answers) setAnswers(saved.answers);
          if (saved.contact) setContact({ ...EMPTY_CONTACT, ...saved.contact });
          if (typeof saved.index === "number") {
            // za kontakt sa bez prijateho kontaktu pustit nesmie
            const max = sent ? LAST_INDEX : CONTACT_INDEX;
            setIndex(Math.max(0, Math.min(saved.index, max)));
          }
          return;
        }
      }
    } catch {
      /* localStorage nedostupny — formular funguje aj bez neho */
    }
    setLeadId(newLeadId());
  }, []);

  useEffect(() => {
    if (!leadId) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ leadId, index, answers, contact, sentKey }),
      );
    } catch {
      /* ignoruj */
    }
  }, [leadId, index, answers, contact, sentKey]);

  // Na mobile je kontaktny krok vyssi nez ostatne. Po jeho odoslani by
  // clovek pozeral na sekciu pod formularom — vratime ho k otazke.
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const el = topRef.current;
    if (el && el.getBoundingClientRect().top < 0) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [index]);

  /**
   * Lead ide do tabulky PRAVE DVAKRAT: po zadani kontaktu a na konci.
   * Odpovede medzi tym idu len do "Rozpracovaných" (saveDraft) — keby kazda
   * odpoved posielala lead, n8n bez upsertu by Petrovi zalozilo riadok
   * a poslalo e-mail pri kazdom kliknuti.
   */
  const sendLead = useCallback(
    (faza: Faza, nextAnswers: Answers, nextContact: Contact = contact) =>
      fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId,
          faza,
          answers: nextAnswers,
          contact: {
            ...nextContact,
            // server dostane uz upravene cislo — nic navyse, co by odmietol
            phone: normalizePhone(nextContact.phone) ?? nextContact.phone,
          },
          hp: hpValue.current,
        }),
        keepalive: true,
      }),
    [leadId, contact],
  );

  /**
   * Priebezne ulozenie do "Rozpracovaných" — pri opusteni pola s menom
   * alebo telefonom (este pred kliknutim na tlacidlo) a po kazdej
   * odpovedi za kontaktom. Kto odide v strede, jeho cislo aj posledne
   * odpovede v tabulke ostanu.
   */
  function saveDraft(
    stepId: string,
    nextAnswers: Answers = answers,
    nextContact: Contact = contact,
  ) {
    const phone = normalizePhone(nextContact.phone);
    if (!leadId || !phone) return;
    const payload = JSON.stringify({
      leadId,
      step: stepId,
      answers: nextAnswers,
      contact: { name: nextContact.name, phone },
      hp: honeypot.current?.value ?? hpValue.current,
    });
    if (payload === lastDraft.current) return;
    lastDraft.current = payload;

    // sendBeacon prezije aj zatvorenie zalozky
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/lead/partial",
        new Blob([payload], { type: "application/json" }),
      );
    } else {
      fetch("/api/lead/partial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  }

  /** Posun o krok dalej. Dvojklik na moznost nesmie preskocit otazku. */
  function advance(delay = 0) {
    if (advanceTimer.current !== null) return;
    advanceTimer.current = window.setTimeout(() => {
      advanceTimer.current = null;
      setIndex((i) => Math.min(i + 1, LAST_INDEX));
    }, delay);
  }

  /** Vyber moznosti. Po kontakte sa kazda odpoved hned ulozi. */
  function pick(stepId: string, optionId: string) {
    const next = { ...answers, [stepId]: optionId };
    setAnswers(next);
    if (sentKey) saveDraft(stepId, next);
    return next;
  }

  function choose(stepId: string, optionId: string) {
    if (finishing.current) return;
    const next = pick(stepId, optionId);

    // Posledna otazka formular dokonci. "Zatiaľ sa len obzerám" ho
    // ukonci hned — dalej cloveka nepustime, nech je to kdekolvek.
    if (index === LAST_INDEX || isStopAnswer(stepId, optionId)) {
      finish(next);
      return;
    }

    // kratke oneskorenie, aby bolo vidiet potvrdenie volby
    advance(180);
  }

  function goBack() {
    setError(null);
    if (advanceTimer.current !== null) {
      window.clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
    setIndex((i) => Math.max(i - 1, 0));
  }

  async function submitContact(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const errs: FieldErrors = {
      name: validateName(contact.name),
      phone: validatePhone(contact.phone),
      consent: contact.consent ? undefined : ERR.consent,
    };
    setFieldErrors(errs);
    const firstBad = (["name", "phone", "consent"] as const).find((k) => errs[k]);
    if (firstBad) {
      document.getElementById(`qf-${firstBad}`)?.focus();
      return;
    }

    hpValue.current = honeypot.current?.value ?? "";
    const key = contactKey(contact);

    // Vratil sa spat a nic nezmenil — lead uz mame, len pokracujeme.
    if (key === sentKey) {
      setIndex(CONTACT_INDEX + 1);
      return;
    }

    setBusy(true);

    /**
     * POZOR NA ROZSAH TRY BLOKU.
     *
     * Vnutri smie byt IBA odoslanie. Ked sa sem dostane cokolvek dalsie —
     * meranie, presun na dalsi krok — a ono zlyha, clovek uvidi chybu,
     * hoci jeho lead je v tabulke uz davno.
     */
    let res: Response;
    try {
      res = await sendLead("kontakt", answers);
    } catch (err) {
      console.error("[formulár] odoslanie kontaktu zlyhalo:", err);
      setBusy(false);
      setError(
        `Nepodarilo sa odoslať — skontrolujte pripojenie a skúste to znova. Alebo nám rovno zavolajte na ${SITE.phone}.`,
      );
      return;
    }
    setBusy(false);

    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { field?: string } | null;
      if (body?.field === "name") setFieldErrors({ name: ERR.name });
      else if (body?.field === "phone") setFieldErrors({ phone: ERR.phoneBad });
      else if (body?.field === "consent") setFieldErrors({ consent: ERR.consent });
      else {
        setError(
          `Nepodarilo sa odoslať. Skúste to prosím znova, alebo nám zavolajte na ${SITE.phone}.`,
        );
      }
      return;
    }

    // Od tohto riadku je lead ULOZENY.
    setSentKey(key);
    trackContact(leadId);
    setIndex(CONTACT_INDEX + 1);
  }

  async function finish(finalAnswers: Answers) {
    // ref, nie stav — dvojklik by stihol zavolat finish dvakrat skor,
    // nez sa busy prekresli
    if (finishing.current) return;
    finishing.current = true;
    setBusy(true);
    setError(null);

    /**
     * Lead je ulozeny uz od kontaktu. Ked zlyha toto posledne doplnenie,
     * cloveka NEZDRZIAVAME chybovou hlaskou — kvalifikaciu si dopocitame
     * sami a pustime ho na dakovnu stranku.
     */
    let data: { qualified: boolean; score?: number } | null = null;
    try {
      const res = await sendLead("dokoncene", finalAnswers);
      if (res.ok) data = await res.json();
    } catch (err) {
      console.error("[formulár] dokončenie sa neodoslalo:", err);
    }
    if (!data) {
      const r = scoreLead(finalAnswers);
      data = { qualified: r.qualified, score: r.score };
    }

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignoruj */
    }

    /**
     * Udalost Lead pre Metu sa NEODOSIELA TU, ale az na dakovnej stranke
     * (komponent LeadPixel). Zadavatel chce zapocitat iba leady, ktore
     * na nu naozaj dosli — inak by v adrese udalosti nebolo /dakujeme
     * a vlastna konverzia s takym pravidlom by nikdy nesadla.
     *
     * IBA PRI KVALIFIKOVANOM LEADE. Keby sme hlasili kazde odoslanie
     * formulara, Meta by sa naucila dorucovat najlacnejsie publikum —
     * teda presne tych, ktorych formular filtruje.
     *
     * eventID je rovnake ako leadId a ako event_id v Conversions API,
     * takze Meta obe cesty spari a nezapocita jeden lead dvakrat.
     */
    if (data.qualified) {
      try {
        sessionStorage.setItem(
          "wp-lead-meta",
          JSON.stringify({ leadId, value: data.score }),
        );
      } catch {
        /* sukromne okno — konverzia sa nezmeria, lead je ulozeny tak ci tak */
      }
    }

    router.push(data.qualified ? "/dakujeme" : "/dakujeme-nesedi");
  }

  // Percenta zamerne neuvadzame — "0 %" pri prvej otazke posobi, akoby
  // clovek este nic neurobil.
  const progress = ((index + 1) / STEPS.length) * 100;
  const stepNote =
    index < CONTACT_INDEX
      ? "zaberie to minútu"
      : index === CONTACT_INDEX
        ? AFTER_CONTACT === 1
          ? "potom už len jedno kliknutie"
          : `potom už len ${AFTER_CONTACT} kliknutia`
        : index === LAST_INDEX
          ? "posledná otázka"
          : "skoro hotovo";
  // Preskocit sa da len otazka medzi kontaktom a poslednou. Posledna
  // ("Kedy chcete začať?") rozhoduje, ci cloveka vobec pustime dalej.
  const canSkip = afterContact && index < LAST_INDEX;

  return (
    <div ref={topRef} className="relative mx-auto w-full max-w-2xl scroll-mt-4">
      {/* ukazovatel postupu */}
      <div className="mb-6">
        <div className="mb-2 flex items-baseline justify-between text-sm">
          <span className="font-semibold text-ink">
            Krok {index + 1} z {STEPS.length}
          </span>
          <span className="text-ink-2">{stepNote}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full bg-brand-500 transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* halo okolo formulara — je to hlavny konverzny prvok stranky */}
      <div aria-hidden="true" className="wp-halo wp-halo--form" />

      <div className="wp-lit relative rounded-card border border-line bg-surface p-6 sm:p-8">
        {/* key spusti nabehovu animaciu znova pri kazdej otazke */}
        <div key={step.id} className="wp-in">
          {afterContact && <SavedBanner />}

          <h3 className="text-xl font-bold leading-snug text-ink sm:text-2xl">
            {step.question}
          </h3>
          {step.help && (
            <p
              className={
                step.type === "contact"
                  ? "mt-2 text-[15px] font-semibold text-brand-600"
                  : "mt-2 text-sm text-ink-2"
              }
            >
              {step.help}
            </p>
          )}

          <div className="mt-6">
            {step.type === "single" && (
              <OptionList
                step={step}
                value={answers[step.id]}
                onPick={choose}
                disabled={busy}
              />
            )}

            {step.type === "contact" && (
              <ContactStep
                contact={contact}
                setContact={setContact}
                fieldErrors={fieldErrors}
                setFieldErrors={setFieldErrors}
                busy={busy}
                error={error}
                onSubmit={submitContact}
                onFieldBlur={() => saveDraft("contact")}
                honeypotRef={honeypot}
              />
            )}
          </div>
        </div>

        {index > 0 && (
          <div className="mt-6 flex items-center justify-between gap-4 text-sm font-medium">
            <button
              type="button"
              onClick={goBack}
              disabled={busy}
              className="text-ink-2 underline underline-offset-4 hover:text-ink disabled:opacity-50"
            >
              Späť
            </button>
            {canSkip && (
              <button
                type="button"
                onClick={() => advance()}
                className="text-ink-2 underline underline-offset-4 hover:text-ink"
              >
                Preskočiť
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

/**
 * Pruh nad otazkami za kontaktom. Povie dve veci: cislo uz mame (takze
 * clovek nemusi nic dalsie) a zvysne otazky su pomoc pre hovor, nie
 * dalsia prekazka.
 *
 * Zamerne tu nie je "ozveme sa do 24 hodín" — na poslednej otazke moze
 * clovek odpovedat "Zatiaľ sa len obzerám" a potom mu volat nebudeme.
 */
function SavedBanner() {
  return (
    <div className="mb-5 flex items-start gap-3 rounded-xl border border-good/25 bg-good/8 px-4 py-3 text-sm leading-relaxed text-ink">
      <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 flex-none fill-good" aria-hidden="true">
        <path d="M7.6 14.2 3.4 10l1.4-1.4 2.8 2.8 7-7L16 5.8z" />
      </svg>
      <p>
        <span className="font-semibold">Máme vaše číslo.</span>{" "}
        Ešte pár rýchlych kliknutí — pomôžu nám pripraviť sa na hovor s vami.
      </p>
    </div>
  );
}

function OptionList({
  step,
  value,
  onPick,
  disabled,
}: {
  step: Step;
  value?: string;
  onPick: (stepId: string, optionId: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="grid gap-2">
      {step.options?.map((o) => {
        const active = value === o.id;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onPick(step.id, o.id)}
            disabled={disabled}
            aria-pressed={active}
            className={[
              "flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-left text-[15px] font-medium transition disabled:cursor-wait",
              active
                ? "border-brand-500 bg-brand-500/12 text-ink"
                : "border-line bg-surface text-ink hover:border-brand-500/40 hover:bg-surface-2 hover:shadow-[0_0_26px_-8px_rgba(31,111,235,0.22)]",
            ].join(" ")}
          >
            <span>{o.label}</span>
            <span
              className={[
                "h-4 w-4 flex-none rounded-full border-2",
                active ? "border-brand-500 bg-brand-500" : "border-line",
              ].join(" ")}
            />
          </button>
        );
      })}
    </div>
  );
}

function ContactStep({
  contact,
  setContact,
  fieldErrors,
  setFieldErrors,
  busy,
  error,
  onSubmit,
  onFieldBlur,
  honeypotRef,
}: {
  contact: Contact;
  setContact: (c: Contact) => void;
  fieldErrors: FieldErrors;
  setFieldErrors: React.Dispatch<React.SetStateAction<FieldErrors>>;
  busy: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onFieldBlur: () => void;
  honeypotRef: React.RefObject<HTMLInputElement | null>;
}) {
  /** Zmena pola zmaze jeho chybu — kto ju opravuje, nema na nu pozerat. */
  function set<K extends keyof Contact>(k: K, v: Contact[K]) {
    setContact({ ...contact, [k]: v });
    if (k in fieldErrors) setFieldErrors((e) => ({ ...e, [k]: undefined }));
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      {/* pasca na boty — pre cloveka neviditelna. Nazov zamerne nic
          neznamena: pole "website" vedia vyplnit spravcovia hesiel
          a formular by potom cloveka potichu zablokoval. */}
      <input
        ref={honeypotRef}
        type="text"
        name="hp_x9"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <div className="grid gap-4">
        <Field id="qf-name" label="Meno" error={fieldErrors.name}>
          <input
            id="qf-name"
            value={contact.name}
            onChange={(e) => set("name", e.target.value)}
            onBlur={() => {
              if (contact.name) {
                setFieldErrors((e) => ({ ...e, name: validateName(contact.name) }));
              }
              onFieldBlur();
            }}
            onKeyDown={(e) => {
              // Enter v mene skoci na telefon, neodosiela neuplny formular
              if (e.key === "Enter") {
                e.preventDefault();
                document.getElementById("qf-phone")?.focus();
              }
            }}
            autoComplete="name"
            autoCapitalize="words"
            enterKeyHint="next"
            aria-invalid={!!fieldErrors.name}
            aria-describedby={fieldErrors.name ? "qf-name-err" : undefined}
            className={inputCls(!!fieldErrors.name)}
          />
        </Field>

        <Field
          id="qf-phone"
          label="Telefón"
          error={fieldErrors.phone}
          note="Zavoláme len raz, do 24 hodín. Žiadny spam."
        >
          <input
            id="qf-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            enterKeyHint="send"
            value={contact.phone}
            onChange={(e) => set("phone", cleanPhoneInput(e.target.value))}
            onFocus={(e) => {
              // kurzor za predvolbu, nech sa hned pise cislo
              const el = e.currentTarget;
              if (el.value === PHONE_PREFIX) {
                requestAnimationFrame(() =>
                  el.setSelectionRange(el.value.length, el.value.length),
                );
              }
            }}
            onBlur={() => {
              if (!phoneIsEmpty(contact.phone)) {
                setFieldErrors((e) => ({ ...e, phone: validatePhone(contact.phone) }));
              }
              onFieldBlur();
            }}
            aria-invalid={!!fieldErrors.phone}
            aria-describedby={fieldErrors.phone ? "qf-phone-err" : "qf-phone-note"}
            className={inputCls(!!fieldErrors.phone)}
          />
        </Field>
      </div>

      <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm text-ink-2">
        <input
          id="qf-consent"
          type="checkbox"
          checked={contact.consent}
          onChange={(e) => set("consent", e.target.checked)}
          aria-invalid={!!fieldErrors.consent}
          aria-describedby={fieldErrors.consent ? "qf-consent-err" : undefined}
          className="mt-0.5 h-4 w-4 flex-none accent-[var(--color-brand-500)]"
        />
        <span>
          Súhlasím so spracovaním osobných údajov za účelom kontaktovania.{" "}
          <a href="/ochrana-udajov" className="underline underline-offset-2">
            Zásady ochrany údajov
          </a>
        </span>
      </label>
      {fieldErrors.consent && (
        <p id="qf-consent-err" role="alert" className="mt-2 text-sm font-medium text-bad">
          {fieldErrors.consent}
        </p>
      )}

      {error && (
        <p role="alert" className="mt-4 rounded-lg bg-bad/8 px-4 py-3 text-sm font-medium text-bad">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="wp-btn mt-6 w-full rounded-xl bg-brand-500 px-6 py-4 text-base font-bold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? "Odosielam…" : "Chcem výsledky →"}
      </button>
    </form>
  );
}

function inputCls(invalid: boolean) {
  return [
    "w-full rounded-xl border bg-surface px-4 py-3 text-base text-ink placeholder:text-ink-2/60 focus:outline-none",
    invalid ? "border-bad focus:border-bad" : "border-line focus:border-brand-500",
  ].join(" ");
}

function Field({
  id,
  label,
  error,
  note,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
        <span className="text-brand-600"> *</span>
      </label>
      {children}
      {error && (
        <span id={`${id}-err`} role="alert" className="mt-1.5 block text-sm font-medium text-bad">
          {error}
        </span>
      )}
      {note && (
        <span id={`${id}-note`} className="mt-1.5 flex items-center gap-1.5 text-xs text-ink-2">
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 flex-none fill-current" aria-hidden="true">
            <path d="M10 1.7a4.3 4.3 0 0 0-4.3 4.3v2.3H4.6c-.6 0-1.1.5-1.1 1.1v8c0 .6.5 1.1 1.1 1.1h10.8c.6 0 1.1-.5 1.1-1.1v-8c0-.6-.5-1.1-1.1-1.1h-1.1V6A4.3 4.3 0 0 0 10 1.7Zm0 2a2.3 2.3 0 0 1 2.3 2.3v2.3H7.7V6A2.3 2.3 0 0 1 10 3.7Z" />
          </svg>
          {note}
        </span>
      )}
    </div>
  );
}
