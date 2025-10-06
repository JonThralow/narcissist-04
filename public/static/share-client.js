(function(){
  const el = document.getElementById('share-root');
  const dataEl = document.getElementById('share-data');
  if (!el || !dataEl) return;
  try {
    const payload = JSON.parse(dataEl.textContent || '{}');
    const fmt = (n)=> typeof n === 'number' ? n.toFixed(2) : n;
    el.innerHTML = `
      <div class="wrap">
        <h1>🪞 Narcissism — ${payload.variant} (${payload.count})</h1>
        <p class="muted">Created ${new Date(payload.createdAt).toLocaleString()}</p>
        <div class="grid">
          <div class="card">
            <h3>Total Narcissism Index (TNI)</h3>
            <div class="score">${fmt(payload.scores?.TNI)} <span class="band">(${payload.bands?.TNI})</span></div>
          </div>
          <div class="card">
            <h3>${payload.labels?.ADM || 'Admiration'}</h3>
            <div class="score">${fmt(payload.scores?.ADM)} <span class="band">(${payload.bands?.ADM})</span></div>
          </div>
          <div class="card">
            <h3>${payload.labels?.RIV || 'Rivalry'}</h3>
            <div class="score">${fmt(payload.scores?.RIV)} <span class="band">(${payload.bands?.RIV})</span></div>
          </div>
          <div class="card">
            <h3>${payload.labels?.VUL || 'Vulnerability'}</h3>
            <div class="score">${fmt(payload.scores?.VUL)} <span class="band">(${payload.bands?.VUL})</span></div>
          </div>
        </div>
        <p class="muted">This page contains no personal identifiers.</p>
      </div>
      <style>
        body { background: #0b1020; color: #e8ecf1; font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, 'Helvetica Neue', Arial; }
        .wrap { max-width: 900px; margin: 0 auto; padding: 24px 16px 64px; }
        .muted { color: #9bb3c9; }
        .grid { display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
        .card { background: #121831; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 16px; }
        .score { font-size: 24px; margin-top: 8px; }
        .band { color: #9bb3c9; font-weight: 500; }
        a { color: #7cc4ff; }
      </style>
    `;
  } catch(e) {
    el.textContent = 'Error rendering share payload.';
  }
})();