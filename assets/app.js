/* =========================================================================
 * Painel de Redes Sociais — Sidney Cruz
 * Acompanhamento em tempo real do crescimento de seguidores
 * (Instagram, Facebook, TikTok).
 *
 * Sem dependências externas. Persistência em localStorage.
 *
 * Modelo de dados:
 *   profile = { id, network, name, handle, history: [{ t, v }] }
 *     - history: série temporal de medições (t = timestamp ms, v = seguidores)
 *   settings = { interval (s), source ('manual'|'simulado'|'api'), apiEndpoint }
 *
 * Métricas derivadas:
 *   - seguidores atuais  = último ponto do history
 *   - crescimento 30 dias = atual - valor mais próximo de (agora - 30d)
 * ====================================================================== */

(function () {
  "use strict";

  const STORE_KEY = "sc_dashboard_v1";
  const DAY = 24 * 60 * 60 * 1000;
  const WINDOW_30D = 30 * DAY;

  const NETWORKS = {
    instagram: { label: "Instagram", icon: "IG", sub: "@instagram" },
    facebook:  { label: "Facebook",  icon: "FB", sub: "facebook.com" },
    tiktok:    { label: "TikTok",    icon: "TT", sub: "@tiktok" },
  };

  /* --------------------------- Estado / storage -------------------------- */

  const state = load();

  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) return migrate(JSON.parse(raw));
    } catch (_) { /* ignora dados corrompidos */ }
    return {
      profiles: [],
      settings: { interval: 60, source: "manual", apiEndpoint: "" },
    };
  }

  function migrate(data) {
    data.profiles = Array.isArray(data.profiles) ? data.profiles : [];
    data.settings = Object.assign(
      { interval: 60, source: "manual", apiEndpoint: "" },
      data.settings || {}
    );
    data.profiles.forEach((p) => {
      if (!Array.isArray(p.history)) p.history = [];
    });
    return data;
  }

  function save() {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  }

  /* ------------------------------ Helpers -------------------------------- */

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  const nf = new Intl.NumberFormat("pt-BR");
  const fmt = (n) => nf.format(Math.round(n));

  function fmtCompact(n) {
    return new Intl.NumberFormat("pt-BR", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(n);
  }

  function currentFollowers(p) {
    if (!p.history.length) return 0;
    return p.history[p.history.length - 1].v;
  }

  /** Valor de seguidores ~30 dias atrás (ponto mais próximo do alvo). */
  function followersAt(p, targetTime) {
    if (!p.history.length) return null;
    let best = null;
    let bestDist = Infinity;
    for (const pt of p.history) {
      const d = Math.abs(pt.t - targetTime);
      if (d < bestDist) { bestDist = d; best = pt; }
    }
    return best ? best.v : null;
  }

  /** Crescimento absoluto e percentual nos últimos 30 dias. */
  function growth30(p) {
    const now = Date.now();
    const cur = currentFollowers(p);
    const first = p.history[0];
    if (!first) return { abs: 0, pct: 0, hasBaseline: false };

    // Se não temos 30 dias de histórico, usamos o ponto mais antigo disponível.
    const target = now - WINDOW_30D;
    const base = first.t > target ? first.v : followersAt(p, target);
    if (base == null || base === 0) return { abs: cur - (base || 0), pct: 0, hasBaseline: base != null };
    const abs = cur - base;
    return { abs, pct: (abs / base) * 100, hasBaseline: true };
  }

  function deltaClass(n) {
    return n > 0 ? "delta--up" : n < 0 ? "delta--down" : "delta--flat";
  }
  function deltaArrow(n) {
    return n > 0 ? "▲" : n < 0 ? "▼" : "■";
  }
  function deltaSign(n) {
    return (n > 0 ? "+" : "") + fmt(n);
  }

  /* ----------------------------- Sparkline ------------------------------- */

  function sparkline(history) {
    const pts = history.slice(-40);
    if (pts.length < 2) {
      return `<svg class="spark" viewBox="0 0 100 46" preserveAspectRatio="none"></svg>`;
    }
    const vals = pts.map((p) => p.v);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const range = max - min || 1;
    const W = 100, H = 46, pad = 3;
    const stepX = W / (pts.length - 1);
    const coords = pts.map((p, i) => {
      const x = i * stepX;
      const y = pad + (H - pad * 2) * (1 - (p.v - min) / range);
      return [x, y];
    });
    const line = coords.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
    const area = `${line} L${W},${H} L0,${H} Z`;
    return `<svg class="spark" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
      <path class="spark__area" d="${area}"></path>
      <path class="spark__path" d="${line}"></path>
    </svg>`;
  }

  /* ------------------------------ Render --------------------------------- */

  let activeFilter = "all";

  function render() {
    renderNetSummary();
    renderProfiles();
    $("#footIntervalText").textContent = state.settings.interval + "s";
  }

  function renderNetSummary() {
    const host = $("#netSummary");
    host.innerHTML = Object.entries(NETWORKS).map(([net, meta]) => {
      const list = state.profiles.filter((p) => p.network === net);
      const total = list.reduce((s, p) => s + currentFollowers(p), 0);
      const absSum = list.reduce((s, p) => s + growth30(p).abs, 0);
      const base = total - absSum;
      const pct = base > 0 ? (absSum / base) * 100 : 0;
      const dc = deltaClass(absSum);
      return `
        <article class="net-card" data-net="${net}">
          <div class="net-card__head">
            <div class="net-card__icon">${meta.icon}</div>
            <div>
              <div class="net-card__name">${meta.label}</div>
              <div class="net-card__sub">${list.length} perfil(is)</div>
            </div>
          </div>
          <div class="net-card__total">${fmt(total)}</div>
          <div class="net-card__sub">seguidores no total</div>
          <div class="net-card__growth">
            <span class="delta ${dc}">${deltaArrow(absSum)} ${deltaSign(absSum)}</span>
            <span class="delta__pct">${pct >= 0 ? "+" : ""}${pct.toFixed(1)}% em 30 dias</span>
          </div>
        </article>`;
    }).join("");
  }

  function renderProfiles() {
    const grid = $("#profileGrid");
    const empty = $("#emptyState");
    const visible = state.profiles.filter(
      (p) => activeFilter === "all" || p.network === activeFilter
    );

    $("#profileCount").textContent = state.profiles.length;

    if (!state.profiles.length) {
      grid.innerHTML = "";
      empty.hidden = false;
      return;
    }
    empty.hidden = true;

    grid.innerHTML = visible.map((p) => {
      const meta = NETWORKS[p.network];
      const cur = currentFollowers(p);
      const g = growth30(p);
      const dc = deltaClass(g.abs);
      const initial = (p.name || meta.label).trim().charAt(0).toUpperCase();
      return `
        <article class="card" data-net="${p.network}" data-id="${p.id}">
          <div class="card__head">
            <div class="avatar" data-net="${p.network}">${initial}</div>
            <div class="card__id">
              <div class="card__name" title="${escapeHtml(p.name)}">${escapeHtml(p.name)}</div>
              <div class="card__handle">${meta.label} · @${escapeHtml(p.handle)}</div>
            </div>
            <div class="card__menu">
              <button class="icon-btn" data-action="edit" title="Editar / atualizar">✎</button>
              <button class="icon-btn" data-action="delete" title="Remover">🗑</button>
            </div>
          </div>
          ${sparkline(p.history)}
          <div class="card__metrics">
            <div>
              <div class="metric__value">${fmt(cur)}</div>
              <div class="metric__label">seguidores atuais</div>
            </div>
            <div class="metric--right">
              <div class="metric__value"><span class="delta ${dc}">${deltaArrow(g.abs)} ${deltaSign(g.abs)}</span></div>
              <div class="metric__label">${g.pct >= 0 ? "+" : ""}${g.pct.toFixed(1)}% em 30 dias</div>
            </div>
          </div>
        </article>`;
    }).join("");
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
    ));
  }

  /* --------------------------- CRUD de perfis ---------------------------- */

  function addOrUpdateProfile(form) {
    const id = form.id.value;
    const network = form.network.value;
    const name = form.name.value.trim();
    const handle = form.handle.value.trim().replace(/^@/, "");
    const current = Math.max(0, parseInt(form.current.value, 10) || 0);
    const baseline30 = form.baseline30.value ? Math.max(0, parseInt(form.baseline30.value, 10)) : null;
    const now = Date.now();

    if (id) {
      const p = state.profiles.find((x) => x.id === id);
      if (!p) return;
      p.network = network; p.name = name; p.handle = handle;
      recordMeasurement(p, current, now);
      toast("Perfil atualizado.");
    } else {
      const p = { id: uid(), network, name, handle, history: [] };
      // Semeia base de 30 dias atrás, se informada, para crescimento imediato.
      if (baseline30 != null) p.history.push({ t: now - WINDOW_30D, v: baseline30 });
      p.history.push({ t: now, v: current });
      state.profiles.push(p);
      toast("Perfil adicionado.");
    }
    save();
    render();
  }

  /** Registra uma nova medição evitando duplicar pontos muito próximos. */
  function recordMeasurement(p, value, t = Date.now()) {
    const last = p.history[p.history.length - 1];
    if (last && t - last.t < 60 * 1000) {
      last.v = value; // mesma "janela": apenas corrige o ponto mais recente
    } else {
      p.history.push({ t, v: value });
    }
    // Mantém ~90 dias de histórico para não crescer indefinidamente.
    const cutoff = Date.now() - 90 * DAY;
    p.history = p.history.filter((pt, i) => pt.t >= cutoff || i === 0);
  }

  function deleteProfile(id) {
    const p = state.profiles.find((x) => x.id === id);
    if (!p) return;
    if (!confirm(`Remover "${p.name}"? O histórico será apagado.`)) return;
    state.profiles = state.profiles.filter((x) => x.id !== id);
    save();
    render();
    toast("Perfil removido.");
  }

  /* --------------------- Atualização "em tempo real" --------------------- */

  let timer = null;

  function startTimer() {
    if (timer) clearInterval(timer);
    const ms = Math.max(5, state.settings.interval) * 1000;
    timer = setInterval(tick, ms);
  }

  async function tick(manual = false) {
    const src = state.settings.source;
    let changed = false;

    for (const p of state.profiles) {
      let value = currentFollowers(p);
      if (src === "simulado") {
        value = simulateNext(p);
        changed = true;
      } else if (src === "api" && state.settings.apiEndpoint) {
        const fetched = await fetchFromApi(p);
        if (fetched != null) { value = fetched; changed = true; }
      }
      if (changed) recordMeasurement(p, value);
    }

    if (changed) { save(); render(); }
    updateClock();
    if (manual) toast(src === "manual"
      ? "Modo manual: edite um perfil para registrar novos números."
      : "Dados atualizados.");
  }

  /** Simulação de crescimento orgânico realista para demonstração. */
  function simulateNext(p) {
    const cur = currentFollowers(p) || 1000;
    // Tendência média de ~0,15% por tick + ruído; perfis políticos crescem.
    const trend = cur * 0.0015;
    const noise = (Math.random() - 0.35) * cur * 0.002;
    return Math.max(0, Math.round(cur + trend + noise));
  }

  /**
   * Busca seguidores de um backend próprio.
   * Espera: GET endpoint?network=<rede>&handle=<usuario> -> { followers: number }
   * As APIs oficiais (Instagram/Facebook Graph API, TikTok) exigem tokens e
   * por isso devem ser consultadas a partir de um servidor, nunca do browser.
   */
  async function fetchFromApi(p) {
    try {
      const url = new URL(state.settings.apiEndpoint);
      url.searchParams.set("network", p.network);
      url.searchParams.set("handle", p.handle);
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      const n = Number(data.followers ?? data.count);
      return Number.isFinite(n) ? n : null;
    } catch (err) {
      console.warn("Falha ao buscar API para", p.handle, err);
      return null;
    }
  }

  function updateClock() {
    const now = new Date();
    $("#liveTime").textContent = now.toLocaleTimeString("pt-BR");
  }

  /* ------------------------------ Modais --------------------------------- */

  function openProfileModal(profile) {
    const form = $("#profileForm");
    form.reset();
    if (profile) {
      $("#modalTitle").textContent = "Atualizar perfil";
      form.id.value = profile.id;
      form.network.value = profile.network;
      form.name.value = profile.name;
      form.handle.value = profile.handle;
      form.current.value = currentFollowers(profile);
      form.baseline30.parentElement.style.display = "none";
    } else {
      $("#modalTitle").textContent = "Adicionar perfil";
      form.id.value = "";
      form.baseline30.parentElement.style.display = "";
    }
    $("#profileModal").hidden = false;
  }

  function openSettingsModal() {
    const form = $("#settingsForm");
    form.interval.value = String(state.settings.interval);
    form.source.value = state.settings.source;
    form.apiEndpoint.value = state.settings.apiEndpoint || "";
    $("#apiField").hidden = state.settings.source !== "api";
    $("#settingsModal").hidden = false;
  }

  function closeModals() {
    $("#profileModal").hidden = true;
    $("#settingsModal").hidden = true;
  }

  /* --------------------------- Exportar/Importar ------------------------- */

  function exportData() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `painel-seguidores-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importData(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = migrate(JSON.parse(reader.result));
        state.profiles = data.profiles;
        state.settings = data.settings;
        save();
        startTimer();
        render();
        toast("Dados importados.");
      } catch (_) {
        toast("Arquivo inválido.");
      }
    };
    reader.readAsText(file);
  }

  /* ------------------------------ Demo seed ------------------------------ */

  function seedDemo() {
    const now = Date.now();
    const demo = [
      { network: "instagram", name: "Sidney Cruz Oficial", handle: "sidneycruz", start: 18200, end: 24380 },
      { network: "facebook",  name: "Sidney Cruz",          handle: "sidneycruzsp", start: 31000, end: 33420 },
      { network: "tiktok",    name: "Sidney Cruz",          handle: "sidneycruz", start: 8400,  end: 15960 },
    ];
    state.profiles = demo.map((d) => {
      const history = [];
      const points = 30;
      for (let i = points; i >= 0; i--) {
        const t = now - i * DAY;
        const k = (points - i) / points;
        // crescimento + leve ruído
        const v = Math.round(d.start + (d.end - d.start) * k + (Math.random() - 0.5) * 60);
        history.push({ t, v: Math.max(0, v) });
      }
      return { id: uid(), network: d.network, name: d.name, handle: d.handle, history };
    });
    save();
    render();
    toast("Dados de demonstração carregados.");
  }

  /* ------------------------------- Toast --------------------------------- */

  let toastTimer = null;
  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, 2800);
  }

  /* ------------------------------ Eventos -------------------------------- */

  function bind() {
    $("#btnAddProfile").addEventListener("click", () => openProfileModal(null));
    $("#btnAddFirst").addEventListener("click", () => openProfileModal(null));
    $("#btnSeed").addEventListener("click", seedDemo);
    $("#btnSettings").addEventListener("click", openSettingsModal);
    $("#btnRefresh").addEventListener("click", () => tick(true));

    // fechar modais
    $$("[data-close]").forEach((el) => el.addEventListener("click", closeModals));
    $$(".modal").forEach((m) => m.addEventListener("click", (e) => {
      if (e.target === m) closeModals();
    }));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModals(); });

    // submit perfil
    $("#profileForm").addEventListener("submit", (e) => {
      e.preventDefault();
      addOrUpdateProfile(e.target);
      closeModals();
    });

    // submit settings
    $("#settingsForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const f = e.target;
      state.settings.interval = parseInt(f.interval.value, 10);
      state.settings.source = f.source.value;
      state.settings.apiEndpoint = f.apiEndpoint.value.trim();
      save();
      startTimer();
      render();
      closeModals();
      toast("Configurações salvas.");
    });
    $("#settingsForm").source.addEventListener("change", (e) => {
      $("#apiField").hidden = e.target.value !== "api";
    });

    // ações nos cards (delegação)
    $("#profileGrid").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;
      const id = e.target.closest(".card").dataset.id;
      const profile = state.profiles.find((p) => p.id === id);
      if (btn.dataset.action === "edit") openProfileModal(profile);
      if (btn.dataset.action === "delete") deleteProfile(id);
    });

    // filtros por rede
    $("#netFilter").addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      activeFilter = chip.dataset.net;
      $$("#netFilter .chip").forEach((c) => c.classList.toggle("chip--active", c === chip));
      renderProfiles();
    });

    // exportar / importar
    $("#btnExport").addEventListener("click", exportData);
    $("#btnImport").addEventListener("click", () => $("#importFile").click());
    $("#importFile").addEventListener("change", (e) => {
      if (e.target.files[0]) importData(e.target.files[0]);
      e.target.value = "";
    });
  }

  /* ------------------------------- Init ---------------------------------- */

  bind();
  render();
  updateClock();
  startTimer();
})();
