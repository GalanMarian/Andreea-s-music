/* Cele 5 lumi. Fiecare are 8 personaje (unul pe notă), culorile ei, modelul de fundal, instrumentul și recompensa.
   Toate personajele sunt desenate aici, original. Fiecare desen are două moduri:
   "color" pentru jocuri și "line" (contur alb-negru, cu zone de colorat .cz) pentru fișele de colorat. */
(function (M) {
  const INK = "#1B2A4A", LINE = "#2A2A35", N = M.NOTES;

  function painter(mode) {
    const L = mode === "line";
    const zone = `fill="#fff" stroke="${LINE}" stroke-width="2.2" stroke-linejoin="round" class="cz"`;
    return {
      L,
      f: c => (L ? zone : `fill="${c}"`),
      fo: (c, o) => (L ? zone : `fill="${c}" stroke="${o}" stroke-width="2"`),
      k: () => `fill="${L ? LINE : INK}"`,
      st: (c, w = 2.4) => `stroke="${L ? LINE : c}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"`
    };
  }
  const svg = (inner, extra) => `<svg viewBox="0 0 120 120" ${extra || ""} aria-hidden="true">${inner}</svg>`;
  const eyes = (P, x1, x2, y, rx = 5.5, ry = 6.5) => [x1, x2].map(x =>
    `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" ${P.k()}/><circle cx="${x + rx * .33}" cy="${y - ry * .37}" r="${rx * .36}" fill="#fff"/>`).join("");
  const blush = (P, x1, x2, y) => (P.L ? "" :
    `<circle cx="${x1}" cy="${y}" r="4.5" fill="#FF8FA3" opacity=".55"/><circle cx="${x2}" cy="${y}" r="4.5" fill="#FF8FA3" opacity=".55"/>`);
  function badge(P, i, cx, cy, r) {
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff"${P.L ? ` stroke="${LINE}" stroke-width="1.8"` : ""}/>` +
      `<text x="${cx}" y="${cy + r * .37}" text-anchor="middle" font-family="'Baloo 2',sans-serif" font-weight="800" font-size="${(i === 4 ? .86 : 1.04) * r}" fill="${P.L ? LINE : N[i].cd}">${N[i].s}</text>`;
  }

  /* ---------- 1. Cățeii salvatori ---------- */
  const PUPS = [
    { n: "Dino", fur: "#C07A3C", mz: "#F6DDBA", ear: "#7D4820", ears: "flop" },
    { n: "Rex",  fur: "#E9C79A", mz: "#FFF4E2", ear: "#B98552", ears: "up" },
    { n: "Mimi", fur: "#FFFFFF", mz: "#FFFFFF", ear: "#9AA3B5", ears: "flop", spot: true, white: true },
    { n: "Fifi", fur: "#A9A9B8", mz: "#E9E9F0", ear: "#6E6F82", ears: "up" },
    { n: "Solo", fur: "#8A5A3B", mz: "#E8C9A5", ear: "#4E2F1C", ears: "flop" },
    { n: "Lala", fur: "#F0D8B0", mz: "#FFFFFF", ear: "#C9A26E", ears: "flop" },
    { n: "Sisi", fur: "#3B3B48", mz: "#D9D4CC", ear: "#24242E", ears: "up" },
    { n: "Dodo", fur: "#D99A5B", mz: "#FFEBD3", ear: "#9C5E2C", ears: "up" }
  ];
  function drawPup(i, mode, extra) {
    const P = painter(mode), ch = PUPS[i], n = N[i];
    const skin = c => (ch.white ? P.fo(c, "#C9D2E2") : P.f(c));
    const ears = ch.ears === "flop"
      ? `<ellipse cx="27" cy="72" rx="13" ry="25" transform="rotate(18 27 72)" ${P.f(ch.ear)}/><ellipse cx="93" cy="72" rx="13" ry="25" transform="rotate(-18 93 72)" ${P.f(ch.ear)}/>`
      : `<path d="M30 58L20 20L54 44Z" ${P.f(ch.ear)}/><path d="M90 58L100 20L66 44Z" ${P.f(ch.ear)}/>`;
    return svg(`${ears}
      <circle cx="60" cy="70" r="34" ${skin(ch.fur)}/>
      ${ch.spot ? `<ellipse cx="75" cy="64" rx="11" ry="10" ${P.f("#C3CAD8")}/>` : ""}
      <ellipse cx="60" cy="86" rx="19" ry="14" ${skin(ch.mz)}/>
      ${eyes(P, 47, 73, 68)}${blush(P, 39, 81, 81)}
      <ellipse cx="60" cy="80" rx="6.5" ry="4.6" ${P.k()}/>
      <path d="M60 84v4M52.5 88q7.5 6.5 15 0" ${P.st(INK)}/>
      <path d="M27 56Q27 20 60 20Q93 20 93 56Z" ${P.f(n.c)}/>
      <rect x="20" y="51" width="80" height="10" rx="5" ${P.f(n.cd)}/>
      ${badge(P, i, 60, 38, 12.5)}`, extra);
  }

  /* ---------- 2. Prințesele modei ---------- */
  const PRINC = [
    { n: "Doina",   hair: "#F3CF62", skin: "#F9D9C3" },
    { n: "Renata",  hair: "#7A4A26", skin: "#E7B48F" },
    { n: "Mira",    hair: "#2B2733", skin: "#C98B62" },
    { n: "Fabiola", hair: "#D8643A", skin: "#FADCC8" },
    { n: "Solange", hair: "#3A2A22", skin: "#8E5A3C" },
    { n: "Larisa",  hair: "#F6E3A1", skin: "#F6D3BC" },
    { n: "Silvia",  hair: "#5B3A29", skin: "#EFC3A0" },
    { n: "Dorina",  hair: "#F09CC0", skin: "#F9DCC6" }
  ];
  function drawPrincess(i, mode, extra) {
    const P = painter(mode), ch = PRINC[i], n = N[i];
    return svg(`
      <path d="M24 116Q16 72 30 46Q42 24 60 24Q78 24 90 46Q104 72 96 116Z" ${P.f(ch.hair)}/>
      <path d="M26 120Q30 98 60 98Q90 98 94 120Z" ${P.f(n.c)}/>
      <rect x="53" y="84" width="14" height="16" ${P.f(ch.skin)}/>
      <path d="M44 98Q60 107 76 98" ${P.st(n.cd, 2.4)}/>
      <ellipse cx="60" cy="66" rx="25" ry="27" ${P.f(ch.skin)}/>
      <path d="M35 66Q32 38 60 36Q88 38 85 66Q82 52 70 46Q64 54 48 52Q40 56 35 66Z" ${P.f(ch.hair)}/>
      <path d="M42 38L40 18L50 27L60 12L70 27L80 18L78 38Z" ${P.f(n.c)}/>
      <circle cx="60" cy="29" r="4" ${P.f("#fff")}/>
      ${eyes(P, 50, 70, 68, 4.6, 5.6)}
      <path d="M45 59.5q5-3.2 10 0M65 59.5q5-3.2 10 0" ${P.st(INK, 2)}/>
      ${blush(P, 43, 77, 78)}
      <path d="M53 81q7 6 14 0" ${P.st(INK)}/>
      ${badge(P, i, 60, 110, 8.5)}`, extra);
  }

  /* ---------- 3. Dinozaurii ---------- */
  const DINOS = [
    { n: "Dorel", belly: "#FFF0C2" },
    { n: "Rexi",  belly: "#FFE6C4", teeth: true },
    { n: "Milo",  belly: "#FFF6D6" },
    { n: "Fabi",  belly: "#F2FFD9" },
    { n: "Soli",  belly: "#E4FBFF", teeth: true },
    { n: "Lazi",  belly: "#E6EEFF" },
    { n: "Sisu",  belly: "#F3E6FF", teeth: true },
    { n: "Doru",  belly: "#FFE3F0" }
  ];
  function drawDino(i, mode, extra) {
    const P = painter(mode), ch = DINOS[i], n = N[i];
    return svg(`
      <path d="M28 120Q28 94 60 94Q92 94 92 120Z" ${P.f(n.c)}/>
      <path d="M45 120Q45 102 60 102Q75 102 75 120Z" ${P.f(ch.belly)}/>
      <path d="M36 48L36 26L50 38ZM50 36L60 12L70 36ZM70 38L84 26L84 48Z" ${P.f(n.cd)}/>
      <ellipse cx="60" cy="64" rx="35" ry="31" ${P.f(n.c)}/>
      ${P.L ? "" : `<circle cx="33" cy="62" r="4" fill="${n.cd}" opacity=".5"/><circle cx="88" cy="56" r="5" fill="${n.cd}" opacity=".5"/><circle cx="84" cy="70" r="3" fill="${n.cd}" opacity=".5"/>`}
      <ellipse cx="60" cy="80" rx="25" ry="14.5" ${P.f(ch.belly)}/>
      <circle cx="44" cy="56" r="10" ${P.f("#fff")}/><circle cx="76" cy="56" r="10" ${P.f("#fff")}/>
      <circle cx="46" cy="57.5" r="5" ${P.k()}/><circle cx="78" cy="57.5" r="5" ${P.k()}/>
      <circle cx="47.6" cy="55.4" r="1.8" fill="#fff"/><circle cx="79.6" cy="55.4" r="1.8" fill="#fff"/>
      <circle cx="53" cy="75" r="2.2" ${P.k()}/><circle cx="67" cy="75" r="2.2" ${P.k()}/>
      <path d="M45 84Q60 95 75 84" ${P.st(INK)}/>
      ${ch.teeth ? `<path d="M50 87.6l2.4 4 2.2-3.2ZM65.4 88.4l2.2 3.2 2.4-4Z" fill="#fff" stroke="${P.L ? LINE : "#C9CED9"}" stroke-width="1.4" stroke-linejoin="round"/>` : ""}
      ${blush(P, 36, 84, 76)}
      ${badge(P, i, 60, 111, 8.5)}`, extra);
  }

  /* ---------- 4. Extratereștrii din spațiu ---------- */
  const ALIENS = [
    { n: "Doxi", e: 2 }, { n: "Rebo", e: 1 }, { n: "Mipo", e: 3 }, { n: "Fazo", e: 2 },
    { n: "Solix", e: 1 }, { n: "Lazo", e: 2 }, { n: "Sirius", e: 3 }, { n: "Dorado", e: 2 }
  ];
  function drawAlien(i, mode, extra) {
    const P = painter(mode), ch = ALIENS[i], n = N[i], L = P.L;
    const ex = ch.e === 1 ? [[60, 58, 10]] : ch.e === 2 ? [[48, 58, 7.5], [72, 58, 7.5]] : [[44, 61, 6], [60, 52, 6.5], [76, 61, 6]];
    const eyesS = ex.map(([x, y, r]) =>
      `<circle cx="${x}" cy="${y}" r="${r}" ${P.f("#fff")}/><circle cx="${x + r * .15}" cy="${y + r * .12}" r="${r * .55}" ${P.k()}/><circle cx="${x + r * .35}" cy="${y - r * .2}" r="${r * .2}" fill="#fff"/>`).join("");
    return svg(`
      <path d="M24 120Q26 96 60 96Q94 96 96 120Z" ${P.f("#E9EEF7")}/>
      <path d="M40 120V105M80 120V105" ${P.st(L ? LINE : "#B9C3D6", 2)}/>
      <path d="M47 40L40 20M73 40L80 20" ${P.st(n.cd, 3)}/>
      <circle cx="40" cy="18" r="5.5" ${P.f(n.cd)}/><circle cx="80" cy="18" r="5.5" ${P.f(n.cd)}/>
      <ellipse cx="60" cy="64" rx="31" ry="28" ${P.f(n.c)}/>
      ${L ? "" : `<ellipse cx="60" cy="47" rx="16" ry="5" fill="#fff" opacity=".2"/>`}
      ${eyesS}
      ${blush(P, 39, 81, 75)}
      <path d="M51 80q9 8 18 0" ${P.st(INK)}/>
      <circle cx="60" cy="62" r="45" ${L ? `fill="none" stroke="${LINE}" stroke-width="2"` : `fill="#CDEFFF" fill-opacity=".2" stroke="#A8DDF6" stroke-width="3"`} pointer-events="none"/>
      ${L ? "" : `<path d="M28 44Q36 28 50 22" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".75"/>`}
      ${badge(P, i, 60, 110, 8.5)}`, extra);
  }

  /* ---------- 5. Unicornii ---------- */
  const UNIS = [
    { n: "Dolly", coat: "#FFFFFF" }, { n: "Rebeca", coat: "#FFF4E4" }, { n: "Miere", coat: "#FFF1C7" }, { n: "Fani", coat: "#EAFBF1" },
    { n: "Solara", coat: "#FFFFFF" }, { n: "Lavanda", coat: "#F3EBFF" }, { n: "Sidef", coat: "#FFEFF6" }, { n: "Dodi", coat: "#F2F5FF" }
  ];
  function drawUnicorn(i, mode, extra) {
    const P = painter(mode), ch = UNIS[i], n = N[i], L = P.L;
    const coat = P.fo(ch.coat, "#D6DBEA");
    return svg(`
      <path d="M30 72Q20 44 40 30Q60 18 80 30Q100 44 92 74Q98 94 86 104L34 104Q22 94 30 72Z" ${P.f(n.c)}/>
      <path d="M34 120Q36 98 60 96Q84 98 86 120Z" ${coat}/>
      <path d="M41 44L37 18L53 34Z" ${coat}/><path d="M79 44L83 18L67 34Z" ${coat}/>
      <ellipse cx="60" cy="66" rx="25" ry="29" ${coat}/>
      <path d="M54 40L60 8L66 40Z" ${P.f("#FFD54A")}/>
      <path d="M55.6 32l8.8-3M56.8 24.4l6.6-2.3M58.2 17l3.6-1.3" ${P.st(L ? LINE : "#E0A91C", 1.8)}/>
      <path d="M40 52Q42 33 62 35Q73 37 77 46Q66 41 60 47Q52 43 40 52Z" ${P.f(n.cd)}/>
      ${eyes(P, 50, 70, 65, 4.8, 5.8)}
      <path d="M45 56.5q5-3 10 0M65 56.5q5-3 10 0" ${P.st(INK, 2)}/>
      <ellipse cx="60" cy="84" rx="16" ry="11.5" ${P.f("#FFD9E6")}/>
      <circle cx="54.5" cy="83" r="2" ${P.k()}/><circle cx="65.5" cy="83" r="2" ${P.k()}/>
      <path d="M55 89.5q5 3.5 10 0" ${P.st(INK, 2)}/>
      ${blush(P, 40, 80, 75)}
      ${badge(P, i, 60, 110, 8.5)}`, extra);
  }

  /* ---------- modele de fundal și recompense ---------- */
  const pat = (inner, color) => `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'><g fill='${color}'>${inner}</g></svg>`)}")`;
  const PAW = `<ellipse cx='30' cy='38' rx='9' ry='7'/><circle cx='19' cy='26' r='4'/><circle cx='27' cy='21' r='4'/><circle cx='36' cy='22' r='4'/><circle cx='42' cy='29' r='4'/>`;
  const PATTERNS = {
    paw: PAW + `<g transform='translate(58 56) rotate(20)'>${PAW}</g>`,
    crown: `<path d='M14 42l4-16 8 9 7-14 7 14 8-9 4 16z'/><path d='M84 98c-11-8-11-17-4-17 3 0 4 3 4 4 0-1 1-4 4-4 7 0 7 9-4 17z'/>`,
    foot: `<g transform='translate(18 18)'><ellipse cx='12' cy='24' rx='9' ry='8'/><ellipse cx='2' cy='9' rx='3.2' ry='6.5' transform='rotate(-25 2 9)'/><ellipse cx='12' cy='5' rx='3.2' ry='6.5'/><ellipse cx='22' cy='9' rx='3.2' ry='6.5' transform='rotate(25 22 9)'/></g><g transform='translate(70 64) rotate(25)'><ellipse cx='12' cy='24' rx='9' ry='8'/><ellipse cx='2' cy='9' rx='3.2' ry='6.5' transform='rotate(-25 2 9)'/><ellipse cx='12' cy='5' rx='3.2' ry='6.5'/><ellipse cx='22' cy='9' rx='3.2' ry='6.5' transform='rotate(25 22 9)'/></g>`,
    stars: `<path d='M30 16l3 9 9 3-9 3-3 9-3-9-9-3 9-3z'/><circle cx='88' cy='28' r='2'/><circle cx='68' cy='92' r='2.5'/><circle cx='18' cy='96' r='1.6'/><circle cx='104' cy='104' r='1.4'/><path d='M92 70l2 6 6 2-6 2-2 6-2-6-6-2 6-2z'/>`,
    rainbow: `<path d='M12 52a22 22 0 0 1 44 0h-8a14 14 0 0 0-28 0z'/><path d='M86 100c-10-7-10-15-4-15 3 0 4 3 4 4 0-1 1-4 4-4 6 0 6 8-4 15z'/><path d='M92 24l2 6 6 2-6 2-2 6-2-6-6-2 6-2z'/>`
  };
  const REWARD = {
    bone: `<svg viewBox="0 0 40 24" aria-hidden="true"><path fill="#E9D3A6" stroke="#B48A47" stroke-width="2" d="M8 4a5 5 0 0 1 6 4h12a5 5 0 1 1 6 4 5 5 0 1 1-6 4H14a5 5 0 1 1-6-4 5 5 0 0 1 0-8z"/></svg>`,
    gem: `<svg viewBox="0 0 40 28" aria-hidden="true"><path d="M10 3h20l7 8-17 15L3 11z" fill="#B8EEFF" stroke="#3FA7CF" stroke-width="2" stroke-linejoin="round"/><path d="M3 11h34M15 3l-3 8 8 15 8-15-3-8" fill="none" stroke="#3FA7CF" stroke-width="1.6"/></svg>`,
    egg: `<svg viewBox="0 0 40 28" aria-hidden="true"><ellipse cx="20" cy="15" rx="10" ry="12.5" fill="#FFF3D6" stroke="#D9A85B" stroke-width="2"/><circle cx="16" cy="12" r="2.4" fill="#8BC97A"/><circle cx="23" cy="19" r="3" fill="#8BC97A"/></svg>`,
    star: `<svg viewBox="0 0 40 28" aria-hidden="true"><path d="M20 2l3.6 7.6 8.4 1-6.2 5.8 1.6 8.3L20 20.6l-7.4 4.1 1.6-8.3L8 10.6l8.4-1z" fill="#FFD84D" stroke="#D9A815" stroke-width="2" stroke-linejoin="round"/></svg>`,
    rainbow: `<svg viewBox="0 0 40 28" aria-hidden="true"><path d="M4 25a16 16 0 0 1 32 0" fill="none" stroke="#FF6B8A" stroke-width="4"/><path d="M9 25a11 11 0 0 1 22 0" fill="none" stroke="#FFD84D" stroke-width="4"/><path d="M14 25a6 6 0 0 1 12 0" fill="none" stroke="#5AC8FA" stroke-width="4"/></svg>`
  };

  M.THEMES = [
    {
      id: "catei", nr: 1, name: "Cățeii", tag: "salvatori", voice: "xilofon", draw: drawPup, chars: PUPS,
      noun: { sg: "cățel", pl: "cățeii", gpl: "cățeilor", fav: "cățeii tăi preferați" },
      hint: i => `Colorează-mi casca cu ${N[i].cn}.`,
      reward: { one: "oscior", many: "oscioare", icon: REWARD.bone },
      v: { bg: "#D8ECFF", bgInk: "#1B2A4A", hdr: "#20376B", hdr2: "#2E4C8C", hdrInk: "#DCE7FF", acc: "#FFC23D", accSh: "#C98F12", accInk: "#1B2A4A", paperSh: "#B5CDEA" },
      pat: pat(PATTERNS.paw, "#C4DEF7")
    },
    {
      id: "printese", nr: 2, name: "Prințesele", tag: "la modă", voice: "cutie", draw: drawPrincess, chars: PRINC,
      noun: { sg: "prințesă", pl: "prințesele", gpl: "prințeselor", fav: "prințesele tale preferate" },
      hint: i => `Colorează-mi coroana și rochița cu ${N[i].cn}.`,
      reward: { one: "diamant", many: "diamante", icon: REWARD.gem },
      v: { bg: "#FFE4F2", bgInk: "#4A1033", hdr: "#B3166F", hdr2: "#CC3A8A", hdrInk: "#FFE3F2", acc: "#FFD84D", accSh: "#C9A215", accInk: "#4A1033", paperSh: "#F2B6D4" },
      pat: pat(PATTERNS.crown, "#FBCDE4")
    },
    {
      id: "dinozauri", nr: 3, name: "Dinozaurii", tag: "din junglă", voice: "marimba", draw: drawDino, chars: DINOS,
      noun: { sg: "dinozaur", pl: "dinozaurii", gpl: "dinozaurilor", fav: "dinozaurii tăi preferați" },
      hint: i => `Colorează-mă cu ${N[i].cn}.`,
      reward: { one: "ou", many: "ouă", icon: REWARD.egg },
      v: { bg: "#E6F4D7", bgInk: "#22341F", hdr: "#2E5A2B", hdr2: "#44773D", hdrInk: "#E2F3D2", acc: "#F6A93B", accSh: "#BF7A17", accInk: "#22341F", paperSh: "#BFDDA5" },
      pat: pat(PATTERNS.foot, "#D2E9BC")
    },
    {
      id: "spatiu", nr: 4, name: "Extratereștrii", tag: "din spațiu", voice: "sintetizator", draw: drawAlien, chars: ALIENS,
      noun: { sg: "extraterestru", pl: "extratereștrii", gpl: "extratereștrilor", fav: "extratereștrii tăi preferați" },
      hint: i => `Colorează-mă cu ${N[i].cn}. Costumul meu e alb.`,
      reward: { one: "stea", many: "stele", icon: REWARD.star },
      v: { bg: "#1C2150", bgInk: "#FFFFFF", hdr: "#0C0F30", hdr2: "#262C66", hdrInk: "#CFD6FF", acc: "#6FE7F7", accSh: "#2BA9BB", accInk: "#0C0F30", paperSh: "#0B0E2B" },
      pat: pat(PATTERNS.stars, "#3C447F")
    },
    {
      id: "unicorni", nr: 5, name: "Unicornii", tag: "din curcubeu", voice: "clopotei", draw: drawUnicorn, chars: UNIS,
      noun: { sg: "unicorn", pl: "unicornii", gpl: "unicornilor", fav: "unicornii tăi preferați" },
      hint: i => `Colorează-mi coama cu ${N[i].cn}.`,
      reward: { one: "curcubeu", many: "curcubeie", icon: REWARD.rainbow },
      v: { bg: "#F1E8FF", bgInk: "#3A1E6E", hdr: "#6D46C0", hdr2: "#8762D4", hdrInk: "#EFE6FF", acc: "#FFB3DE", accSh: "#D9789F", accInk: "#3A1E6E", paperSh: "#D8C6F5" },
      pat: pat(PATTERNS.rainbow, "#E2D2FB")
    }
  ];
})(window.M);
