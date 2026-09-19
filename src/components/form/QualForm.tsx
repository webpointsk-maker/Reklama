"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { STEPS, CALL_TIME_OPTIONS, type Step } from "@/lib/form-config";

type Answers = Record<string, string>;

interface Contact {
  name: string;
  phone: string;
  email: string;
  social: string;
  callTime: string;
  consent: boolean;
}

const EMPTY_CONTACT: Contact = {
  name: "",
  phone: "",
  email: "",
  social: "",
  callTime: "any",
  consent: false,
};

const STORAGE_KEY = "wp_lead_draft";

export default function QualForm() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [contact, setContact] = useState<Contact>(EMPTY_CONTACT);
  const [leadId, setLeadId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const startedAt = useRef<number>(Date.now());
  const honeypot = useRef<HTMLInputElement>(null);

  const step = STEPS[index];
  const isLast = index === STEPS.length - 1;

  /* ---- rozpracovany formular prezije obnovenie stranky ---- */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.leadId) setLeadId(saved.leadId);
        if (saved.answers) setAnswers(saved.answers);
        if (saved.contact) setContact({ ...EMPTY_CONTACT, ...saved.contact });
        if (typeof saved.index === "number") {
          setIndex(Math.min(saved.index, STEPS.length - 1));
        }
        return;
      }
    } catch {
      /* localStorage nedostupny — formular funguje aj bez neho */
    }
    setLeadId(
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : String(Date.now()) + Math.random().toString(16).slice(2),
    );
  }, []);

  useEffect(() => {
    if (!leadId) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ leadId, index, answers, contact }),
      );
    } catch {
      /* ignoruj */
    }
  }, [leadId, index, answers, contact]);

  /* ---- priebezne ukladanie na server po kazdom kroku ----
     Nedokonceny formular s kontaktom je pouzitelny lead. Bez tohto o neho prideme. */
  const savePartial = useCallback(
    (nextAnswers: Answers, stepId: string) => {
      if (!leadId) return;
      const payload = JSON.stringify({
        leadId,
        step: stepId,
        answers: nextAnswers,
        contact,
      });
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
    },
    [leadId, contact],
  );

  function choose(stepId: string, optionId: string) {
    const next = { ...answers, [stepId]: optionId };
    setAnswers(next);
    savePartial(next, stepId);
    // kratke oneskorenie, aby bolo vidiet potvrdenie volby
    window.setTimeout(() => setIndex((i) => Math.min(i + 1, STEPS.length - 1)), 180);
  }

  function goNext() {
    savePartial(answers, step.id);
    setIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }

  function goBack() {
    setError(null);
    setIndex((i) => Math.max(i - 1, 0));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (honeypot.current?.value) return; // bot
    if (Date.now() - startedAt.current < 5000) {
      setError("Formulár bol odoslaný príliš rýchlo. Skúste to prosím znova.");
      return;
    }
    if (!contact.consent) {
      setError("Bez súhlasu so spracovaním údajov vám nemôžeme zavolať.");
      return;
    }

    setBusy(true);

    /**
     * POZOR NA ROZSAH TRY BLOKU.
     *
     * Vnutri smie byt IBA odoslanie a precitanie odpovede. Ked sa sem
     * dostane cokolvek dalsie — meranie, presmerovanie — a ono zlyha,
     * clovek uvidi "Odoslanie sa nepodarilo", hoci jeho lead je v tabulke
     * uz davno. Vyplni to znova a trenerovi pride dvakrat.
     */
    let data: { qualified: boolean; score?: number };

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, answers, contact }),
      });
      if (!res.ok) throw new Error(`server vrátil ${res.status}`);
      data = await res.json();
    } catch (err) {
      console.error("[formulár] odoslanie zlyhalo:", err);
      setBusy(false);
      setError(
        "Odoslanie sa nepodarilo. Skúste to prosím ešte raz, alebo nám napíšte priamo.",
      );
      return;
    }

    // Od tohto riadku je lead ULOZENY. Nic dalsie uz nesmie skoncit chybovou
    // hlaskou — najhorsie, co sa smie stat, je ze sa nezmeria konverzia.
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignoruj */
    }

    /**
     * Udalost Lead pre Metu.
     *
     * IBA PRI KVALIFIKOVANOM LEADE. Keby sme hlasili kazde odoslanie
     * formulara, Meta by sa naucila dorucovat najlacnejsie publikum —
     * teda presne tych, ktorych formular filtruje.
     *
     * eventID je rovnake ako leadId a ako event_id v Conversions API,
     * takze Meta obe cesty spari a nezapocita jeden lead dvakrat.
     *
     * fbq existuje len po suhlase v cookie liste. Vlastny try/catch je
     * zamerne: blokovac reklam vie fbq nahradit necim, co vyhodi vynimku,
     * a nezmerana konverzia nesmie vyzerat ako neodoslany formular.
     */
    if (data.qualified) {
      try {
        const fbq = (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq;
        fbq?.(
          "track",
          "Lead",
          data.score !== undefined ? { value: data.score, currency: "EUR" } : {},
          { eventID: leadId },
        );
      } catch (err) {
        console.warn("[formulár] meranie konverzie zlyhalo:", err);
      }
    }

    router.push(data.qualified ? "/dakujeme" : "/dakujeme-neskor");
  }

  // Pruh sa plni podla poradia otazky. Percenta zamerne neuvadzame —
  // "0 %" pri prvej otazke posobi, akoby clovek este nic neurobil.
  const progress = ((index + 1) / STEPS.length) * 100;

  // Kontaktny krok nie je otazka, takze sa do poctu nerata — inak by
  // stranka sľubovala o jednu otazku viac, nez sa clovek naozaj pyta.
  const questionCount = STEPS.filter((s) => s.type !== "contact").length;

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      {/* ukazovatel postupu */}
      <div className="mb-6">
        <div className="mb-2 flex items-baseline justify-between text-sm">
          <span className="font-semibold text-ink">
            {isLast ? "Kontaktné údaje" : `Otázka ${index + 1} z ${questionCount}`}
          </span>
          <span className="text-ink-2">{isLast ? "posledný krok" : "2 minúty"}</span>
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
          <h3 className="text-xl font-bold leading-snug text-ink sm:text-2xl">
            {step.question}
          </h3>
          {step.help && <p className="mt-2 text-sm text-ink-2">{step.help}</p>}

          <div className="mt-6">
          {step.type === "single" && (
            <OptionList step={step} value={answers[step.id]} onPick={choose} />
          )}

          {step.type === "text" && (
            <TextStep
              step={step}
              value={answers[step.id] ?? ""}
              onChange={(v) => setAnswers({ ...answers, [step.id]: v })}
              onNext={goNext}
            />
          )}

          {step.type === "contact" && (
            <ContactStep
              contact={contact}
              setContact={setContact}
              busy={busy}
              error={error}
              onSubmit={submit}
              honeypotRef={honeypot}
            />
          )}
          </div>
        </div>

        {index > 0 && (
          <button
            type="button"
            onClick={goBack}
            className="mt-6 text-sm font-medium text-ink-2 underline underline-offset-4 hover:text-ink"
          >
            Späť
          </button>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function OptionList({
  step,
  value,
  onPick,
}: {
  step: Step;
  value?: string;
  onPick: (stepId: string, optionId: string) => void;
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
            aria-pressed={active}
            className={[
              "flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-left text-[15px] font-medium transition",
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

function TextStep({
  step,
  value,
  onChange,
  onNext,
}: {
  step: Step;
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
}) {
  const min = step.minLength ?? 0;
  const clean = value.trim().replace(/\s+/g, " ");

  /**
   * ZAMERNE BEZ VYSOKEHO MINIMA.
   *
   * Povodne sa vyzadovalo 40 znakov A ZAROVEN 6 slov, tlacidlo bolo dovtedy
   * vypnute a otazka sa nedala preskocit. Na tomto kroku odisli tri stvrtiny
   * ludi — 8 z 11 za tri dni, nula dokoncenych formularov.
   *
   * Dlzka odpovede sa nadalej boduje v scoring.ts, takze kto napise viac, ma
   * vyssie skore. Uz ale nerozhoduje o tom, ci sa clovek vobec dostane ku
   * kontaktnym udajom.
   */
  const ok = clean.length >= min;
  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={step.placeholder}
        rows={5}
        className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-[15px] leading-relaxed text-ink placeholder:text-ink-2/60 focus:border-brand-500 focus:outline-none"
      />
      <div className="mt-2 flex items-center justify-between text-xs text-ink-2">
        <span>
          {clean.length > 0 ? "Vďaka, to stačí." : "Toto pole môžete preskočiť."}
        </span>
        <span>{clean.length}</span>
      </div>
      <button
        type="button"
        disabled={!ok}
        onClick={onNext}
        className="wp-btn mt-5 w-full rounded-xl bg-brand-500 px-6 py-3.5 text-[15px] font-bold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-ink-2"
      >
        Pokračovať
      </button>
    </div>
  );
}

function ContactStep({
  contact,
  setContact,
  busy,
  error,
  onSubmit,
  honeypotRef,
}: {
  contact: Contact;
  setContact: (c: Contact) => void;
  busy: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent) => void;
  honeypotRef: React.RefObject<HTMLInputElement | null>;
}) {
  const set = (k: keyof Contact, v: string | boolean) =>
    setContact({ ...contact, [k]: v } as Contact);

  return (
    <form onSubmit={onSubmit} noValidate>
      {/* pasca na boty — pre cloveka neviditelna */}
      <input
        ref={honeypotRef}
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Meno a priezvisko" required>
          <input
            required
            value={contact.name}
            onChange={(e) => set("name", e.target.value)}
            autoComplete="name"
            className={inputCls}
          />
        </Field>
        <Field label="Telefón" required hint="Voláme z čísla +421">
          <input
            required
            type="tel"
            inputMode="tel"
            value={contact.phone}
            onChange={(e) => set("phone", e.target.value)}
            autoComplete="tel"
            placeholder="+421 900 000 000"
            className={inputCls}
          />
        </Field>
        <Field label="E-mail" required>
          <input
            required
            type="email"
            value={contact.email}
            onChange={(e) => set("email", e.target.value)}
            autoComplete="email"
            className={inputCls}
          />
        </Field>
        <Field
          label="Instagram (nepovinné)"
          hint="Nemusíte vypĺňať — len ak sa chcete pred hovorom predstaviť"
          full
        >
          <input
            value={contact.social}
            onChange={(e) => set("social", e.target.value)}
            placeholder="instagram.com/vasenick"
            className={inputCls}
          />
        </Field>
        <Field label="Kedy sa vám najlepšie volá?" full>
          <div className="flex flex-wrap gap-2">
            {CALL_TIME_OPTIONS.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => set("callTime", o.id)}
                className={[
                  "rounded-lg border px-3 py-2 text-sm font-medium transition",
                  contact.callTime === o.id
                    ? "border-brand-500 bg-brand-500/12 text-ink"
                    : "border-line text-ink-2 hover:border-line-2",
                ].join(" ")}
              >
                {o.label}
              </button>
            ))}
          </div>
        </Field>
      </div>

      <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm text-ink-2">
        <input
          type="checkbox"
          checked={contact.consent}
          onChange={(e) => set("consent", e.target.checked)}
          className="mt-0.5 h-4 w-4 flex-none accent-[var(--color-brand-500)]"
        />
        <span>
          Súhlasím so spracovaním osobných údajov za účelom kontaktovania.{" "}
          <a href="/ochrana-udajov" className="underline underline-offset-2">
            Zásady ochrany údajov
          </a>
        </span>
      </label>

      {error && (
        <p className="mt-4 rounded-lg bg-brand-500/12 px-4 py-3 text-sm font-medium text-brand-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="wp-btn mt-6 w-full rounded-xl bg-brand-500 px-6 py-4 text-base font-bold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? "Odosielam…" : "Odoslať a nechať si zavolať"}
      </button>
      <p className="mt-3 text-center text-xs text-ink-2">
        Ozveme sa do 24 hodín.
      </p>
    </form>
  );
}

const inputCls =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-[15px] text-ink placeholder:text-ink-2/60 focus:border-brand-500 focus:outline-none";

function Field({
  label,
  hint,
  required,
  full,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
        {required && <span className="text-brand-500"> *</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink-2">{hint}</span>}
    </label>
  );
}
