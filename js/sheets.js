/* Fișele A4 de colorat: se construiesc pe lume + vârstă, se pot colora pe ecran și se exportă în PDF
   (fereastra de tipărire a browserului → „Salvează ca PDF”). Același cod face și PDF-urile gata făcute din pdf/. */
(function (M) {
  const N = M.NOTES, PAGE_W = 793.7, PAGE_H = 1122.5; // A4 la 96 dpi

  const swatch = i => `<span class="sw" style="background:${N[i].c}"></span>`;
  const trace = (word, count) => {
    const w = 600 / count;
    let s = `<svg viewBox="0 0 600 112" width="100%" aria-hidden="true">
      <line x1="0" x2="600" y1="94" y2="94" stroke="#B9C4D8" stroke-width="2"/>
      <line x1="0" x2="600" y1="36" y2="36" stroke="#D5DDEA" stroke-width="1.5" stroke-dasharray="6 6"/>`;
    for (let k = 0; k < count; k++) {
      s += `<text x="${w * k + w / 2}" y="92" text-anchor="middle" font-family="'Baloo 2',sans-serif" font-weight="800" font-size="${count > 3 ? 74 : 86}" ` +
        (k === 0 ? `fill="#C9D2E2"` : `fill="none" stroke="#8C99B3" stroke-width="2.2" stroke-dasharray="5 5"`) + `>${word}</text>`;
    }
    return s + `</svg>`;
  };
  const star = `<svg viewBox="0 0 40 40" aria-hidden="true"><path class="cz" d="M20 3l4.6 10 10.9 1.3-8 7.5 2.1 10.8L20 27.3l-9.6 5.3 2.1-10.8-8-7.5 10.9-1.3z" fill="#fff" stroke="#2A2A35" stroke-width="1.8" stroke-linejoin="round"/></svg>`;

  function page(T, A, id, label, heading, hint, body, cls = "") {
    return {
      id, label,
      html: `<article class="page ${cls}" data-id="${id}" style="--pc:${T.v.hdr};--pa:${T.v.acc}">
        <header class="pg-head"><span class="pg-brand">${T.name} Do-Re-Mi</span><span class="pg-name">Nume:<i></i></span></header>
        ${heading ? `<h3 class="pg-title">${heading}</h3>` : ""}${hint ? `<p class="pg-hint">${hint}</p>` : ""}
        <div class="pg-body">${body}</div>
        <footer class="pg-foot">Muzica Andreei · ${T.name} · ${A.label}</footer>
      </article>`
    };
  }

  /* Toate fișele pentru o lume și o vârstă, mereu în aceeași ordine. */
  M.buildPages = (T, A) => {
    const pages = [], rnd = M.rng(T.id + "/" + A.id), small = A.id === "mic";

    pages.push(page(T, A, "diploma", "Diplomă", "", "", `<div class="dip">
      <div class="dip-stars">${star}${star}${star}</div>
      <div class="dip-title">Diplomă de mic muzician</div>
      <div class="dip-line">Se acordă lui / ei<span></span></div>
      <p class="dip-text">pentru că știe notele<br><b>Do · Re · Mi · Fa · Sol · La · Si · Do</b></p>
      <div class="dip-chars">${[0, 2, 4, 7].map(i => T.draw(i, "line")).join("")}</div>
      <div class="dip-sign"><div>Data<span></span></div><div>Semnătura<span></span></div></div></div>`, "dip-page"));

    N.forEach((n, i) => {
      pages.push(page(T, A, "portret-" + i, `${T.chars[i].n} · ${M.syl(i)}`, `Eu sunt ${T.chars[i].n}!`, `Nota mea e <b>${M.syl(i)}</b>. ${T.hint(i)}`,
        `<div class="por">
          <div class="por-pic">${T.draw(i, "line")}</div>
          <div class="por-side">
            <div class="por-color">${swatch(i)}<span>${n.cn}</span></div>
            <div class="por-staff">${M.staff([{ i, cz: true }], { fit: true, start: 96, gap: 84, noHit: true, label: "Nota " + M.syl(i) })}<small>Aici stau eu pe portativ. Colorează și nota!</small></div>
          </div>
          <div class="trace"><span>Scrie nota mea:</span>${trace(M.syl(i), small ? 3 : 4)}</div>
        </div>`));
    });

    const legend = `<div class="legend${small ? " big" : ""}">${N.map((n, i) =>
      `<div class="lg">${small ? `<span class="lg-pic">${T.draw(i, "color")}</span>` : swatch(i)}<b>${M.syl(i)}</b><small>${n.cn}</small></div>`).join("")}</div>`;
    A.sheets.colorSongs.forEach((group, p) => {
      const len = small ? 6 : A.colorLen;
      const rows = group.map(id => {
        const s = M.SONGS.find(x => x.id === id);
        const notes = s.n.slice(0, len).map(i => ({ i, cz: true, label: A.sheets.write ? "" : M.syl(i), box: A.sheets.write }));
        return `<div class="song-row"><h4>${s.t}</h4>${M.staff(notes, { fit: true, noHit: true, label: s.t })}</div>`;
      }).join("");
      pages.push(page(T, A, "note-" + p, `Colorează notele ${p + 1}`, "Colorează notele cântecelor",
        A.sheets.write ? "Scrie numele fiecărei note în căsuță, apoi colorează nota cu culoarea ei." : "Fiecare notă are culoarea ei. Uită-te la nume și colorează nota.",
        legend + `<div class="songs-col">${rows}</div>`));
    });

    A.sheets.unite.forEach((picks, p) => {
      const right = M.shuffle(picks, rnd);
      pages.push(page(T, A, "uneste-" + p, `Unește ${p + 1}`, `Unește fiecare ${T.noun.sg} cu nota potrivită`,
        "Trage o linie de la punct la punct. Apoi colorează-i cu culoarea notei.",
        `<div class="unite">${picks.map((i, k) => `<div class="u-row">
          <div class="u-l">${T.draw(i, "line")}<b>${T.chars[i].n}<small>${M.syl(i)}</small></b><span class="dot"></span></div>
          <div class="u-r"><span class="dot"></span>${M.staff([{ i: right[k] }], { fit: true, start: 96, gap: 84, noHit: true, label: "O notă" })}</div>
        </div>`).join("")}</div>`));
    });

    if (A.sheets.write) {
      const staves = [0, 1, 2].map(() => {
        const notes = Array.from({ length: 8 }, () => ({ i: Math.floor(rnd() * 8), box: true }));
        return `<div class="song-row">${M.staff(notes, { fit: true, noHit: true, label: "Note de citit" })}</div>`;
      }).join("");
      pages.push(page(T, A, "scrie", "Scrie notele", "Cum se numesc notele?", "Scrie numele fiecărei note în căsuța de dedesubt.", `<div class="songs-col">${staves}</div>`));
      const draws = [0, 1, 2].map(() => {
        const notes = M.shuffle([0, 1, 2, 3, 4, 5, 6, 7], rnd).slice(0, 6).map(i => ({ i, ghost: true, label: M.syl(i), labelColor: "#1B2A4A" }));
        return `<div class="song-row">${M.staff(notes, { fit: true, noHit: true, label: "Portativ gol" })}</div>`;
      }).join("");
      pages.push(page(T, A, "deseneaza", "Desenează notele", "Desenează notele pe portativ", "Deasupra fiecărui nume, desenează nota pe linia sau în spațiul ei.", `<div class="songs-col">${draws}</div>`));
    }
    return pages;
  };

  /* ---------- culorile puse pe ecran, ținute în browser pe fiecare fișă ---------- */
  const fillKey = (T, A) => `fill-${T.id}-${A.id}`;
  const applyFills = (pageEl, fills) => {
    [...pageEl.querySelectorAll(".cz")].forEach((z, k) => { if (fills && fills[k]) z.setAttribute("fill", fills[k]); });
  };
  const fitPage = scaler => {
    const pg = scaler.firstElementChild; if (!pg) return;
    const s = scaler.clientWidth / PAGE_W;
    pg.style.transform = `scale(${s})`;
    scaler.style.height = PAGE_H * s + "px";
  };

  M.printPages = (pages, fills) => {
    const pa = document.getElementById("printArea");
    pa.innerHTML = pages.map(p => p.html).join("");
    [...pa.querySelectorAll(".page")].forEach(pg => applyFills(pg, (fills || {})[pg.dataset.id]));
    const ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    ready.then(() => setTimeout(() => window.print(), 200));
  };
  window.addEventListener("afterprint", () => {
    if (!document.body.classList.contains("print-mode")) document.getElementById("printArea").innerHTML = "";
  });
  M.renderPrintAll = (T, A) => {
    document.getElementById("printArea").innerHTML = M.buildPages(T, A).map(p => p.html).join("");
  };

  const EXTRA = [
    { c: "#F6CFB0", t: "piele" }, { c: "#8B5A2B", t: "maro" }, { c: "#FFE7A8", t: "crem" },
    { c: "#B8C1D1", t: "gri" }, { c: "#2A2A35", t: "negru" }, { c: "#FFFFFF", t: "gumă" }
  ];

  /* 7 — galeria de fișe + colorare pe ecran */
  M.GAMES.fise = (el, T, A) => {
    const pages = M.buildPages(T, A);
    const fills = M.store.get(fillKey(T, A), {});
    let chosen = new Set(pages.map(p => p.id)), open = null, color = N[0].c, ro = null;
    const save = () => M.store.set(fillKey(T, A), fills);

    const gallery = () => {
      open = null;
      el.innerHTML = `<div class="row">
          <button class="btn acc" id="pdf">${M.ICON.pdf}<span>Exportă PDF (<span id="cnt"></span>)</span></button>
          <button class="btn light" id="all"></button>
          <a class="btn light" href="pdf/${T.id}-${A.id}.pdf" target="_blank" rel="noopener">PDF gata făcut</a>
        </div>
        <p class="tip">Apasă pe o fișă ca s-o colorezi pe ecran. La export, în fereastra de tipărire alege <b>Salvează ca PDF</b> sau trimite direct la imprimantă.</p>
        <div class="thumbs" id="thumbs">${pages.map((p, k) => `<div class="thumb">
          <button class="thumb-open" data-k="${k}" aria-label="Colorează: ${p.label}"><div class="scaler">${p.html}</div></button>
          <label class="thumb-pick"><input type="checkbox" id="pick-${p.id}" data-id="${p.id}" ${chosen.has(p.id) ? "checked" : ""}><span>${k + 1}. ${p.label}</span></label>
        </div>`).join("")}</div>`;
      const thumbs = el.querySelector("#thumbs");
      thumbs.querySelectorAll(".page").forEach(pg => applyFills(pg, fills[pg.dataset.id]));
      const sync = () => {
        el.querySelector("#cnt").textContent = chosen.size + (chosen.size === 1 ? " fișă" : " fișe");
        el.querySelector("#all").textContent = chosen.size === pages.length ? "Deselectează tot" : "Selectează tot";
      };
      thumbs.onchange = e => { const c = e.target.closest("input"); if (!c) return; c.checked ? chosen.add(c.dataset.id) : chosen.delete(c.dataset.id); sync(); };
      thumbs.onclick = e => { const b = e.target.closest(".thumb-open"); if (b) editor(+b.dataset.k); };
      el.querySelector("#all").onclick = () => {
        chosen = chosen.size === pages.length ? new Set() : new Set(pages.map(p => p.id));
        thumbs.querySelectorAll("input").forEach(c => { c.checked = chosen.has(c.dataset.id); });
        sync();
      };
      el.querySelector("#pdf").onclick = () => { if (chosen.size) M.printPages(pages.filter(p => chosen.has(p.id)), fills); };
      sync();
      watch(thumbs);
    };

    const editor = k => {
      open = k; const p = pages[k];
      el.innerHTML = `<div class="row">
          <button class="btn light" id="back">← Toate fișele</button>
          <button class="btn light" id="prev" ${k === 0 ? "disabled" : ""}>‹</button>
          <button class="btn light" id="nextp" ${k === pages.length - 1 ? "disabled" : ""}>›</button>
          <button class="btn light" id="clear">Șterge culorile</button>
          <button class="btn acc" id="pdf1">${M.ICON.pdf}Exportă fișa asta</button>
        </div>
        <div class="palette" id="pal">${N.map((n, i) => `<button class="pal" data-c="${n.c}" style="--c:${n.c}" aria-label="${M.syl(i)}, ${n.cn}"><span>${M.syl(i)}</span></button>`).join("")}${EXTRA.map(x => `<button class="pal${x.t === "gumă" ? " eraser" : ""}" data-c="${x.c}" style="--c:${x.c}" aria-label="${x.t}"><span>${x.t}</span></button>`).join("")}</div>
        <div class="editor"><div class="scaler" id="ed">${p.html}</div></div>`;
      const ed = el.querySelector("#ed"), pageEl = ed.firstElementChild, pal = el.querySelector("#pal");
      applyFills(pageEl, fills[p.id]);
      const mark = () => pal.querySelectorAll(".pal").forEach(b => b.setAttribute("aria-pressed", b.dataset.c === color));
      pal.onclick = e => { const b = e.target.closest(".pal"); if (b) { color = b.dataset.c; mark(); } };
      ed.onclick = e => {
        const z = e.target.closest(".cz"); if (!z) return;
        const idx = [...pageEl.querySelectorAll(".cz")].indexOf(z);
        fills[p.id] = fills[p.id] || {};
        if (color === "#FFFFFF") { delete fills[p.id][idx]; z.setAttribute("fill", "#fff"); }
        else { fills[p.id][idx] = color; z.setAttribute("fill", color); }
        save();
      };
      el.querySelector("#back").onclick = gallery;
      el.querySelector("#prev").onclick = () => editor(k - 1);
      el.querySelector("#nextp").onclick = () => editor(k + 1);
      el.querySelector("#clear").onclick = () => { delete fills[p.id]; save(); editor(k); };
      el.querySelector("#pdf1").onclick = () => M.printPages([p], fills);
      mark();
      watch(el.querySelector(".editor"));
    };

    const watch = root => {
      const run = () => root.querySelectorAll(".scaler").forEach(fitPage);
      if (ro) ro.disconnect();
      if (window.ResizeObserver) { ro = new ResizeObserver(run); ro.observe(root); }
      run();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(run);
    };

    gallery();
    return () => { if (ro) ro.disconnect(); };
  };
})(window.M);
