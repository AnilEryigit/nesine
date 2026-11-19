import { NOTEBOOK_MATCHES } from '../_lib/engine.js';

export async function onRequestGet() {
  return new Response(JSON.stringify({ entries: NOTEBOOK_MATCHES }), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

export async function onRequestPost({ request }) {
  try {
    const body = await request.json();
    const entry = {
      id: `custom-${Date.now()}`,
      group: body?.group || 'Özel Kayıt',
      match: String(body?.match || '').trim(),
      ms1: Number(body?.ms1),
      msX: Number(body?.msX),
      ms2: Number(body?.ms2),
      plus6: body?.plus6 ? Number(body.plus6) : null,
      score: body?.score ? String(body.score).trim() : '-',
      iyms: body?.iyms ? String(body.iyms).trim() : '',
      note: body?.note ? String(body.note).trim() : '',
    };
    return new Response(JSON.stringify({ ok: true, entry }), {
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }
}
