/*
  Vercel Function: POST /api/contact (the page's booking form).
  The logic lives in api/_lib/contact.mjs (shared with the local server). On Vercel the disk is read-only, so each
  request is emailed through SMTP when SMTP_HOST is set and always written to the function log (Vercel dashboard ->
  your project -> Logs). Set CONTACT_TO, CONTACT_FROM and the SMTP_* variables in Project Settings -> Environment
  Variables.
*/
import { handleContact, clientIp, json } from './_lib/contact.mjs';

export async function POST(request) {
  try {
    return await handleContact(request, { ip: clientIp(request.headers) });
  } catch (e) {
    console.error('[contact]', e);
    return json(500, { ok: false, error: 'Server error.' });
  }
}

export function GET() {
  return json(405, { ok: false, error: 'Use POST.' }, { Allow: 'POST' });
}
