/* Aplicația: ecranul de start (lume + vârstă), banda de sus, filele, recompensele și modul de tipărire. */
(function (M) {
  const S = {
    theme: M.store.get("tema", "catei"),
    age: M.store.get("varsta", "mijlociu"),
    tab: M.store.get("tab", "personaje"),
    view: M.store.get("view", "home")
  };
  const T = () => M.THEMES.find(t => t.id === S.theme) || M.THEMES[0];
  const A = () => M.AGES[S.age] || M.AGES.mijlociu;
  const cap = s => s[0].toUpperCase() + s.slice(1);

  const TABS = [
    { id: "personaje", label: t => t.name, h: t => `Cunoaște ${t.noun.pl}`,
      p: t => `Fiecare ${t.noun.sg} are o notă și o culoare. Apasă pe fiecare și ascultă.`,
      say: t => `Apasă pe fiecare ${t.noun.sg} ca să-i auzi nota. ` + t.chars.map((c, i) => `${c.n} e ${i === 7 ? "Do-ul de sus" : M.NOTES[i].s}`).join(", ") + "." },
    { id: "pian", label: () => "Pianul", h: t => `Pianul ${t.noun.gpl}`,
      p: (t, a) => (a.track === "staff" ? "Citește nota de pe portativ și apasă clapa potrivită." : "Alege un cântec. Apasă clapa care strălucește, una după alta."),
      say: () => "Alege un cântec. Apoi apasă clapa care strălucește. Așa cânți tot cântecul!" },
    { id: "portativ", label: () => "Portativul", h: () => "Cine stă pe portativ?",
      p: t => `Uite o notă pe liniuțe. Care ${t.noun.sg} locuiește acolo?`,
      say: t => `Uite o notă pe portativ. Care ${t.noun.sg} stă acolo? Apasă pe el.` },
    { id: "susjos", label: () => "Sus sau jos", h: () => "Sus sau jos?",
      p: () => "Ascultă două note. A doua urcă scara sau coboară?",
      say: () => "Ascultă două note. A doua urcă sau coboară? Apasă sus sau jos." },
    { id: "coloreaza", label: () => "Colorează", h: () => "Colorează notele",
      p: () => "Alege o culoare de jos și colorează notele ei de pe portativ.",
      say: () => "Alege o culoare de jos. Apoi apasă pe notele de pe portativ care au culoarea asta." },
    { id: "compune", label: () => "Compune", h: () => "Cântecul meu",
      p: t => `Apasă pe ${t.noun.fav} ca să faci un cântec nou. Apoi apasă Cântă.`,
      say: t => `Apasă pe ${t.noun.fav} și fă un cântec nou. Apoi apasă pe butonul Cântă.` },
    { id: "fise", label: () => "Fișe PDF", h: () => "Fișe de colorat",
      p: () => "Colorează pe ecran, apoi descarcă fișele ca PDF sau tipărește-le.",
      say: () => "Alege o fișă și colorează-o pe ecran. Sau roagă un părinte să o tipărească." }
  ];
  // fix: la prințese, „Apasă pe el” devine „Apasă pe ea”
  const fixGender = (t, s) => (t.id === "printese" ? s.replace("Apasă pe el.", "Apasă pe ea.") : s);

  /* ---------- recompense ---------- */
  M.rewards = () => M.store.get("rw", 0);
  M.addReward = n => {
    M.store.set("rw", M.rewards() + n);
    const c = document.getElementById("rwCount"); if (!c) return;
    c.textContent = M.rewards();
    const b = document.getElementById("bones"); b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop");
  };
  M.party = () => {
    M.happy();
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const icon = T().reward.icon;
    for (let k = 0; k < 16; k++) {
      const el = document.createElement("div");
      el.className = "fall";
      el.style.left = Math.random() * 92 + "vw";
      el.style.animationDelay = Math.random() * .6 + "s";
      el.innerHTML = k % 2 ? icon : `<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="12" fill="${M.NOTES[k % 8].c}"/></svg>`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 2700);
    }
  };

  /* ---------- tema ---------- */
  function applyTheme() {
    const t = T(), r = document.documentElement.style;
    Object.entries(t.v).forEach(([k, v]) => r.setProperty("--" + k.replace(/[A-Z]/g, m => "-" + m.toLowerCase()), v));
    r.setProperty("--pat", t.pat);
    document.documentElement.dataset.theme = t.id;
    document.body.classList.toggle("on-home", S.view === "home");
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = S.view === "home" ? "#89CFF0" : t.v.hdr;
    M.setVoice(t.voice);
    document.title = S.view === "home" ? "Andreea Rotariu Music Hub" : `${t.name} Do-Re-Mi · Andreea Rotariu Music Hub`;
  }

  const app = document.getElementById("app");
  let cleanup = null;
  function render() {
    if (cleanup) { cleanup(); cleanup = null; }
    try { window.speechSynthesis && speechSynthesis.cancel(); } catch (e) {}
    applyTheme();
    S.view === "home" ? home() : shell();
    window.scrollTo(0, 0);
  }
  const go = patch => {
    Object.assign(S, patch);
    M.store.set("tema", S.theme); M.store.set("varsta", S.age); M.store.set("tab", S.tab); M.store.set("view", S.view);
    try { history.replaceState(null, "", S.view === "home" ? location.pathname : "#" + S.tab); } catch (e) {}
    render();
  };

  /* ---------- ecranul de start ---------- */
  function home() {
    app.innerHTML = `<div class="home wrap">
      <header class="home-top">
        <div class="home-notes" aria-hidden="true">${M.NOTES.map(n => `<i style="background:${n.c}"></i>`).join("")}</div>
        <h1><span class="h1a">Andreea Rotariu</span><span class="h1b">Music Hub</span></h1>
        <p>Do, Re, Mi pentru muzicieni mici. Alege o lume și vârsta, apoi cântă, ghicește și colorează.</p>
      </header>
      <h2 class="home-h"><span>1</span>Alege lumea</h2>
      <div class="worlds">${M.THEMES.map(t => `<button class="world" data-t="${t.id}" aria-pressed="${t.id === S.theme}"
          style="--wh:${t.v.hdr};--wa:${t.v.acc};--wb:${t.v.bg};--wi:${t.v.hdrInk};--wp:${t.pat}">
          <span class="w-num">${t.nr}</span>
          <span class="w-pics">${[0, 2, 4].map(i => t.draw(i, "color")).join("")}</span>
          <span class="w-txt"><b>${t.name}</b><small>${t.tag}</small></span></button>`).join("")}</div>
      <h2 class="home-h"><span>2</span>Câți ani are muzicianul?</h2>
      <div class="ages">${Object.values(M.AGES).map(a => `<button class="age" data-a="${a.id}" aria-pressed="${a.id === S.age}">
          <b>${a.nr}</b><span>ani</span><small>${a.what}</small></button>`).join("")}</div>
      <div class="home-go">
        <button class="btn big home-cta" id="go">${M.ICON.play}Hai să cântăm!</button>
        <button class="btn big home-alt" id="goPdf">${M.ICON.brush}Fișe de colorat</button>
      </div>
    </div>`;
    app.querySelector(".worlds").onclick = e => {
      const b = e.target.closest(".world"); if (!b) return;
      go({ theme: b.dataset.t });
      const t = T(); M.setVoice(t.voice); [0, 2, 4].forEach((i, k) => M.play(i, k * .12, .6));
    };
    app.querySelector(".ages").onclick = e => { const b = e.target.closest(".age"); if (b) go({ age: b.dataset.a }); };
    app.querySelector("#go").onclick = () => go({ view: "app", tab: "personaje" });
    app.querySelector("#goPdf").onclick = () => go({ view: "app", tab: "fise" });
  }

  /* ---------- aplicația cu file ---------- */
  function shell() {
    const t = T(), a = A(), tab = TABS.find(x => x.id === S.tab) || TABS[0];
    app.innerHTML = `<header class="hq"><div class="wrap">
        <div class="hq-row">
          <button class="home-btn" id="homeBtn" aria-label="Înapoi la alegerea lumii">${M.ICON.home}</button>
          <div class="hq-pics" aria-hidden="true">${[0, 2, 4, 6].map(i => t.draw(i, "color")).join("")}</div>
          <h1>${t.name} <span>Do-Re-Mi</span></h1>
          <button class="age-pill" id="agePill" title="Schimbă vârsta">${a.label}</button>
          <div class="bones" id="bones" title="${cap(t.reward.many)} câștigate">${t.reward.icon}<span id="rwCount">${M.rewards()}</span></div>
        </div>
        <nav class="tabs" role="tablist" aria-label="Fișe">${TABS.map((x, k) =>
          `<button class="tab" role="tab" id="tab-${x.id}" data-id="${x.id}" aria-selected="${x.id === tab.id}"><span class="num">${k + 1}</span><span><small>Fișa ${k + 1}</small>${x.label(t)}</span></button>`).join("")}</nav>
      </div></header>
      <main class="wrap main"><section class="sheet" role="tabpanel" aria-labelledby="tab-${tab.id}">
        <div class="sheet-head"><div><h2>${tab.h(t, a)}</h2><p>${tab.p(t, a)}</p></div>
        <button class="say" id="say">${M.ICON.say}<span>Citește-mi</span></button></div>
        <div id="body"></div>
      </section></main>`;
    app.querySelector("#homeBtn").onclick = () => go({ view: "home" });
    app.querySelector("#agePill").onclick = () => { const ids = Object.keys(M.AGES); go({ age: ids[(ids.indexOf(S.age) + 1) % ids.length] }); };
    app.querySelector(".tabs").onclick = e => { const b = e.target.closest(".tab"); if (b) go({ tab: b.dataset.id }); };
    app.querySelector("#say").onclick = () => M.speak(fixGender(t, tab.say(t, a)));
    const cur = app.querySelector(".tab[aria-selected=true]");
    if (cur) cur.scrollIntoView({ block: "nearest", inline: "nearest" });
    cleanup = M.GAMES[tab.id](app.querySelector("#body"), t, a) || null;
  }

  /* ---------- pornire ---------- */
  const q = new URLSearchParams(location.search);
  if (q.has("print")) {
    // folosit de scripts/fa-pdf.sh: index.html?print=1&tema=catei&varsta=mijlociu
    if (q.get("tema")) S.theme = q.get("tema");
    if (q.get("varsta")) S.age = q.get("varsta");
    applyTheme();
    document.body.classList.add("print-mode");
    M.renderPrintAll(T(), A());
  } else {
    // link direct spre o lume și o vârstă: index.html?tema=dinozauri&varsta=mic#pian
    if (M.THEMES.some(t => t.id === q.get("tema"))) S.theme = q.get("tema");
    if (M.AGES[q.get("varsta")]) S.age = q.get("varsta");
    const h = location.hash.slice(1);
    if (TABS.some(x => x.id === h)) { S.tab = h; S.view = "app"; }
    render();
    window.addEventListener("hashchange", () => { const h = location.hash.slice(1); if (TABS.some(x => x.id === h) && h !== S.tab) go({ view: "app", tab: h }); });
    try { window.speechSynthesis && speechSynthesis.getVoices(); } catch (e) {}
    // fără internet după prima vizită (doar pe http/https, nu și la deschiderea fișierului direct)
    if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
      window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
    }
  }
})(window.M);
