'use client';

import { useRef, useState } from 'react';
import { CONTACT } from '@/lib/content';

type Status = { kind: 'idle' | 'sending' | 'success' | 'error' };
type Errors = Partial<Record<'name' | 'email' | 'message', string>>;

const OPTIONS = ['Esküvő', 'Portré', 'Film', 'Esemény'];
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

  const field = 'block w-full rounded-none border-0 border-b border-line-dark bg-transparent px-0 pb-[11px] pt-0 text-[15px] leading-5 text-offwhite placeholder:text-muted-dark transition-colors duration-200 hover:border-[#6E6C66] focus:border-offwhite focus:shadow-[0_1px_0_0_#FAFAF7] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-offwhite max-md:pt-3 aria-[invalid=true]:border-[#E0A197]';
  const label = 'label mb-2 block text-[10px] tracking-[1.5px] text-muted-dark';
  const err = 'mt-1.5 text-[13px] text-[#F0B1A6]';

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="max-w-[676px]" aria-busy={status.kind === 'sending'}>
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden>
        <label htmlFor="f-honey">Ne töltsd ki</label>
        <input id="f-honey" name="_honey" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mb-8">
        <label htmlFor="f-name" className={label}>Név <span className="sr-only">(kötelező)</span></label>
        <input id="f-name" name="name" autoComplete="name" placeholder="Írj ide..." className={field} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'f-name-err' : undefined} />
        {errors.name && <p id="f-name-err" className={err}>{errors.name}</p>}
      </div>
      <div className="mb-8">
        <label htmlFor="f-email" className={label}>E-mail <span className="sr-only">(kötelező)</span></label>
        <input id="f-email" name="email" type="email" inputMode="email" autoComplete="email" placeholder="Írj ide..." className={field} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'f-email-err' : undefined} />
        {errors.email && <p id="f-email-err" className={err}>{errors.email}</p>}
      </div>
      <div className="mb-8">
        <label htmlFor="f-type" className={label}>Miben gondolkodsz?</label>
        <select id="f-type" name="type" defaultValue="" className={`${field} cursor-pointer appearance-none bg-[url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='10'%20height='6'%3E%3Cpath%20d='M1%201l4%204%204-4'%20fill='none'%20stroke='%23A8A59D'%20stroke-width='1.2'/%3E%3C/svg%3E")] bg-[position:right_2px_center] bg-no-repeat pr-7 [&>option]:bg-ink`}>
          <option value="">Esküvő / Portré / Film / Esemény</option>
          {OPTIONS.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>
      <div className="mb-8">
        <label htmlFor="f-message" className={label}>Üzenet <span className="sr-only">(kötelező)</span></label>
        <textarea
          id="f-message"
          name="message"
          rows={1}
          placeholder="Írj ide..."
          className={`${field} min-h-8 resize-none overflow-hidden max-md:min-h-11`}
          onInput={(e) => {
            const t = e.currentTarget;
            t.style.height = 'auto';
            t.style.height = `${t.scrollHeight + 1}px`;
          }}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'f-message-err' : undefined}
        />
        {errors.message && <p id="f-message-err" className={err}>{errors.message}</p>}
      </div>

      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:gap-7">
        <button type="submit" className="btn-light" disabled={status.kind === 'sending'}>
          {status.kind === 'sending' ? 'Küldés…' : 'Üzenet küldése'} <span aria-hidden>→</span>
        </button>
        <p className="max-w-[340px] text-xs leading-normal text-muted-dark">Az üzeneted e-mailben érkezik meg hozzám.</p>
      </div>

      <div ref={statusRef} tabIndex={-1} role="status" aria-live="polite" className="mt-5 outline-none">
        {status.kind === 'success' && <p className="border-t border-[#BFD9B6] pt-3 text-[15px] text-[#BFD9B6]">Köszönöm, megkaptam az üzeneted! Hamarosan válaszolok.</p>}
        {status.kind === 'error' && (
          <p className="border-t border-[#F0B1A6] pt-3 text-[15px] text-[#F0B1A6]">
            Az üzenetet most nem sikerült elküldeni. A beírt szöveg megmaradt — próbáld újra, vagy írj közvetlenül:{' '}
            <a className="text-offwhite underline underline-offset-4" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          </p>
        )}
      </div>
    </form>
  );
}
