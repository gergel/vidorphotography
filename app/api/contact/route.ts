import { Resend } from 'resend';
import { CONTACT } from '@/lib/content';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max);

/**
 * Kapcsolati űrlap. Resenddel küld, ha a RESEND_API_KEY környezeti változó be van állítva.
 * Kulcs nélkül 501-et ad, és a böngésző a FormSubmit tartalék útvonalat használja.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) return Response.json({ ok: false, error: 'invalid_json' }, { status: 400 });

  const name = clean(body.name, 200);
  const email = clean(body.email, 200);
  const type = clean(body.type, 50);
  const message = clean(body.message, 5000);
  if (clean(body._honey, 200)) return Response.json({ ok: true }); // spam: csendben eldobjuk
  if (!name || !EMAIL_RE.test(email) || !message) {
    return Response.json({ ok: false, error: 'validation' }, { status: 422 });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) return Response.json({ ok: false, error: 'not_configured' }, { status: 501 });

  const resend = new Resend(key);
  const { error } = await resend.emails.send({
    from: process.env.CONTACT_FROM ?? 'VIDOR weboldal <onboarding@resend.dev>',
    to: process.env.CONTACT_TO ?? CONTACT.email,
    replyTo: email,
    subject: `Új üzenet a weboldalról — ${name}${type ? ` (${type})` : ''}`,
    text: `Név: ${name}\nE-mail: ${email}\nMiben gondolkodik: ${type || '—'}\n\n${message}`,
  });
  if (error) {
    console.error('Resend hiba:', error);
    return Response.json({ ok: false, error: 'send_failed' }, { status: 502 });
  }
  return Response.json({ ok: true });
}
