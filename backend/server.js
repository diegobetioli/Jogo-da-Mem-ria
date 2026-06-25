/* =========================================================================
 * Conector de seguidores — Painel Sidney Cruz
 *
 * Pequeno servidor que busca o número de seguidores das contas OFICIAIS da
 * campanha nas redes e responde no formato que o painel espera:
 *
 *     GET /followers?network=<instagram|facebook|tiktok>&handle=<usuario>
 *     ->  { "followers": 12345, "network": "...", "handle": "...", "updatedAt": "..." }
 *
 * Importante: só funciona para contas que a campanha controla (Instagram/
 * Facebook via Meta, TikTok via login do dono). Perfis de adversários NÃO são
 * acessíveis por aqui — esses continuam manuais no painel.
 *
 * Sem dependências externas. Requer Node 18+ (usa fetch nativo).
 * As "chaves de acesso" ficam em variáveis de ambiente (arquivo .env / painel
 * do serviço de hospedagem) — nunca dentro do código.
 * ====================================================================== */

"use strict";

const http = require("http");

const PORT = process.env.PORT || 3000;
const ALLOW_ORIGIN = process.env.ALLOW_ORIGIN || "*";
const GRAPH = `https://graph.facebook.com/${process.env.META_GRAPH_VERSION || "v21.0"}`;

// Mapeamentos rede:usuario -> id da conta. Definidos por variável de ambiente
// como JSON. Ex.: META_MAP={"facebook:sidneycruzsp":"1234","instagram:sidneycruz":"5678"}
const META_MAP = parseJsonEnv("META_MAP");
const TIKTOK_MAP = parseJsonEnv("TIKTOK_MAP");

function parseJsonEnv(name) {
  try { return JSON.parse(process.env[name] || "{}"); }
  catch (_) { console.warn(`Variável ${name} não é um JSON válido; ignorando.`); return {}; }
}

/* --------------------------- Provedores -------------------------------- */

/** Facebook Page: seguidores via Graph API. */
async function getFacebook(handle) {
  const id = META_MAP[`facebook:${handle}`];
  if (!id) throw httpError(404, `Página do Facebook "${handle}" não configurada em META_MAP.`);
  const url = `${GRAPH}/${id}?fields=followers_count,fan_count&access_token=${enc(process.env.META_TOKEN)}`;
  const data = await getJson(url);
  if (data.error) throw httpError(502, "Meta: " + data.error.message);
  return data.followers_count ?? data.fan_count ?? null;
}

/** Instagram Business/Creator: seguidores via Graph API. */
async function getInstagram(handle) {
  const id = META_MAP[`instagram:${handle}`];
  if (id) {
    const url = `${GRAPH}/${id}?fields=followers_count&access_token=${enc(process.env.META_TOKEN)}`;
    const data = await getJson(url);
    if (data.error) throw httpError(502, "Meta: " + data.error.message);
    return data.followers_count ?? null;
  }
  // Sem id próprio mapeado: tenta "Business Discovery" a partir da conta da
  // campanha (META_IG_SELF_ID). Funciona para perfis públicos business/creator.
  const selfId = process.env.META_IG_SELF_ID;
  if (!selfId) throw httpError(404, `Instagram "${handle}" não configurado (META_MAP ou META_IG_SELF_ID).`);
  const url = `${GRAPH}/${selfId}?fields=business_discovery.username(${enc(handle)}){followers_count}&access_token=${enc(process.env.META_TOKEN)}`;
  const data = await getJson(url);
  if (data.error) throw httpError(502, "Meta: " + data.error.message);
  return data?.business_discovery?.followers_count ?? null;
}

/** TikTok: seguidores da conta autenticada (dono fez login no app). */
async function getTiktok(handle) {
  const token = TIKTOK_MAP[`tiktok:${handle}`] || process.env.TIKTOK_TOKEN;
  if (!token) throw httpError(404, `TikTok "${handle}" não configurado (TIKTOK_TOKEN/TIKTOK_MAP).`);
  const url = "https://open.tiktokapis.com/v2/user/info/?fields=follower_count";
  const data = await getJson(url, { headers: { Authorization: `Bearer ${token}` } });
  if (data.error && data.error.code && data.error.code !== "ok") {
    throw httpError(502, "TikTok: " + (data.error.message || data.error.code));
  }
  return data?.data?.user?.follower_count ?? null;
}

const PROVIDERS = { facebook: getFacebook, instagram: getInstagram, tiktok: getTiktok };

/* ------------------------------ HTTP ----------------------------------- */

const server = http.createServer(async (req, res) => {
  const cors = {
    "Access-Control-Allow-Origin": ALLOW_ORIGIN,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
  };
  if (req.method === "OPTIONS") { res.writeHead(204, cors); return res.end(); }

  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === "/health") {
    return send(res, 200, cors, { ok: true });
  }

  if (url.pathname === "/followers") {
    const network = (url.searchParams.get("network") || "").toLowerCase();
    const handle = (url.searchParams.get("handle") || "").replace(/^@/, "").trim();
    const provider = PROVIDERS[network];
    if (!provider) return send(res, 400, cors, { error: "Rede inválida. Use instagram, facebook ou tiktok." });
    if (!handle) return send(res, 400, cors, { error: "Informe o parâmetro handle." });
    try {
      const followers = await provider(handle);
      if (followers == null) return send(res, 502, cors, { error: "Não foi possível obter os seguidores." });
      return send(res, 200, cors, { followers, network, handle, updatedAt: new Date().toISOString() });
    } catch (err) {
      return send(res, err.status || 500, cors, { error: err.message || "Erro interno." });
    }
  }

  send(res, 404, cors, { error: "Rota não encontrada. Use /followers?network=&handle=" });
});

server.listen(PORT, () => console.log(`Conector de seguidores ouvindo na porta ${PORT}`));

/* ----------------------------- Helpers --------------------------------- */

function send(res, status, headers, body) {
  res.writeHead(status, Object.assign({ "Content-Type": "application/json; charset=utf-8" }, headers));
  res.end(JSON.stringify(body));
}
async function getJson(url, opts) {
  const r = await fetch(url, opts);
  return r.json();
}
function httpError(status, message) { const e = new Error(message); e.status = status; return e; }
function enc(v) { return encodeURIComponent(v || ""); }

module.exports = { server, PROVIDERS };
