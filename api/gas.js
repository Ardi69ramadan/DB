// /api/gas.js
const GAS_URL = 'https://script.google.com/macros/s/AKfycbw--rDvgWWJuB7hDtFLAXVPl80yW4z4X2F9bPiK39E57fdyFcvE01mvnH_kQYKDBlU8/exec'; // ← GANTI

export default async function handler(req, res) {
  // CORS (izinkan dari mana saja)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end(); // preflight OK
  }

  try {
    if (req.method === 'GET') {
      const qs = new URLSearchParams(req.query || {}).toString();
      const target = `${GAS_URL}${qs ? `?${qs}` : ''}`;
      const r = await fetch(target, { method: 'GET' });
      const text = await r.text();
      // biarkan tipe konten dari GAS (bisa JSON atau HTML untuk exportPdf)
      res.status(r.status).send(text);
      return;
    }

    if (req.method === 'POST') {
      // penting: Apps Script doPost kita menerima text/plain berisi JSON string
      const bodyStr = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
      const r = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: bodyStr
      });
      const text = await r.text();
      res.status(r.status).send(text);
      return;
    }

    res.status(405).json({ ok: false, message: 'Method Not Allowed' });
  } catch (e) {
    res.status(502).json({ ok: false, message: 'PROXY_ERROR', detail: String(e) });
  }
}
