(function(){
  // ---- Item bank (40) ----
  const ITEMS = [
    { id:"N1",scaleId:"NARC",subscaleId:"ADM",text:"I often feel I stand out in a crowd.",reverseKeyed:false },
    { id:"N2",scaleId:"NARC",subscaleId:"ADM",text:"People benefit from having me as a leader.",reverseKeyed:false },
    { id:"N3",scaleId:"NARC",subscaleId:"ADM",text:"I have a special talent that sets me apart.",reverseKeyed:false },
    { id:"N4",scaleId:"NARC",subscaleId:"ADM",text:"I enjoy being the center of attention.",reverseKeyed:false },
    { id:"N5",scaleId:"NARC",subscaleId:"ADM",text:"Compliments usually reflect the truth about me.",reverseKeyed:false },
    { id:"N6",scaleId:"NARC",subscaleId:"ADM",text:"I prefer to stay unnoticed even when I do well.",reverseKeyed:true },

    { id:"N7",scaleId:"NARC",subscaleId:"RIV",text:"If someone challenges me, I won’t back down.",reverseKeyed:false },
    { id:"N8",scaleId:"NARC",subscaleId:"RIV",text:"I get irritated when others don’t recognize my worth.",reverseKeyed:false },
    { id:"N9",scaleId:"NARC",subscaleId:"RIV",text:"I feel driven to come out on top.",reverseKeyed:false },
    { id:"N10",scaleId:"NARC",subscaleId:"RIV",text:"Criticism usually says more about the critic than me.",reverseKeyed:false },
    { id:"N11",scaleId:"NARC",subscaleId:"RIV",text:"I don’t like seeing others get praise I deserve.",reverseKeyed:false },
    { id:"N12",scaleId:"NARC",subscaleId:"RIV",text:"I’m fine with others taking the spotlight.",reverseKeyed:true },

    { id:"N13",scaleId:"NARC",subscaleId:"VUL",text:"I worry people will see my flaws.",reverseKeyed:false },
    { id:"N14",scaleId:"NARC",subscaleId:"VUL",text:"I need reassurance that I’m valued.",reverseKeyed:false },
    { id:"N15",scaleId:"NARC",subscaleId:"VUL",text:"I feel hurt easily when I’m ignored.",reverseKeyed:false },
    { id:"N16",scaleId:"NARC",subscaleId:"VUL",text:"I’m preoccupied with how others judge me.",reverseKeyed:false },
    { id:"N17",scaleId:"NARC",subscaleId:"VUL",text:"I rarely feel self-conscious around others.",reverseKeyed:true },
    { id:"N18",scaleId:"NARC",subscaleId:"VUL",text:"I bounce back quickly when my ego is bruised.",reverseKeyed:true },

    { id:"N19",scaleId:"NARC",subscaleId:"ADM",text:"I’m destined to achieve great things.",reverseKeyed:false },
    { id:"N20",scaleId:"NARC",subscaleId:"ADM",text:"Others naturally look to me for direction.",reverseKeyed:false },
    { id:"N21",scaleId:"NARC",subscaleId:"ADM",text:"I often feel my abilities exceed those around me.",reverseKeyed:false },
    { id:"N22",scaleId:"NARC",subscaleId:"ADM",text:"I’m uncomfortable when attention turns to me.",reverseKeyed:true },
    { id:"N23",scaleId:"NARC",subscaleId:"ADM",text:"I bring out the best in teams.",reverseKeyed:false },
    { id:"N24",scaleId:"NARC",subscaleId:"ADM",text:"I enjoy showcasing my accomplishments.",reverseKeyed:false },
    { id:"N25",scaleId:"NARC",subscaleId:"ADM",text:"I see myself as ordinary, not exceptional.",reverseKeyed:true },
    { id:"N26",scaleId:"NARC",subscaleId:"ADM",text:"Recognition motivates me to push harder.",reverseKeyed:false },

    { id:"N27",scaleId:"NARC",subscaleId:"RIV",text:"I dislike losing even in small matters.",reverseKeyed:false },
    { id:"N28",scaleId:"NARC",subscaleId:"RIV",text:"I feel slighted when my ideas aren’t credited.",reverseKeyed:false },
    { id:"N29",scaleId:"NARC",subscaleId:"RIV",text:"I tend to compete even with friends.",reverseKeyed:false },
    { id:"N30",scaleId:"NARC",subscaleId:"RIV",text:"When criticized, I look for flaws in the critic.",reverseKeyed:false },
    { id:"N31",scaleId:"NARC",subscaleId:"RIV",text:"I protect my status when it’s threatened.",reverseKeyed:false },
    { id:"N32",scaleId:"NARC",subscaleId:"RIV",text:"I’m happy to let others win without minding.",reverseKeyed:true },
    { id:"N33",scaleId:"NARC",subscaleId:"RIV",text:"I rarely compare myself to others.",reverseKeyed:true },

    { id:"N34",scaleId:"NARC",subscaleId:"VUL",text:"I worry that praise won’t last.",reverseKeyed:false },
    { id:"N35",scaleId:"NARC",subscaleId:"VUL",text:"I need reassurance after setbacks.",reverseKeyed:false },
    { id:"N36",scaleId:"NARC",subscaleId:"VUL",text:"I replay social interactions looking for mistakes.",reverseKeyed:false },
    { id:"N37",scaleId:"NARC",subscaleId:"VUL",text:"I’m sensitive to being overlooked.",reverseKeyed:false },
    { id:"N38",scaleId:"NARC",subscaleId:"VUL",text:"I brush off social slights easily.",reverseKeyed:true },
    { id:"N39",scaleId:"NARC",subscaleId:"VUL",text:"I hardly ever need validation from others.",reverseKeyed:true },
    { id:"N40",scaleId:"NARC",subscaleId:"VUL",text:"I feel exposed when my work is evaluated.",reverseKeyed:false }
  ];

  const VARIANTS = {
    quick: ["N1","N3","N4","N6","N7","N11","N12","N14","N15","N17"],
    advanced: ["N1","N2","N3","N4","N6","N19","N25","N7","N8","N9","N12","N27","N31","N33","N13","N14","N15","N17","N18","N36"],
    precise: ITEMS.map(i => i.id)
  };

  const labels = { ADM: "Admiration", RIV: "Rivalry", VUL: "Vulnerability" };

  const elVariant = document.getElementById('variant');
  const elStart = document.getElementById('startBtn');
  const elReset = document.getElementById('resetBtn');
  const elQ = document.getElementById('questions');
  const elList = document.getElementById('qList');
  const elRes = document.getElementById('results');
  const elErr = document.getElementById('err');

  elStart.addEventListener('click', () => {
    const v = elVariant.value;
    buildForm(v);
    elQ.style.display = '';
    elRes.style.display = '';
    window.scrollTo({ top: elQ.offsetTop - 12, behavior: 'smooth' });
  });
  elReset.addEventListener('click', () => {
    elList.innerHTML = '';
    elQ.style.display = 'none';
    elRes.style.display = 'none';
    elErr.textContent = '';
  });

  function buildForm(variant) {
    const ids = VARIANTS[variant];
    const items = ITEMS.filter(i => ids.includes(i.id));
    elList.innerHTML = '';
    items.forEach((it, idx) => {
      const row = document.createElement('div');
      row.className = 'q';
      row.innerHTML = `
        <div class="row">
          <div><strong>Q${idx+1}.</strong> ${escapeHtml(it.text)}</div>
          <div class="scale">
            ${[1,2,3,4,5].map(v => `
              <label><input type="radio" name="${it.id}" value="${v}"> ${v}</label>
            `).join('')}
          </div>
        </div>
      `;
      elList.appendChild(row);
    });

    elList.addEventListener('change', () => computeAndRender(variant));
    computeAndRender(variant);
  }

  function computeAndRender(variant) {
    const ids = VARIANTS[variant];
    const resp = {};
    ids.forEach(id => {
      const sel = document.querySelector(`input[name="${id}"]:checked`);
      if (sel) resp[id] = Number(sel.value);
    });
    const scored = score(resp);

    const fmt = (x) => isFinite(x) ? x.toFixed(2) : '—';
    document.getElementById('tni').textContent = `TNI: ${fmt(scored.TNI)} (${band(scored.TNI)})`;
    document.getElementById('adm').textContent = `${labels.ADM}: ${fmt(scored.ADM)} (${band(scored.ADM)})`;
    document.getElementById('riv').textContent = `${labels.RIV}: ${fmt(scored.RIV)} (${band(scored.RIV)})`;
    document.getElementById('vul').textContent = `${labels.VUL}: ${fmt(scored.VUL)} (${band(scored.VUL)})`;

    setBar('barTNI', scored.TNI);
    setBar('barADM', scored.ADM);
    setBar('barRIV', scored.RIV);
    setBar('barVUL', scored.VUL);

    document.getElementById('bandNote').textContent = 'Bands: Low ≤2.2, Typical ≤3.2, Elevated ≤4.0, High >4.0';

    const shareBtn = document.getElementById('shareBtn');
    const out = document.getElementById('shareOut');
    shareBtn.onclick = async () => {
      elErr.textContent = '';
      try {
        const payload = toPayload(variant, scored);
        if (!isFinite(scored.ADM) || !isFinite(scored.RIV) || !isFinite(scored.VUL)) {
          throw new Error('Please answer enough questions (>=80% per subscale) to compute scores.');
        }
        const res = await fetch('/share', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ payload }) });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Share failed');
        out.innerHTML = `Share created: <a href="${data.url}">${data.url}</a>`;
      } catch (e) {
        elErr.textContent = e.message || String(e);
      }
    };
  }

  function setBar(id, val) {
    const el = document.getElementById(id);
    const clamped = Math.max(1, Math.min(5, Number(val)));
    const pct = ((clamped - 1) / 4) * 100;
    el.style.width = isFinite(pct) ? pct + '%' : '0%';
  }

  // ---- Scoring (reverse-key, 80% rule with one mean-impute) ----
  function score(responses) {
    const by = (sub) => {
      const all = ITEMS.filter(i => i.subscaleId === sub);
      const vals = [];
      for (const it of all) {
        if (responses[it.id] == null) continue;
        const raw = Number(responses[it.id]);
        const keyed = it.reverseKeyed ? (6 - raw) : raw;
        vals.push(keyed);
      }
      const needed = Math.ceil(0.8 * all.length);
      if (vals.length === 0) return NaN;
      if (vals.length < needed) return NaN;
      const mean = vals.reduce((a,b)=>a+b,0)/vals.length;
      if (vals.length < all.length) vals.push(mean);
      return vals.reduce((a,b)=>a+b,0)/vals.length;
    };
    const ADM = by('ADM');
    const RIV = by('RIV');
    const VUL = by('VUL');
    const TNI = [ADM,RIV,VUL].some(x => !isFinite(x)) ? NaN : (ADM+RIV+VUL)/3;
    return { ADM, RIV, VUL, TNI };
  }

  function band(x){
    if (!isFinite(x)) return 'Incomplete';
    if (x <= 2.2) return 'Low';
    if (x <= 3.2) return 'Typical';
    if (x <= 4.0) return 'Elevated';
    return 'High';
  }
  function toPayload(variant, scored){
    const now = new Date();
    return {
      _v: 1,
      createdAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + 30*24*3600*1000).toISOString(),
      testId: "narcissism.v1",
      variant,
      count: VARIANTS[variant].length,
      labels: { ADM: "Admiration", RIV: "Rivalry", VUL: "Vulnerability" },
      scores: { ADM: round2(scored.ADM), RIV: round2(scored.RIV), VUL: round2(scored.VUL), TNI: round2(scored.TNI) },
      bands:  { ADM: band(scored.ADM), RIV: band(scored.RIV), VUL: band(scored.VUL), TNI: band(scored.TNI) }
    };
  }
  function round2(x){ return isFinite(x) ? Math.round(x*100)/100 : x; }
  function escapeHtml(s){ return (s||'').replace(/[&<>"]/g,c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c])); }
})();
