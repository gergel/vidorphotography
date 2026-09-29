'use client';

import { useRef, useState } from 'react';
import { CONTACT, INQUIRIES } from '@/lib/content';
import { useSite } from '@/lib/site';

type Status = { kind: 'idle' | 'sending' | 'success' | 'error' };
type Errors = Partial<Record<'name' | 'email' | 'message', string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Tartalék: ha a szerveren nincs beállítva Resend, a böngésző a (már aktivált) FormSubmit-re küld.
const FORMSUBMIT = `https://formsubmit.co/ajax/${CONTACT.email}`;

function validate(d: FormData): Errors {
  const e: Errors = {};
  if (!String(d.get('name') || '').trim()) e.name = 'Add meg a neved.';
  if (!EMAIL_RE.test(String(d.get('email') || '').trim())) e.email = 'Adj meg egy érvényes e-mail-címet.';
  if (!String(d.get('message') || '').trim()) e.message = 'Írj pár sort arról, mit tervezel.';
  return e;
}

async function sendViaFormSubmit(d: FormData) {
  const body = new FormData();
  body.set('Név', String(d.get('name')));
  body.set('email', String(d.get('email')));
  body.set('Miben gondolkodik', String(d.get('type') || '—'));
  body.set('Üzenet', String(d.get('message')));
  body.set('_subject', 'Új üzenet a vidorphotography.com oldalról');
  body.set('_template', 'table');
  body.set('_captcha', 'false');
  const res = await fetch(FORMSUBMIT, { method: 'POST', headers: { Accept: 'application/json' }, body });
  const data = await res.json().catch(() => ({}));
  return res.ok && (data.success === true || data.success === 'true');
}

export default function ContactForm() {
  const { inquiry, setInquiry, setAccent } = useSite();
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [errors, setErrors] = useState<Errors>({});
  const statusRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const errs = validate(d);
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      (e.currentTarget.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }
    if (String(d.get('_honey') || '')) return; // spam
    setStatus({ kind: 'sending' });
    let ok = false;
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(d)),
      });
      if (res.status === 501) ok = await sendViaFormSubmit(d); // nincs Resend-kulcs a szerveren
      else ok = res.ok && (await res.json().catch(() => ({}))).ok === true;
    } catch {
      ok = false;
    }
    // Sikert csak a szolgáltatás tényleges sikeres válasza után jelzünk; hibánál a szöveg megmarad.
    setStatus({ kind: ok ? 'success' : 'error' });
    if (ok) formRef.current?.reset();
    requestAnimationFrame(() => statusRef.current?.focus());
  }

  const field = 'block w-full rounded-[6px] border-2 border-night/25 bg-night/[0.06] px-4 py-3 text-[16px] text-night placeholder:text-night/55 transition-colors hover:border-night/50 focus:border-night focus:bg-night/[0.1] focus:outline-none aria-[invalid=true]:border-[#8A1C12]';
  const label = 'mb-2 block font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-night/75';
  const err = 'mt-1.5 text-[14px] font-medium text-[#6E1209]';

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="text-night" aria-busy={status.kind === 'sending'}>
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden>
        <label htmlFor="f-honey">Ne töltsd ki</label>
        <input id="f-honey" name="_honey" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="f-name" className={label}>Név <span className="sr-only">(kötelező)</span></label>
          <input id="f-name" name="name" autoComplete="name" className={field} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'f-name-err' : undefined} />
          {errors.name && <p id="f-name-err" className={err}>{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="f-email" className={label}>E-mail <span className="sr-only">(kötelező)</span></label>
          <input id="f-email" name="email" type="email" inputMode="email" autoComplete="email" className={field} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'f-email-err' : undefined} />
          {errors.email && <p id="f-email-err" className={err}>{errors.email}</p>}
        </div>
      </div>

      <fieldset className="mt-6">
        <legend className={label}>Miben gondolkodsz?</legend>
        <div className="flex flex-wrap gap-2">
          {INQUIRIES.map((o) => {
            const on = inquiry === o.value;
            return (
              <label key={o.value} className={`relative inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-2 px-4 text-[14px] font-semibold transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-night ${on ? 'border-night bg-night text-cream' : 'border-night/30 hover:border-night'}`}>
                <input
                  type="radio"
                  name="type"
                  value={o.value}
                  checked={on}
                  onChange={() => {
                    setInquiry(o.value);
                    const key = o.value === 'Film' ? 'film' : (['eskuvo', 'koncert', 'portre', 'gastro', 'rendezveny'] as const)[['Esküvő', 'Koncert', 'Portré', 'Gasztro', 'Rendezvény'].indexOf(o.value)];
                    if (key) setAccent(key);
                  }}
                  className="sr-only"
                />
                {on && <span aria-hidden>✓</span>}
                {o.value}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-6">
        <label htmlFor="f-message" className={label}>Üzenet <span className="sr-only">(kötelező)</span></label>
        <textarea id="f-message" name="message" rows={4} className={`${field} resize-y`} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'f-message-err' : undefined} />
        {errors.message && <p id="f-message-err" className={err}>{errors.message}</p>}
      </div>

      <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
        <button type="submit" className="btn btn-night !min-h-14 !px-7 !text-[16px] max-sm:w-full" disabled={status.kind === 'sending'}>
          {status.kind === 'sending' ? 'Küldés…' : 'Üzenet küldése'} <span aria-hidden>→</span>
        </button>
        <p className="text-[13px] text-night/75">Az üzeneted e-mailben érkezik meg hozzám.</p>
      </div>

      <div ref={statusRef} tabIndex={-1} role="status" aria-live="polite" className="mt-5 outline-none">
        {status.kind === 'success' && (
          <p className="flex items-center gap-3 rounded-[6px] bg-night px-4 py-3 text-[15px] text-cream">
            <span aria-hidden className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-teal text-night">✓</span>
            Köszönöm, megkaptam az üzeneted! Hamarosan válaszolok.
          </p>
        )}
        {status.kind === 'error' && (
          <p className="rounded-[6px] bg-night px-4 py-3 text-[15px] text-cream">
            Az üzenetet most nem sikerült elküldeni. A beírt szöveg megmaradt — próbáld újra, vagy írj közvetlenül:{' '}
            <a className="font-semibold text-sun underline underline-offset-4" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          </p>
        )}
      </div>
    </form>
  );
}
