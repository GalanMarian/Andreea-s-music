/* Cele 6 jocuri. Fiecare primește (el, T = lumea, A = vârsta) și întoarce, opțional, o funcție de curățenie. */
(function (M) {
  const G = M.GAMES = {}, N = M.NOTES;
  const restart = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };
  const songsOf = A => A.songs.map(id => M.SONGS.find(s => s.id === id));
  const rw = (T, n) => `+${n} ${n === 1 ? T.reward.one : T.reward.many}`;
  const style = i => `--c:${N[i].c};--cd:${N[i].cd};--cl:${N[i].cl}`;
  const card = (T, i, o = {}) =>
    `<button class="ch-card${o.plain ? " plain" : ""}" data-i="${i}" style="${style(i)}" aria-label="${M.syl(i)}${o.plain ? "" : ", " + T.chars[i].n}">` +
    `${o.plain ? "" : T.draw(i, "color")}<span class="syl">${M.syl(i)}</span>${o.name === false || o.plain ? "" : `<span class="nm">${T.chars[i].n}</span>`}</button>`;
  const crayons = (T, label) => N.map((n, i) =>
    `<button class="crayon" data-i="${i}" style="${style(i)}" aria-pressed="false" aria-label="${label} ${M.syl(i)}">${T.draw(i, "color")}<b>${M.syl(i)}</b></button>`).join("");
  const chips = (items, cur, attr = "k") => items.map((t, k) => `<button class="chip" data-${attr}="${k}" aria-pressed="${k === cur}">${t}</button>`).join("");

  /* 1 — cunoaște personajele */
  G.personaje = (el, T) => {
    let hl = -1, stop = null;
    el.innerHTML = `<div class="staff-box wide" id="st"></div>
      <div class="row mt"><button class="btn acc" id="scale">${M.ICON.play}Cântă toată scara</button></div>
      <div class="cards" id="cards">${N.map((_, i) => card(T, i)).join("")}</div>`;
    const st = el.querySelector("#st"), grid = el.querySelector("#cards");
    const draw = () => {
      st.innerHTML = M.staff(N.map((n, i) => ({ i, fill: n.c, label: M.syl(i), labelColor: n.cd, cls: hl >= 0 && hl !== i ? "faded" : "" })),
        { fit: true, label: "Scara Do Re Mi Fa Sol La Si Do" });
    };
    const hit = i => { hl = i; draw(); M.play(i); restart(grid.children[i], "on"); };
    grid.onclick = e => { const c = e.target.closest(".ch-card"); if (c) hit(+c.dataset.i); };
    st.onclick = e => { const g = e.target.closest(".head"); if (g) hit(+g.dataset.k); };
    el.querySelector("#scale").onclick = () => {
      stop && stop();
      const scale = M.SONGS.find(s => s.id === "scara");
      stop = M.playSong(scale, k => {
        hl = k < 0 ? -1 : scale.n[k]; draw();
        if (k >= 0) restart(grid.children[hl], "on");
      }, .36);
    };
    draw();
    return () => stop && stop();
  };

  /* 2 — pianul */
  G.pian = (el, T, A) => {
    const songs = songsOf(A);
    let si = Math.min(M.store.get("song-" + A.id, 0), songs.length - 1), song = songs[si];
    let pos = 0, stop = null, lock = false, help = false, mode = M.store.get("track-" + A.id, A.track);
    el.innerHTML = `<div class="chips" id="songs"></div>
      <div class="track-head"><div class="chips" id="modes"></div><button class="btn light sm" id="help" hidden></button></div>
      <div class="track" id="track"></div>
      <div class="row mt"><button class="btn light" id="listen">${M.ICON.ear}Ascultă cântecul</button><button class="btn light" id="again">De la început</button></div>
      <p class="msg" id="msg" aria-live="polite"></p>
      <div class="keys" id="keys">${N.map((n, i) => `<button class="key" data-i="${i}" style="${style(i)}" aria-label="${M.syl(i)}">${T.draw(i, "color")}<b>${M.syl(i)}</b></button>`).join("")}</div>`;
    const $ = s => el.querySelector(s), track = $("#track"), keys = $("#keys"), msg = $("#msg");
    const MODES = [["bubbles", "Bulinuțe colorate"], ["staff", "Partitură"]];
    const drawTop = () => {
      $("#songs").innerHTML = chips(songs.map(s => s.t), si);
      $("#modes").innerHTML = chips(MODES.map(m => m[1]), MODES.findIndex(m => m[0] === mode), "m");
      $("#help").hidden = mode !== "staff";
      $("#help").textContent = help ? "Ascunde ajutorul" : "Arată-mi clapa";
    };
    const drawTrack = (cur = pos) => {
      if (mode === "bubbles") {
        track.className = "track";
        track.innerHTML = song.n.map((i, k) =>
          `<div class="bub${song.b[k] >= 2 ? " long" : ""}${k < cur ? " done" : ""}${k === cur ? " cur" : ""}" style="${style(i)}">${M.syl(i)}</div>`).join("");
        const b = track.children[cur];
        if (b) track.scrollLeft = b.offsetLeft - track.clientWidth / 2 + b.clientWidth / 2;
      } else {
        track.className = "track staff-track";
        const gap = 50, start = 86;
        track.innerHTML = M.staff(song.n.map((i, k) => ({ i, fill: k < cur ? N[i].c : undefined, ring: k === cur ? "#FFC23D" : null })),
          { gap, start, noHit: true, label: "Partitura: " + song.t });
        track.scrollLeft = start + cur * gap - track.clientWidth / 2 + gap / 2;
      }
      const glow = !lock && pos < song.n.length && (mode === "bubbles" || help);
      [...keys.children].forEach((k, i) => k.classList.toggle("next", glow && song.n[pos] === i));
    };
    const press = i => {
      M.play(i);
      const k = keys.children[i]; k.classList.add("down"); setTimeout(() => k.classList.remove("down"), 140);
      if (lock || pos >= song.n.length) return;
      if (song.n[pos] === i) {
        pos++;
        if (pos === song.n.length) { msg.textContent = `Bravo! Ai cântat „${song.t}”! ${rw(T, 3)}`; M.addReward(3); setTimeout(M.party, 250); }
        else msg.textContent = pos > 2 ? "Super! Mai departe…" : "";
      } else {
        msg.textContent = mode === "staff" && !help ? "Uită-te pe portativ: pe ce linie stă nota?" : `Apasă clapa ${M.syl(song.n[pos])}, care strălucește!`;
      }
      drawTrack();
    };
    keys.addEventListener("pointerdown", e => { const k = e.target.closest(".key"); if (k) { e.preventDefault(); press(+k.dataset.i); } });
    keys.addEventListener("keydown", e => { const k = e.target.closest(".key"); if (k && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); press(+k.dataset.i); } });
    const reset = () => { stop && stop(); lock = false; pos = 0; msg.textContent = ""; drawTop(); drawTrack(); };
    $("#songs").onclick = e => { const c = e.target.closest(".chip"); if (!c) return; si = +c.dataset.k; song = songs[si]; M.store.set("song-" + A.id, si); reset(); };
    $("#modes").onclick = e => { const c = e.target.closest(".chip"); if (!c) return; mode = MODES[+c.dataset.m][0]; M.store.set("track-" + A.id, mode); drawTop(); drawTrack(); };
    $("#help").onclick = () => { help = !help; drawTop(); drawTrack(); };
    $("#again").onclick = reset;
    $("#listen").onclick = () => {
      stop && stop(); lock = true; msg.textContent = "Ascultă…";
      stop = M.playSong(song, k => { if (k < 0) { lock = false; msg.textContent = "Acum e rândul tău!"; drawTrack(); } else drawTrack(k); });
    };
    drawTop(); drawTrack();
    return () => stop && stop();
  };

  /* 3 — cine stă pe portativ */
  G.portativ = (el, T, A) => {
    let lv = Math.min(M.store.get("lv-" + A.id, 0), A.quiz.length - 1), target = -1, streak = 0, solved = false;
    el.innerHTML = `<div class="chips" id="lv"></div>
      <div class="quiz"><div><div class="staff-box" id="st"></div><div class="meter" id="meter" aria-label="Răspunsuri bune la rând"></div></div>
      <div><div class="choices" id="ch"></div><p class="msg" id="msg" aria-live="polite"></p>
      <div class="row"><button class="btn light" id="hear">${M.ICON.ear}Ascultă nota</button><button class="btn acc" id="next" hidden>Următoarea</button></div></div></div>`;
    const $ = s => el.querySelector(s), st = $("#st"), ch = $("#ch"), msg = $("#msg"), nextB = $("#next");
    const plain = () => !!A.quiz[lv].plain;
    const drawMeter = () => { $("#meter").innerHTML = Array.from({ length: 5 }, (_, k) => `<i class="${k < streak ? "on" : ""}"></i>`).join(""); };
    const drawStaff = () => { st.innerHTML = M.staff([{ i: target, fill: solved ? N[target].c : undefined }], { fit: true, start: 110, gap: 110, label: "O notă pe portativ" }); };
    const who = i => (plain() ? "nota " + M.syl(i) : T.chars[i].n);
    const round = () => {
      const pool = A.quiz[lv].pool; let t;
      do { t = pool[Math.floor(Math.random() * pool.length)]; } while (t === target && pool.length > 1);
      target = t; solved = false;
      let others = M.shuffle(pool.filter(i => i !== t));
      if (others.length < A.opts - 1) others = others.concat(N.map((_, i) => i).filter(i => i !== t && !pool.includes(i)).sort((a, b) => Math.abs(a - t) - Math.abs(b - t)));
      const opts = M.shuffle([t, ...others.slice(0, A.opts - 1)]);
      ch.className = "choices n" + opts.length;
      ch.innerHTML = opts.map(i => card(T, i, { name: false, plain: plain() })).join("");
      msg.textContent = ""; nextB.hidden = true; drawStaff();
    };
    ch.onclick = e => {
      const c = e.target.closest(".ch-card"); if (!c || solved) return;
      const i = +c.dataset.i; M.play(i);
      if (i === target) {
        solved = true; streak++; M.addReward(1); restart(c, "on");
        msg.textContent = `Da! Acolo stă ${who(i)}.`;
        if (streak >= 5) { msg.textContent = `Cinci la rând! Ești detectiv de note! ${rw(T, 2)}`; M.addReward(2); streak = 0; setTimeout(M.party, 200); }
        else setTimeout(M.happy, 250);
        drawStaff(); drawMeter(); nextB.hidden = false; nextB.focus({ preventScroll: true });
      } else {
        streak = 0; drawMeter(); M.oops(); restart(c, "shake");
        msg.textContent = `${who(i)[0].toUpperCase() + who(i).slice(1)} stă mai ${i > target ? "sus" : "jos"}. Mai încearcă!`;
      }
    };
    $("#lv").onclick = e => { const c = e.target.closest(".chip"); if (!c) return; lv = +c.dataset.k; M.store.set("lv-" + A.id, lv); streak = 0; $("#lv").innerHTML = chips(A.quiz.map(q => q.t), lv); drawMeter(); round(); };
    $("#hear").onclick = () => M.play(target);
    nextB.onclick = round;
    $("#lv").innerHTML = chips(A.quiz.map(q => q.t), lv);
    drawMeter(); round();
  };

  /* 4 — sus sau jos */
  G.susjos = (el, T, A) => {
    let a = 0, b = 0, done = false; const tm = [];
    el.innerHTML = `<div class="row"><button class="btn acc" id="hear">${M.ICON.ear}Ascultă cele două note</button><button class="btn light" id="next" hidden>Încă una</button></div>
      <div class="stairs-wrap" id="sw"><div class="stairs" id="stairs"></div><div class="walker" id="walker"></div></div>
      <div class="updown"><button class="btn up" id="up">${M.ICON.up}Sus</button><button class="btn down" id="down">${M.ICON.down}Jos</button></div>
      <p class="msg" id="msg" aria-live="polite"></p>`;
    const $ = s => el.querySelector(s), stairs = $("#stairs"), walker = $("#walker"), msg = $("#msg");
    const H = i => 34 + i * 24;
    const drawStairs = () => { stairs.innerHTML = N.map((n, i) => `<div class="step${!done && i !== a ? " hid" : ""}" style="${style(i)};height:${H(i)}px">${M.syl(i)}</div>`).join(""); };
    const place = i => { walker.style.left = (i * 12.5) + "%"; walker.style.bottom = (H(i) - 6) + "px"; walker.innerHTML = T.draw(i, "color"); };
    const listen = () => { M.play(a, 0, .8); M.play(b, .85, .9); };
    const round = () => {
      a = Math.floor(Math.random() * 8);
      do { b = Math.floor(Math.random() * 8); } while (Math.abs(a - b) < A.gap);
      done = false; msg.textContent = "Apasă „Ascultă”, apoi alege."; $("#next").hidden = true;
      drawStairs(); place(a);
    };
    const answer = up => {
      if (done) return;
      if ((b > a) === up) {
        done = true; drawStairs(); place(b); M.play(b); M.addReward(1);
        msg.textContent = `Corect! ${T.chars[a].n} a ${up ? "urcat" : "coborât"} la ${T.chars[b].n}. ${rw(T, 1)}`;
        tm.push(setTimeout(M.happy, 600));
        $("#next").hidden = false;
      } else {
        M.oops(); msg.textContent = "Hmm, mai ascultă o dată."; restart($("#sw"), "shake"); tm.push(setTimeout(listen, 700));
      }
    };
    $("#hear").onclick = listen;
    $("#next").onclick = () => { round(); listen(); };
    $("#up").onclick = () => answer(true);
    $("#down").onclick = () => answer(false);
    round();
    return () => tm.forEach(clearTimeout);
  };

  /* 5 — colorează notele pe ecran */
  G.coloreaza = (el, T, A) => {
    const pages = songsOf(A).map(s => ({ t: s.t, n: s.n.slice(0, A.colorLen) }));
    let pg = M.store.get("pg-" + A.id, 0) % pages.length, sel = null, filled = [], help = A.help, stop = null;
    el.innerHTML = `<div class="chips" id="pages"></div>
      <div class="staff-box wide" id="st"></div>
      <div class="row mt"><button class="btn light" id="help"></button><button class="btn light" id="listen">${M.ICON.ear}Ascultă</button></div>
      <p class="msg" id="msg" aria-live="polite"></p>
      <div class="crayons" id="cr">${crayons(T, "Culoarea")}</div>`;
    const $ = s => el.querySelector(s), st = $("#st"), cr = $("#cr"), msg = $("#msg");
    const draw = () => {
      st.innerHTML = M.staff(pages[pg].n.map((i, k) => ({ i, fill: filled[k] ? N[i].c : "#fff", label: help || filled[k] ? M.syl(i) : "", labelColor: N[i].cd })),
        { fit: true, label: "Portativ de colorat" });
      $("#help").textContent = help ? "Ascunde numele" : "Arată numele";
    };
    const reset = () => { filled = pages[pg].n.map(() => false); msg.textContent = sel === null ? "Alege o culoare de jos." : `Caută notele ${M.syl(sel)}.`; draw(); };
    cr.onclick = e => {
      const c = e.target.closest(".crayon"); if (!c) return;
      sel = +c.dataset.i; M.play(sel);
      [...cr.children].forEach(x => x.setAttribute("aria-pressed", x === c));
      msg.textContent = `Caută notele ${M.syl(sel)}.`;
    };
    st.onclick = e => {
      const g = e.target.closest(".head"); if (!g) return;
      const k = +g.dataset.k, i = pages[pg].n[k];
      if (filled[k]) { M.play(i); return; }
      if (sel === null) { msg.textContent = "Mai întâi alege o culoare de jos."; return; }
      if (sel === i) {
        filled[k] = true; M.play(i); draw();
        if (filled.every(Boolean)) {
          msg.textContent = `Gata! Ascultă cum sună. ${rw(T, 3)}`; M.addReward(3); M.party();
          stop && stop(); stop = M.playSong({ n: pages[pg].n, b: pages[pg].n.map(() => 1) }, null, .38);
        } else if (!pages[pg].n.some((x, j) => x === sel && !filled[j])) msg.textContent = `Toate notele ${M.syl(sel)} sunt colorate. Alege altă culoare!`;
      } else {
        M.oops(); msg.textContent = `Nota asta nu e ${M.syl(sel)}. Uită-te pe ce linie stă.`;
        const h = st.querySelectorAll(".head")[k]; h.style.transformBox = "fill-box"; restart(h, "shake");
      }
    };
    $("#pages").onclick = e => { const c = e.target.closest(".chip"); if (!c) return; pg = +c.dataset.k; M.store.set("pg-" + A.id, pg); $("#pages").innerHTML = chips(pages.map(p => p.t), pg); reset(); };
    $("#help").onclick = () => { help = !help; draw(); };
    $("#listen").onclick = () => { stop && stop(); stop = M.playSong({ n: pages[pg].n, b: pages[pg].n.map(() => 1) }, null, .42); };
    $("#pages").innerHTML = chips(pages.map(p => p.t), pg);
    reset();
    return () => stop && stop();
  };

  /* 6 — compune */
  G.compune = (el, T, A) => {
    const MAX = A.compose;
    let tune = M.store.get("tune", [0, 2, 4, 7, 4, 2, 0]).slice(0, MAX), stop = null;
    el.innerHTML = `<div class="staff-box wide" id="st"></div>
      <div class="row mt"><button class="btn acc" id="go">${M.ICON.play}Cântă</button><button class="btn light" id="undo">Șterge ultima</button><button class="btn light" id="clr">Foaie nouă</button></div>
      <p class="msg" id="msg" aria-live="polite"></p>
      <div class="crayons" id="cr">${crayons(T, "Adaugă")}</div>`;
    const $ = s => el.querySelector(s), st = $("#st"), msg = $("#msg");
    const draw = (hl = -1) => {
      st.innerHTML = M.staff(tune.map((i, k) => ({ i, fill: N[i].c, label: M.syl(i), labelColor: N[i].cd, cls: hl >= 0 && hl !== k ? "faded" : "" })),
        { fit: true, min: MAX, gap: MAX > 8 ? 46 : 58, label: "Cântecul tău" });
      M.store.set("tune", tune);
      const left = MAX - tune.length;
      msg.textContent = left <= 0 ? "Foaia e plină. Apasă Cântă!" : `Mai ai loc pentru ${left} ${left === 1 ? "notă" : "note"}.`;
    };
    $("#cr").onclick = e => { const c = e.target.closest(".crayon"); if (!c) return; const i = +c.dataset.i; M.play(i); if (tune.length < MAX) { tune.push(i); draw(); } };
    st.onclick = e => { const g = e.target.closest(".head"); if (g && tune[+g.dataset.k] !== undefined) M.play(tune[+g.dataset.k]); };
    $("#go").onclick = () => {
      if (!tune.length) return;
      stop && stop();
      stop = M.playSong({ n: tune, b: tune.map((_, k) => (k === tune.length - 1 ? 2 : 1)) }, k => {
        draw(k);
        if (k < 0 && tune.length >= 4 && !M.store.get("composed-" + T.id, false)) { M.store.set("composed-" + T.id, true); M.addReward(3); M.party(); }
      }, .45);
    };
    $("#undo").onclick = () => { tune.pop(); draw(); };
    $("#clr").onclick = () => { tune = []; draw(); };
    draw();
    return () => stop && stop();
  };
})(window.M);
