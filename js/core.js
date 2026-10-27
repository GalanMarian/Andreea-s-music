/* Nucleul aplicației: notele și culorile lor, sunetul, portativul, cântecele, memoria din browser. */
window.M = {};
(function (M) {
  /* Cele 8 note, cu culorile clasice pentru copii (Do roșu ... Si mov). Culorile rămân aceleași în toate lumile. */
  M.NOTES = [
    { s: "Do",  c: "#E5322D", f: 261.63, cn: "roșu" },
    { s: "Re",  c: "#F2851A", f: 293.66, cn: "portocaliu" },
    { s: "Mi",  c: "#F5C211", f: 329.63, cn: "galben" },
    { s: "Fa",  c: "#33B04A", f: 349.23, cn: "verde" },
    { s: "Sol", c: "#14AFC7", f: 392.0,  cn: "turcoaz" },
    { s: "La",  c: "#2E66D6", f: 440.0,  cn: "albastru" },
    { s: "Si",  c: "#8B44C6", f: 493.88, cn: "mov" },
    { s: "Do",  c: "#E8418E", f: 523.25, cn: "roz" }
  ];
  const hexToRgb = hex => { const n = parseInt(hex.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
  const rgbToHex = rgb => "#" + rgb.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
  M.shade = (hex, k) => rgbToHex(hexToRgb(hex).map(v => v * k));
  M.tint = (hex, k) => rgbToHex(hexToRgb(hex).map(v => v + (255 - v) * k));
  M.NOTES.forEach(n => { n.cd = M.shade(n.c, .72); n.cl = M.tint(n.c, .86); });
  M.syl = i => (i === 7 ? "Do'" : M.NOTES[i].s);

  /* Memoria din browser; dacă e blocată, aplicația merge mai departe fără ea. */
  M.store = {
    get(k, d) { try { const v = localStorage.getItem("muzica-" + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("muzica-" + k, JSON.stringify(v)); } catch (e) {} }
  };

  /* Aleator cu sămânță, ca fișele de tipărit să iasă la fel de fiecare dată. */
  M.rng = seed => {
    let h = 1779033703 ^ seed.length;
    for (let i = 0; i < seed.length; i++) { h = Math.imul(h ^ seed.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
    let a = h >>> 0;
    return () => {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  M.shuffle = (arr, r = Math.random) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };

  /* ---------- sunetul: fiecare lume are instrumentul ei, sintetizat, fără fișiere ---------- */
  const VOICES = {
    xilofon:      { p: [[1, "triangle", 1], [2, "sine", .22], [4, "sine", .06]], d: .7, v: .32 },
    cutie:        { p: [[1, "sine", 1], [3, "sine", .16], [5.04, "sine", .05]], d: 1.1, v: .3 },
    marimba:      { p: [[1, "sine", 1], [4, "sine", .14], [9.2, "sine", .03]], d: .55, v: .4 },
    sintetizator: { p: [[1, "square", .2], [2, "triangle", .3]], d: .6, v: .3, lp: 2200 },
    clopotei:     { p: [[1, "sine", 1], [2.76, "sine", .22], [5.4, "sine", .07]], d: 1.5, v: .28 }
  };
  let ctx, voice = VOICES.xilofon;
  M.setVoice = id => { voice = VOICES[id] || VOICES.xilofon; };
  function ac() {
    if (!ctx) { const A = window.AudioContext || window.webkitAudioContext; if (!A) return null; ctx = new A(); }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }
  M.tone = (freq, at = 0, dur = voice.d, vol = voice.v) => {
    const c = ac(); if (!c) return;
    const t = c.currentTime + at + .02;
    const g = c.createGain();
    g.gain.setValueAtTime(.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + .012);
    g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    let out = g;
    if (voice.lp) { const f = c.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = voice.lp; g.connect(f); out = f; }
    out.connect(c.destination);
    voice.p.forEach(([m, type, v]) => {
      const o = c.createOscillator(), og = c.createGain();
      o.type = type; o.frequency.value = freq * m; og.gain.value = v;
      o.connect(og); og.connect(g); o.start(t); o.stop(t + dur + .05);
    });
  };
  M.play = (i, at = 0, dur) => M.tone(M.NOTES[i].f, at, dur);
  M.happy = () => [0, 2, 4, 7].forEach((i, k) => M.tone(M.NOTES[i].f * 2, k * .09, .4, .16));
  M.oops = () => { M.tone(196, 0, .25, .22); M.tone(174.6, .16, .35, .22); };

  /* Cântă o melodie; onStep(k) primește nota curentă, apoi -1 la final. Întoarce funcția de oprire. */
  M.playSong = (song, onStep, beat = .42) => {
    let t = 0; const timers = [];
    song.n.forEach((i, k) => {
      M.play(i, t, Math.max(.35, Math.min(1.3, song.b[k] * beat + .3)));
      timers.push(setTimeout(() => onStep && onStep(k), t * 1000));
      t += song.b[k] * beat;
    });
    timers.push(setTimeout(() => onStep && onStep(-1), t * 1000 + 200));
    return () => timers.forEach(clearTimeout);
  };

  /* ---------- cântece populare, libere de drepturi (b = durata în timpi) ---------- */
  M.SONGS = [
    { id: "chifle",    t: "Chiflele calde", n: [2,1,0,2,1,0,0,0,0,0,1,1,1,1,2,1,0], b: [1,1,2,1,1,2,.5,.5,.5,.5,.5,.5,.5,.5,1,1,2] },
    { id: "scaramica", t: "Scara mică",     n: [0,1,2,3,4,4,3,2,1,0], b: [1,1,1,1,2,1,1,1,1,2] },
    { id: "scara",     t: "Scara muzicală", n: [0,1,2,3,4,5,6,7,7,6,5,4,3,2,1,0], b: [1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,2] },
    { id: "stea",      t: "Steluța",        n: [0,0,4,4,5,5,4,3,3,2,2,1,1,0], b: [1,1,1,1,1,1,2,1,1,1,1,1,1,2] },
    { id: "oda",       t: "Oda bucuriei",   n: [2,2,3,4,4,3,2,1,0,0,1,2,2,1,1], b: [1,1,1,1,1,1,1,1,1,1,1,1,1.5,.5,2] },
    { id: "ioane",     t: "Frate Ioane",    n: [0,1,2,0,0,1,2,0,2,3,4,2,3,4], b: [1,1,1,1,1,1,1,1,1,1,2,1,1,2] },
    { id: "miel",      t: "Mielușelul",     n: [2,1,0,1,2,2,2,1,1,1,2,4,4,2,1,0,1,2,2,2,2,1,1,2,1,0], b: [1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,3] },
    { id: "clopotei",  t: "Clopoței",       n: [2,2,2,2,2,2,2,4,0,1,2,3,3,3,3,3,2,2,2,2,2,1,1,2,1,4], b: [1,1,2,1,1,2,1,1,1.5,.5,4,1,1,1.5,.5,1,1,1,.5,.5,1,1,1,1,2,2] }
  ];

  /* ---------- vârstele ---------- */
  const ALL = [0, 1, 2, 3, 4, 5, 6, 7];
  M.AGES = {
    mic: {
      id: "mic", label: "3–4 ani", nr: "3–4", what: "Do, Mi, Sol și cântece scurte",
      songs: ["chifle", "scaramica", "stea"],
      quiz: [{ t: "Do și Sol", pool: [0, 4] }, { t: "Do, Mi, Sol", pool: [0, 2, 4] }],
      opts: 2, gap: 4, compose: 5, colorLen: 6, track: "bubbles", help: true,
      sheets: { colorSongs: [["chifle", "scaramica"]], unite: [[0, 2, 4]], write: false }
    },
    mijlociu: {
      id: "mijlociu", label: "5–6 ani", nr: "5–6", what: "toate cele 8 note, pe culori",
      songs: ["scara", "stea", "oda", "ioane", "miel", "clopotei"],
      quiz: [{ t: "Do, Mi, Sol", pool: [0, 2, 4] }, { t: "De la Do la Sol", pool: [0, 1, 2, 3, 4] }, { t: "Toate notele", pool: ALL }],
      opts: 3, gap: 2, compose: 8, colorLen: 8, track: "bubbles", help: false,
      sheets: { colorSongs: [["scara", "stea", "oda"], ["ioane", "miel", "clopotei"]], unite: [[0, 2, 5, 7], [1, 3, 4, 6]], write: false }
    },
    mare: {
      id: "mare", label: "7–8 ani", nr: "7–8", what: "citim partitura, fără ajutorul culorilor",
      songs: ["scara", "stea", "oda", "ioane", "miel", "clopotei"],
      quiz: [{ t: "De la Do la Sol", pool: [0, 1, 2, 3, 4] }, { t: "Toate notele", pool: ALL }, { t: "Doar portativul", pool: ALL, plain: true }],
      opts: 4, gap: 1, compose: 12, colorLen: 10, track: "staff", help: false,
      sheets: { colorSongs: [["stea", "oda", "ioane"], ["miel", "clopotei", "scara"]], unite: [[1, 3, 5, 6]], write: true }
    }
  };

  /* ---------- portativul ---------- */
  // treptele: 0 = Do (cu linie suplimentară dedesubt) ... 7 = Do de sus
  M.yOf = i => 104 - (i - 2) * 8;
  M.staff = (notes, o = {}) => {
    const gap = o.gap || 58, start = o.start || 92, H = 152, ink = "#1B2A4A";
    const slots = Math.max(notes.length, o.min || 0);
    const W = start + slots * gap + 10;
    const size = o.fit ? `width="100%" style="display:block;max-width:100%;height:auto"` : `width="${W}" height="${H}" style="display:block"`;
    let s = `<svg viewBox="0 0 ${W} ${H}" ${size} role="img" aria-label="${o.label || "Portativ"}">`;
    for (let l = 0; l < 5; l++) s += `<line x1="6" x2="${W - 6}" y1="${40 + l * 16}" y2="${40 + l * 16}" stroke="${ink}" stroke-width="2"/>`;
    s += `<text class="clef" x="8" y="114" font-size="86" fill="${ink}">𝄞</text>`;
    for (let k = 0; k < slots; k++) {
      const n = notes[k], x = start + k * gap + gap / 2;
      if (!n) { s += `<circle cx="${x}" cy="72" r="11" fill="none" stroke="#B9C9E2" stroke-width="2.5" stroke-dasharray="4 4"/>`; continue; }
      const y = M.yOf(n.i);
      s += `<g class="head${n.cls ? " " + n.cls : ""}" data-k="${k}">`;
      if (!o.noHit) s += `<rect x="${x - gap / 2 + 2}" y="20" width="${gap - 4}" height="128" fill="transparent"/>`;
      if (n.ring) s += `<rect x="${x - gap / 2 + 4}" y="22" width="${gap - 8}" height="114" rx="14" fill="${n.ring}" opacity=".45"/>`;
      if (!n.ghost) {
        if (n.i === 0) s += `<line x1="${x - 17}" x2="${x + 17}" y1="120" y2="120" stroke="${ink}" stroke-width="2"/>`;
        if (!o.noStem) {
          s += n.i >= 6
            ? `<line x1="${x - 9.4}" x2="${x - 9.4}" y1="${y + 2}" y2="${y + 48}" stroke="${ink}" stroke-width="2.4"/>`
            : `<line x1="${x + 9.4}" x2="${x + 9.4}" y1="${y - 2}" y2="${y - 50}" stroke="${ink}" stroke-width="2.4"/>`;
        }
        const hollow = n.cz || n.fill === "#fff";
        s += `<ellipse${n.cz ? ' class="cz"' : ""} cx="${x}" cy="${y}" rx="10.5" ry="7.8" transform="rotate(-20 ${x} ${y})" fill="${hollow ? "#fff" : (n.fill || ink)}" stroke="${ink}" stroke-width="${hollow ? 2.6 : 1.2}"/>`;
      }
      if (n.label) s += `<text x="${x}" y="146" text-anchor="middle" font-family="'Baloo 2',sans-serif" font-weight="800" font-size="16" fill="${n.labelColor || "#56658A"}">${n.label}</text>`;
      if (n.box) s += `<rect x="${x - 21}" y="127" width="42" height="23" rx="6" fill="none" stroke="#8C99B3" stroke-width="1.6" stroke-dasharray="4 3"/>`;
      s += `</g>`;
    }
    return s + `</svg>`;
  };

  /* ---------- vocea care citește indicațiile ---------- */
  M.speak = text => {
    try {
      const s = window.speechSynthesis; if (!s) return;
      s.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "ro-RO"; u.rate = .92; u.pitch = 1.15;
      const v = s.getVoices().find(v => v.lang && v.lang.toLowerCase().startsWith("ro"));
      if (v) u.voice = v;
      s.speak(u);
    } catch (e) {}
  };

  M.ICON = {
    say: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>`,
    play: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l13-7.5z" fill="currentColor"/></svg>`,
    ear: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M7 10a5 5 0 1 1 10 0c0 3-3 4-3 7a3 3 0 0 1-5 2"/><path d="M10 10a2 2 0 1 1 4 0"/></svg>`,
    home: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" fill="currentColor"/></svg>`,
    pdf: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9V3h12v6M6 18H4a1 1 0 0 1-1-1v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1h-2"/><path d="M6 14h12v7H6z"/></svg>`,
    download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"/></svg>`,
    up: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l8 9h-5v9H9v-9H4z" fill="currentColor"/></svg>`,
    down: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21l-8-9h5V3h6v9h5z" fill="currentColor"/></svg>`,
    brush: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4l6 6-8.5 8.5a3 3 0 0 1-2 .9L6 19.5l.1-3.5a3 3 0 0 1 .9-2z"/><path d="M4 21c1.5 0 2-1 2-1.5"/></svg>`
  };
})(window.M);
