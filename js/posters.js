/* Fișele mari de activități: câte 8 jocuri pe o singură pagină A4, în designul fiecărei lumi.
   1. „Hai să descoperim notele muzicale!”  2. „Mic muzician în acțiune!”
   Desenele noi (durate, vioară, instrumente, labirint) sunt contur, cu zone .cz de colorat pe ecran. */
(function (M) {
  const N = M.NOTES, INK = "#1B2A4A", LINE = "#2A2A35";
  const cap = s => s[0].toUpperCase() + s.slice(1);
  const Z = `fill="#fff" stroke="${LINE}" stroke-width="1.6" stroke-linejoin="round" class="cz"`;
  const sw = i => `<span class="sw" style="background:${N[i].c}"></span>`;

  /* ---------- desene mici ---------- */
  // durate: w = întreagă, h = doime, hd = doime cu punct, q = pătrime, e = două optimi, s = patru șaisprezecimi
  function rhythm(kind) {
    const head = (x, y, filled) => `<ellipse cx="${x}" cy="${y}" rx="6.4" ry="4.6" transform="rotate(-20 ${x} ${y})" fill="${filled ? INK : "#fff"}" stroke="${INK}" stroke-width="2.2"/>`;
    const stem = (x, y1, y2) => `<line x1="${x}" x2="${x}" y1="${y1}" y2="${y2}" stroke="${INK}" stroke-width="2.2"/>`;
    let s = "";
    if (kind === "w") s = `<ellipse cx="30" cy="22" rx="8.5" ry="5.8" fill="#fff" stroke="${INK}" stroke-width="3.2"/>`;
    if (kind === "h" || kind === "hd") s = head(26, 28, false) + stem(32.2, 27, 4) + (kind === "hd" ? `<circle cx="39" cy="28" r="2.4" fill="${INK}"/>` : "");
    if (kind === "q") s = head(26, 28, true) + stem(32.2, 27, 4);
    if (kind === "e") s = head(17, 28, true) + head(41, 28, true) + stem(23.2, 27, 5) + stem(47.2, 27, 5) + `<rect x="22.1" y="4" width="26.2" height="4" fill="${INK}"/>`;
    if (kind === "s") {
      [8, 22, 36, 50].forEach(x => { s += head(x, 28, true) + stem(x + 6.2, 27, 5); });
      s += `<rect x="13.1" y="4" width="44.2" height="3.4" fill="${INK}"/><rect x="13.1" y="10" width="44.2" height="3.4" fill="${INK}"/>`;
    }
    return `<svg viewBox="0 0 60 36" aria-hidden="true">${s}</svg>`;
  }
  const crayon = c => `<svg viewBox="0 0 44 14" aria-hidden="true"><path d="M9 2h25l8 5-8 5H9z" fill="${c}" stroke="${LINE}" stroke-width="1.2" stroke-linejoin="round"/><rect x="2" y="2" width="8" height="10" rx="2" fill="${M.shade(c, .7)}" stroke="${LINE}" stroke-width="1.2"/><path d="M38 4.5l4 2.5-4 2.5z" fill="${LINE}"/></svg>`;
  const hollowNote = () => `<svg viewBox="0 0 30 44" aria-hidden="true"><ellipse class="cz" cx="12" cy="35" rx="9" ry="6.5" transform="rotate(-20 12 35)" fill="#fff" stroke="${LINE}" stroke-width="2.6"/><line x1="20.4" x2="20.4" y1="33" y2="3" stroke="${LINE}" stroke-width="2.6"/></svg>`;

  function violin() {
    return `
      <path d="M40 50C26 50 20 56 21 64C22 70 28 72 27 78C26 84 18 86 18 96C18 108 30 113 40 113C50 113 62 108 62 96C62 86 54 84 53 78C52 72 58 70 59 64C60 56 54 50 40 50Z" ${Z}/>
      <path d="M31 84q-3 4 0 8q3 4 0 8M49 84q3 4 0 8q-3 4 0 8" fill="none" stroke="${LINE}" stroke-width="1.4" stroke-linecap="round"/>
      <rect x="36.5" y="22" width="7" height="64" rx="3" ${Z}/>
      <rect x="37" y="11" width="6" height="12" rx="2" ${Z}/>
      <path d="M32.5 14h4.5M32.5 19.5h4.5M43 14h4.5M43 19.5h4.5" stroke="${LINE}" stroke-width="2.8" stroke-linecap="round"/>
      <circle cx="40" cy="6.6" r="4.6" ${Z}/><path d="M40.6 6.6a1.8 1.8 0 1 1-1.8-1.8" fill="none" stroke="${LINE}" stroke-width="1.2"/>
      <rect x="34" y="91" width="12" height="2.8" rx="1" ${Z}/>
      <path d="M36.4 98h7.2l-1.4 11h-4.4z" ${Z}/>
      <path d="M38.3 13v86M39.4 13v86M40.6 13v86M41.7 13v86" stroke="${LINE}" stroke-width=".45"/>`;
  }

  const INSTR = {
    Pian: `<rect x="4" y="6" width="52" height="14" rx="3" ${Z}/><rect x="4" y="20" width="52" height="22" ${Z}/>
      ${[1, 2, 3, 4, 5, 6, 7].map(k => `<line x1="${4 + k * 6.5}" x2="${4 + k * 6.5}" y1="20" y2="42" stroke="${LINE}" stroke-width="1.2"/>`).join("")}
      ${[1, 2, 4, 5, 6].map(k => `<rect x="${4 + k * 6.5 - 2}" y="20" width="4" height="12" fill="${LINE}"/>`).join("")}
      <path d="M8 42v6M52 42v6" stroke="${LINE}" stroke-width="2.4" stroke-linecap="round"/>`,
    Tobă: `<path d="M10 18v18c0 3.3 9 6 20 6s20-2.7 20-6V18" ${Z}/><ellipse cx="30" cy="18" rx="20" ry="6" ${Z}/>
      <path d="M10 22l5 15 5-15 5 17 5-17 5 17 5-17 5 15 5-15" fill="none" stroke="${LINE}" stroke-width="1.2" stroke-linejoin="round"/>
      <path d="M17 2l14 13M44 2L30 15" stroke="${LINE}" stroke-width="2.2" stroke-linecap="round"/><circle cx="16.5" cy="2.5" r="2.4" ${Z}/><circle cx="44.5" cy="2.5" r="2.4" ${Z}/>`,
    Chitară: `<rect x="26" y="1" width="8" height="6" rx="2" ${Z}/><rect x="28" y="6" width="4" height="13" ${Z}/>
      <path d="M30 17C22 17 21 23 22 27C23 30 18 31 18 38C18 45 23 49 30 49C37 49 42 45 42 38C42 31 37 30 38 27C39 23 38 17 30 17Z" ${Z}/>
      <circle cx="30" cy="34" r="3.6" fill="${LINE}"/><rect x="25" y="41" width="10" height="2.6" rx="1" fill="${LINE}"/>
      <path d="M29 4v38M31 4v38" stroke="${LINE}" stroke-width=".5"/>`,
    Trompetă: `<rect x="2" y="25" width="6" height="4" rx="1" ${Z}/><rect x="7" y="23" width="32" height="8" rx="2" ${Z}/>
      <path d="M38 23l17-9v26l-17-9z" ${Z}/>
      ${[15, 22, 29].map(x => `<rect x="${x}" y="13" width="4.5" height="10" ${Z}/><circle cx="${x + 2.25}" cy="11.5" r="2.4" ${Z}/>`).join("")}
      <path d="M13 31v7h22v-7" fill="none" stroke="${LINE}" stroke-width="2"/>`
  };
  const instrSvg = name => `<svg viewBox="0 0 60 50" aria-hidden="true">${INSTR[name]}</svg>`;

  /* portativ mic pentru cutiile strâmte: aceleași trepte ca portativul mare, la jumătate de mărime */
  function miniStaff(notes, slots = notes.length || 1, gap = 26) {
    const start = 40, W = start + slots * gap + 6, y = i => 46 - (i - 2) * 4;
    // zona merge de la -4 la 70: cheia sol urcă peste linia de sus și coboară sub cea de jos
    let s = `<svg viewBox="0 -4 ${W} 74" overflow="visible" aria-label="Portativ">`;
    for (let l = 0; l < 5; l++) s += `<line x1="2" x2="${W - 2}" y1="${14 + l * 8}" y2="${14 + l * 8}" stroke="${INK}" stroke-width="1.1"/>`;
    s += `<text class="clef" x="3" y="51" font-size="43" fill="${INK}">𝄞</text>`;
    notes.forEach((i, k) => {
      const x = start + k * gap + gap / 2, cy = y(i);
      if (i === 0) s += `<line x1="${x - 9}" x2="${x + 9}" y1="54" y2="54" stroke="${INK}" stroke-width="1.1"/>`;
      s += i >= 6 ? `<line x1="${x - 4.8}" x2="${x - 4.8}" y1="${cy + 1}" y2="${cy + 24}" stroke="${INK}" stroke-width="1.3"/>`
                  : `<line x1="${x + 4.8}" x2="${x + 4.8}" y1="${cy - 1}" y2="${cy - 25}" stroke="${INK}" stroke-width="1.3"/>`;
      s += `<ellipse cx="${x}" cy="${cy}" rx="5.4" ry="4" transform="rotate(-20 ${x} ${cy})" fill="${INK}"/>`;
    });
    return s + `</svg>`;
  }

  /* ---------- labirintul: drumul trece prin Do, Re, Mi ... Do în ordine ---------- */
  function makeMaze(rnd, C = 9, R = 6) {
    for (let t = 0; t < 60; t++) {
      const id = (x, y) => y * C + x;
      const W = Array.from({ length: C * R }, () => [1, 1, 1, 1]); // sus, dreapta, jos, stânga
      const sy = Math.floor(R / 2), seen = new Set([id(0, sy)]), stack = [[0, sy]];
      const DIRS = [[0, -1, 0, 2], [1, 0, 1, 3], [0, 1, 2, 0], [-1, 0, 3, 1]];
      while (stack.length) {
        const [x, y] = stack[stack.length - 1];
        const nb = DIRS.filter(([dx, dy]) => { const nx = x + dx, ny = y + dy; return nx >= 0 && ny >= 0 && nx < C && ny < R && !seen.has(id(nx, ny)); });
        if (!nb.length) { stack.pop(); continue; }
        const [dx, dy, a, b] = nb[Math.floor(rnd() * nb.length)];
        W[id(x, y)][a] = 0; W[id(x + dx, y + dy)][b] = 0;
        seen.add(id(x + dx, y + dy)); stack.push([x + dx, y + dy]);
      }
      const ey = Math.floor(rnd() * R), prev = new Map([[id(0, sy), -1]]), q = [[0, sy]];
      while (q.length) {
        const [x, y] = q.shift();
        DIRS.forEach(([dx, dy, a]) => { if (W[id(x, y)][a]) return; const k = id(x + dx, y + dy); if (!prev.has(k)) { prev.set(k, id(x, y)); q.push([x + dx, y + dy]); } });
      }
      const path = [];
      for (let k = id(C - 1, ey); k !== -1; k = prev.get(k)) path.unshift(k);
      if (path.length >= 14) return { C, R, W, path, sy, ey };
    }
  }
  function mazeSvg(rnd, colored) {
    const m = makeMaze(rnd), S = 12, ox = 12, oy = 3;
    const { C, R, W, path, sy, ey } = m;
    let s = "";
    for (let y = 0; y < R; y++) for (let x = 0; x < C; x++) {
      const w = W[y * C + x], X = ox + x * S, Y = oy + y * S;
      if (w[0]) s += `M${X} ${Y}h${S}`;
      if (w[3] && !(x === 0 && y === sy)) s += `M${X} ${Y}v${S}`;
      if (y === R - 1 && w[2]) s += `M${X} ${Y + S}h${S}`;
      if (x === C - 1 && w[1] && y !== ey) s += `M${X + S} ${Y}v${S}`;
    }
    const spots = [];
    for (let k = 0; k < 8; k++) spots.push([path[Math.round(k * (path.length - 1) / 7)], k]);
    const off = M.shuffle([...Array(C * R).keys()].filter(c => !path.includes(c)), rnd).slice(0, 4);
    off.forEach(c => spots.push([c, Math.floor(rnd() * 8)]));
    const dots = spots.map(([c, i]) => {
      const cx = ox + (c % C) * S + S / 2, cy = oy + Math.floor(c / C) * S + S / 2;
      return `<circle cx="${cx}" cy="${cy}" r="4.6" ${colored ? `fill="${N[i].c}"` : `fill="#fff" stroke="${LINE}" stroke-width=".8"`}/>` +
        `<text x="${cx}" y="${cy + 1.35}" text-anchor="middle" font-family="'Baloo 2',sans-serif" font-weight="800" font-size="${i === 4 ? 3.3 : 3.9}" fill="${colored ? "#fff" : LINE}"${colored ? ` stroke="rgba(0,0,0,.35)" stroke-width=".35" paint-order="stroke"` : ""}>${M.syl(i)}</text>`;
    }).join("");
    const ay = oy + sy * S + S / 2, by = oy + ey * S + S / 2, ex = ox + C * S;
    return `<svg viewBox="0 0 ${ex + 12} ${R * S + oy * 2}" aria-label="Labirint">
      <path d="${s}" fill="none" stroke="${LINE}" stroke-width="1.7" stroke-linecap="round"/>
      <path d="M1 ${ay - 3}h6v-2.4l4.6 5.4-4.6 5.4v-2.4H1z" fill="${N[0].c}"/>
      <path d="M${ex + 1} ${by - 3}h6v-2.4l4.6 5.4-4.6 5.4v-2.4h-6z" fill="${N[3].c}"/>${dots}</svg>`;
  }

  /* ---------- o cutie numerotată ---------- */
  function box(k, color, title, sub, content, cls = "") {
    return `<section class="pb ${cls}" style="--bc:${color};--bt:${M.tint(color, .93)}">
      <div class="pb-h"><span class="pb-n">${k}</span><div><div class="pb-t">${title}</div><div class="pb-s">${sub}</div></div></div>
      <div class="pb-c">${content}</div></section>`;
  }
  const head = (T, title, sub, left, right) => `<header class="ph" style="--phb:${T.v.bg};--php:${T.pat.replace(/"/g, "&quot;")};--pht:${T.id === "spatiu" ? T.v.acc : T.v.hdr};--phs:${T.v.bgInk}">
      <div class="ph-chars">${left.map(i => T.draw(i, "color")).join("")}</div>
      <div class="ph-txt"><div class="ph-title">${title}</div><div class="ph-sub">${sub}</div></div>
      <div class="ph-chars right">${right.map(i => T.draw(i, "color")).join("")}</div></header>`;

  M.posterPages = (T, A, page) => {
    const rnd = M.rng(T.id + "/" + A.id + "/afis");
    const mic = A.id === "mic", mare = A.id === "mare";
    const COL = [T.v.hdr, M.shade(T.v.acc, .72), T.v.hdr2, M.shade(T.v.acc, .6)];
    const col = k => COL[k % COL.length];
    const noteFill = i => (mare ? undefined : N[i].c);
    const writeUnder = i => (mic ? { label: M.syl(i), labelColor: "#B3BED3" } : { box: true });

    /* ===== fișa mare 1 ===== */
    const scale = [0, 1, 2, 3, 4, 5, 6, 7];
    const p1 = M.staff(scale.map(i => ({ i, fill: noteFill(i), ...writeUnder(i) })), { fit: true, noHit: true, label: "Scara" });

    const order = M.shuffle(scale, rnd);
    const p2 = `<div class="cbi">
        <div class="cbi-notes">${order.map(i => `<div class="cbi-n">${hollowNote()}<b>${M.syl(i)}</b></div>`).join("")}</div>
        <div class="cbi-leg">${scale.map(i => `<div>${crayon(N[i].c)}<span>${M.syl(i)} – ${N[i].cn}</span></div>`).join("")}</div></div>`;

    const BEATS = [["w", "întreagă"], ["h", "doime"], ["hd", "doime cu punct"], ["q", "pătrime"], ["e", "două optimi"], ["s", "patru șaisprezecimi"]];
    const p3 = `<div class="beats">${BEATS.map(([k, n]) => `<div class="beat"><span class="bg">${rhythm(k)}</span><span class="bn">${n}</span><span class="bw"></span>
        <span class="bc">${[0, 1, 2, 3].map(() => `<svg viewBox="0 0 10 10"><circle class="cz" cx="5" cy="5" r="4" fill="#fff" stroke="${LINE}" stroke-width="1"/></svg>`).join("")}</span></div>`).join("")}</div>`;

    const PARTS = [["Capul", 44.6, 6.6], ["Cheițele", 47.5, 14], ["Gâtul", 43.5, 40], ["Corzile", 41.7, 66], ["Cutia de rezonanță", 61, 98]];
    const p4 = `<div class="vio"><svg viewBox="0 0 170 116" aria-label="Vioara">${violin()}
        ${PARTS.map(([, x, y], k) => { const cy = 13 + k * 22.5; return `<path d="M96 ${cy}L${x + 2} ${y}" stroke="${N[[0, 2, 3, 5, 6][k]].c}" stroke-width="1.4"/><circle cx="${x + 1.5}" cy="${y}" r="1.8" fill="${N[[0, 2, 3, 5, 6][k]].c}"/><rect x="96" y="${cy - 8}" width="70" height="16" rx="4" fill="#fff" stroke="${N[[0, 2, 3, 5, 6][k]].c}" stroke-width="1.4"/>`; }).join("")}
      </svg><div class="vio-bank">${M.shuffle(PARTS.map(p => p[0]), rnd).map(w => `<span>${w}</span>`).join("")}</div></div>`;

    const mixed = M.shuffle(scale, rnd);
    const p5 = M.staff(mixed.map(i => ({ i, fill: noteFill(i), ...(mic ? { label: M.syl(i), labelColor: "#B3BED3" } : { box: true }) })), { fit: true, noHit: true, label: "Note amestecate" });

    const p6 = `<div class="draw8">${M.shuffle(scale, rnd).map(i => `<div><b>${M.syl(i)}</b>${miniStaff([], 1, 34)}</div>`).join("")}</div>`;

    const song = M.SONGS.find(s => s.id === (mic ? "scaramica" : mare ? "oda" : "stea"));
    const mel = song.n.slice(0, 8);
    const miss = M.shuffle([2, 3, 4, 5, 6, 7], rnd).slice(0, mic ? 1 : mare ? 3 : 2);
    const p7 = `<div class="mel"><b>${song.t}</b>${M.staff(mel.map((i, k) => (miss.includes(k)
      ? { i, ghost: true, dash: true, label: M.syl(i), labelColor: INK }
      : { i, fill: noteFill(i), label: M.syl(i), labelColor: mare ? INK : N[i].cd })), { fit: true, noHit: true, label: "Melodia" })}</div>`;

    const goal = `<span class="mz-goal">${T.reward.icon}<b>Ieșire</b></span>`;
    const p8 = `<div class="mz"><span class="mz-start">${T.draw(0, "color")}<b>Start</b></span>${mazeSvg(rnd, !mare)}${goal}</div>`;

    const helper = T.chars[0].n;
    const poster1 = `<div class="poster">${head(T, "Hai să descoperim notele muzicale!", `Cu ajutorul ${T.noun.gpl}, învățăm să cunoaștem notele!`, [0, 2], [4, 7])}
      <div class="pgrid">
        ${box(1, col(0), "Citește și scrie numele notelor!", mic ? "Urmărește cu creionul numele fiecărei note." : "Privește portativul și scrie numele fiecărei note sub ea.", p1)}
        ${box(2, col(1), "Colorează după instrucțiuni!", "Colorează fiecare notă cu culoarea corectă.", p2)}
        ${box(3, col(2), "Numără timpii!", "Câți timpi are fiecare? Scrie numărul și colorează tot atâtea cerculețe.", p3)}
        ${box(4, col(3), "Recunoaște părțile viorii!", "Scrie numele fiecărei părți în căsuța ei.", p4)}
        ${box(5, col(1), "Scrie notele!", mic ? "Urmărește numele notelor amestecate." : "Notele s-au amestecat. Scrie numele fiecăreia.", p5)}
        ${box(6, col(0), "Desenează nota potrivită!", "Desenează pe fiecare portativ nota scrisă deasupra.", p6)}
        ${box(7, col(3), "Completează melodia!", `Desenează nota care lipsește din „${song.t}”.`, p7)}
        ${box(8, col(2), `${T.id === "printese" ? "Ajut-o" : "Ajută-l"} pe ${helper}!`, "Parcurge labirintul trecând prin note în ordine: Do – Re – Mi – Fa – Sol – La – Si – Do.", p8)}
      </div></div>`;

    /* ===== fișa mare 2 ===== */
    const pairs = [];
    while (pairs.length < 4) { const a = Math.floor(rnd() * 8), b = Math.floor(rnd() * 8); if (Math.abs(a - b) >= (mic ? 4 : 2)) pairs.push([a, b]); }
    const q1 = `<div class="pairs">${pairs.map(([a, b]) => miniStaff([a, b], 2, 32)).join("")}</div>`;

    const types = mare ? M.shuffle(scale, rnd).slice(0, 3).sort((a, b) => a - b) : [0, 2, 4];
    let seq;
    do { seq = Array.from({ length: 10 }, () => types[Math.floor(rnd() * 3)]); } while (types.some(t => !seq.includes(t)));
    const q2 = `<div class="count">${M.staff(seq.map(i => ({ i, fill: noteFill(i) })), { fit: true, noHit: true, gap: 48, label: "Note de numărat" })}
      <div class="count-row">${types.map(i => `<span>${mare ? "" : sw(i)}<b>${M.syl(i)}</b> = <i></i></span>`).join("")}</div></div>`;

    const inames = M.shuffle(Object.keys(INSTR), rnd);
    const q3 = `<div class="inst"><div class="inst-row">${inames.map(n => `<div>${instrSvg(n)}<i></i></div>`).join("")}</div>
      <div class="vio-bank row">${M.shuffle(inames, rnd).map(w => `<span>${w}</span>`).join("")}</div></div>`;

    const LBL = { q: "ta", e: "ti-ti", h: "ta-a" };
    const PATS = [["q", "e", "q", "e"], ["e", "e", "q", "e"], ["h", "q", "q", "h"]];
    const q4 = `<div class="rows">${PATS.map(r => `<div class="rrow">${r.map(k => `<span class="rc">${rhythm(k)}<small>${LBL[k]}</small></span>`).join("")}<span class="rc empty"></span><span class="rc empty"></span></div>`).join("")}</div>`;

    const picks = M.shuffle(scale, rnd).slice(0, 4), right = M.shuffle(picks, rnd);
    const q5 = `<div class="mini-unite">${picks.map((i, k) => `<div class="mu-row"><span class="mu-l">${T.draw(i, "line")}<b>${T.chars[i].n}</b><i class="dot"></i></span>
      <span class="mu-r"><i class="dot"></i>${miniStaff([right[k]], 1, 44)}</span></div>`).join("")}</div>`;

    const q6 = `<svg class="stairs8" viewBox="0 0 164 74" aria-label="Scara notelor">${scale.map(k => {
      const x = 3 + k * 20, h = 18 + k * 7.2, y = 72 - h;
      return `<rect class="cz" x="${x}" y="${y}" width="19" height="${h}" rx="2" fill="#fff" stroke="${LINE}" stroke-width="1.2"/>` +
        `<rect x="${x + 2.5}" y="${y + 2}" width="14" height="8" rx="2" fill="none" stroke="#8C99B3" stroke-width=".8" stroke-dasharray="2 1.5"/>` +
        (k === 0 ? `<text x="${x + 9.5}" y="${y + 8.2}" text-anchor="middle" font-family="'Baloo 2',sans-serif" font-weight="800" font-size="6" fill="${INK}">Do</text>` : "") +
        (mare ? "" : `<circle cx="${x + 9.5}" cy="${y + h - 4.5}" r="2.4" fill="${N[k].c}"/>`);
    }).join("")}</svg>`;

    const rid = [];
    const a = 1 + Math.floor(rnd() * 5); rid.push(`Stau între ${M.syl(a - 1)} și ${M.syl(a + 1)}. Cine sunt?`);
    const b = Math.floor(rnd() * 6); rid.push(`Vin imediat după ${M.syl(b)}. Cine sunt?`);
    const c = 2 + Math.floor(rnd() * 5); rid.push(`Sunt chiar înainte de ${M.syl(c)}. Cine sunt?`);
    const q7 = `<div class="rid"><ol>${rid.map(r => `<li>${r}<i></i></li>`).join("")}</ol><span class="rid-pic">${T.draw(5, "color")}</span></div>`;

    const who = Math.floor(rnd() * 8);
    const q8 = `<div class="big-char">${T.draw(who, "line")}<div><b>${T.chars[who].n}</b><span>${sw(who)}${T.hint(who)}</span></div></div>`;

    const poster2 = `<div class="poster">${head(T, "Mic muzician în acțiune!", `${cap(T.noun.pl)} te provoacă la 8 jocuri noi!`, [1, 3], [5, 6])}
      <div class="pgrid">
        ${box(1, col(0), "Care notă e mai sus?", "Încercuiește, pe fiecare portativ, nota care stă mai sus.", q1)}
        ${box(2, col(1), "Numără notele!", "Câte note de fiecare fel vezi? Scrie numărul.", q2)}
        ${box(3, col(2), "Instrumentele muzicale", "Scrie sub fiecare desen numele instrumentului, apoi colorează-l.", q3)}
        ${box(4, col(3), "Continuă ritmul!", "Bate din palme ritmul, apoi desenează ce urmează în căsuțele goale.", q4)}
        ${box(5, col(1), `Unește fiecare ${T.noun.sg} cu nota lui`.replace(" lui", T.id === "printese" ? " ei" : " lui"), "Trage o linie de la punct la punct.", q5)}
        ${box(6, col(0), "Urcă pe scara notelor!", "Scrie notele pe trepte, de la Do în sus, și colorează fiecare treaptă.", q6)}
        ${box(7, col(3), "Ghicitori muzicale", "Citește ghicitoarea și scrie nota pe linie.", q7)}
        ${box(8, col(2), `Colorează-l pe ${T.chars[who].n}!`.replace("-l pe", T.id === "printese" ? "-o pe" : "-l pe"), "Folosește culoarea notei lui.".replace("lui.", T.id === "printese" ? "ei." : "lui."), q8)}
      </div></div>`;

    return [
      page(T, A, "afis-1", "Descoperă notele (8 jocuri)", "", "", poster1, "poster-page"),
      page(T, A, "afis-2", "Mic muzician (8 jocuri)", "", "", poster2, "poster-page")
    ];
  };
})(window.M);
