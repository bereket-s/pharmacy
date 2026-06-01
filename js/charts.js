// js/charts.js — Canvas-based progress charts

const Charts = (() => {

  // ── Radar / Spider Chart ────────────────────────────────
  const drawRadarChart = (canvasId, data) => {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    const R = Math.min(W, H) * 0.36;
    const N = data.length;
    const angleStep = (Math.PI * 2) / N;
    const startAngle = -Math.PI / 2;

    ctx.clearRect(0, 0, W, H);

    // Grid rings
    [0.25, 0.5, 0.75, 1].forEach(fraction => {
      ctx.beginPath();
      for (let i = 0; i < N; i++) {
        const angle = startAngle + i * angleStep;
        const x = cx + Math.cos(angle) * R * fraction;
        const y = cy + Math.sin(angle) * R * fraction;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(255,255,255,0.07)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Axis lines
    for (let i = 0; i < N; i++) {
      const angle = startAngle + i * angleStep;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * R, cy + Math.sin(angle) * R);
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.stroke();
    }

    // Data polygon
    ctx.beginPath();
    data.forEach((d, i) => {
      const angle = startAngle + i * angleStep;
      const r = R * (d.value / 100);
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.closePath();
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
    grad.addColorStop(0, 'rgba(0, 194, 209, 0.5)');
    grad.addColorStop(1, 'rgba(0, 194, 209, 0.08)');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = '#00c2d1';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Data point dots
    data.forEach((d, i) => {
      const angle = startAngle + i * angleStep;
      const r = R * (d.value / 100);
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#00c2d1';
      ctx.fill();
    });

    // Labels
    ctx.font = '11px Inter, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'center';
    data.forEach((d, i) => {
      const angle = startAngle + i * angleStep;
      const labelR = R * 1.22;
      const x = cx + Math.cos(angle) * labelR;
      const y = cy + Math.sin(angle) * labelR + 4;
      ctx.fillText(d.label, x, y);
    });
  };

  // ── Bar Chart ───────────────────────────────────────────
  const drawBarChart = (canvasId, data, options = {}) => {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const padL = 40, padR = 20, padT = 20, padB = 40;
    const chartW = W - padL - padR;
    const chartH = H - padT - padB;

    ctx.clearRect(0, 0, W, H);

    if (!data || data.length === 0) {
      ctx.fillStyle = '#475569';
      ctx.font = '13px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('No data yet — start practicing!', W / 2, H / 2);
      return;
    }

    const maxVal = Math.max(...data.map(d => d.value), 1);
    const barW = (chartW / data.length) * 0.6;
    const gap = chartW / data.length;

    // Y-axis gridlines
    [0, 25, 50, 75, 100].forEach(pct => {
      const y = padT + chartH * (1 - pct / 100);
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(W - padR, y);
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = '#475569';
      ctx.font = '10px Inter';
      ctx.textAlign = 'right';
      ctx.fillText(pct + '%', padL - 6, y + 4);
    });

    // Bars
    data.forEach((d, i) => {
      const barH = chartH * (d.value / 100);
      const x = padL + i * gap + (gap - barW) / 2;
      const y = padT + chartH - barH;

      // Bar gradient
      const grad = ctx.createLinearGradient(x, y, x, y + barH);
      grad.addColorStop(0, d.color || '#00c2d1');
      grad.addColorStop(1, (d.color || '#00c2d1') + '44');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, barW, barH, [4, 4, 0, 0]);
      ctx.fill();

      // Label
      ctx.fillStyle = '#64748b';
      ctx.font = '10px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(d.label, x + barW / 2, H - padB + 14);

      // Value on top
      if (barH > 20) {
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '10px Inter';
        ctx.fillText(Math.round(d.value) + '%', x + barW / 2, y - 4);
      }
    });
  };

  // ── Line Chart (weekly accuracy) ────────────────────────
  const drawLineChart = (canvasId, data, options = {}) => {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const padL = 45, padR = 20, padT = 20, padB = 40;
    const chartW = W - padL - padR;
    const chartH = H - padT - padB;

    ctx.clearRect(0, 0, W, H);

    if (!data || data.length < 2) {
      ctx.fillStyle = '#475569';
      ctx.font = '13px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Practice more to see your trend!', W / 2, H / 2);
      return;
    }

    // Y-axis gridlines
    [0, 25, 50, 75, 100].forEach(pct => {
      const y = padT + chartH * (1 - pct / 100);
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(W - padR, y);
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = '#475569';
      ctx.font = '10px Inter';
      ctx.textAlign = 'right';
      ctx.fillText(pct + '%', padL - 6, y + 4);
    });

    const stepX = chartW / (data.length - 1);

    // Fill area under line
    ctx.beginPath();
    data.forEach((d, i) => {
      const x = padL + i * stepX;
      const y = padT + chartH * (1 - d.value / 100);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.lineTo(padL + (data.length - 1) * stepX, padT + chartH);
    ctx.lineTo(padL, padT + chartH);
    ctx.closePath();
    const areaGrad = ctx.createLinearGradient(0, padT, 0, padT + chartH);
    areaGrad.addColorStop(0, 'rgba(0, 194, 209, 0.25)');
    areaGrad.addColorStop(1, 'rgba(0, 194, 209, 0.0)');
    ctx.fillStyle = areaGrad;
    ctx.fill();

    // Line
    ctx.beginPath();
    data.forEach((d, i) => {
      const x = padL + i * stepX;
      const y = padT + chartH * (1 - d.value / 100);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#00c2d1';
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Dots and labels
    data.forEach((d, i) => {
      const x = padL + i * stepX;
      const y = padT + chartH * (1 - d.value / 100);
      ctx.beginPath();
      ctx.arc(x, y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#00c2d1';
      ctx.fill();
      ctx.strokeStyle = '#0f1626';
      ctx.lineWidth = 2;
      ctx.stroke();

      // X-axis label
      ctx.fillStyle = '#64748b';
      ctx.font = '10px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(d.label, x, H - padB + 14);
    });
  };

  // ── Donut / Ring Chart ──────────────────────────────────
  const drawRingChart = (canvasId, value, label, color) => {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2, cy = H / 2;
    const R = Math.min(W, H) * 0.38;
    const lineW = R * 0.28;

    ctx.clearRect(0, 0, W, H);

    // Background ring
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = lineW;
    ctx.stroke();

    // Value ring
    const angle = (Math.PI * 2) * (value / 100) - Math.PI / 2;
    ctx.beginPath();
    ctx.arc(cx, cy, R, -Math.PI / 2, angle);
    ctx.strokeStyle = color || '#00c2d1';
    ctx.lineWidth = lineW;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Center text
    ctx.fillStyle = '#f1f5f9';
    ctx.font = `bold ${Math.round(W * 0.18)}px Inter`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(Math.round(value) + '%', cx, cy - 6);
    ctx.font = `${Math.round(W * 0.09)}px Inter`;
    ctx.fillStyle = '#64748b';
    ctx.fillText(label || 'Accuracy', cx, cy + W * 0.1);
  };

  return { drawRadarChart, drawBarChart, drawLineChart, drawRingChart };
})();

window.Charts = Charts;
