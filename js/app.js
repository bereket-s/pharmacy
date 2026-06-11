// js/app.js — Main application controller, routing, views

// ── Global toast helper ──────────────────────────────────
window.showToast = (message, type = 'info', duration = 3000) => {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icons = { info: 'ℹ️', success: '✅', error: '❌', warning: '⚠️' };
  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('toast-show'));
  setTimeout(() => {
    toast.classList.remove('toast-show');
    setTimeout(() => toast.remove(), 350);
  }, duration);
};

// ── App ──────────────────────────────────────────────────
const App = (() => {
  let currentView  = 'dashboard';
  let quizSettings = { domain: 'ALL', difficulty: 'ALL', count: 10, mode: 'study' };

  // In-memory PDF store — populated from IndexedDB on startup
  const docFileStore = {};

  // ── Extracted Questions Integration ─────────────────────
  // Merges cloud-extracted MCQs into AppData.QUESTIONS so they appear in Practice
  const loadExtractedQuestionsIntoBank = async () => {
    if (typeof CloudQuestions === 'undefined') return;
    try {
      const extracted = await CloudQuestions.getAllExtractedQuestions();
      if (!extracted.length) return;

      // Remove any previously-loaded extracted questions first
      AppData.QUESTIONS = AppData.QUESTIONS.filter(q => !q.id.startsWith('extracted_'));

      // Add new ones
      AppData.QUESTIONS.push(...extracted);
      console.log(`✅ Loaded ${extracted.length} extracted questions into question bank`);
    } catch (e) {
      console.warn('Failed to load extracted questions:', e);
    }
  };

  // ── Gemini API Key Management ────────────────────────────
  const updateGeminiKeyStatus = () => {
    if (typeof PdfExtractor === 'undefined') return;
    const statusEl = document.getElementById('gemini-key-status');
    const inputEl  = document.getElementById('gemini-api-key-input');
    const hasKey   = PdfExtractor.hasApiKey();
    if (statusEl) {
      statusEl.textContent = hasKey ? '✓ Active' : 'No key';
      statusEl.style.background = hasKey ? '#10b98122' : '#ef444422';
      statusEl.style.color = hasKey ? '#10b981' : '#ef4444';
    }
    if (inputEl && hasKey) {
      inputEl.placeholder = 'API key saved — paste to update';
    }
  };

  const saveGeminiKey = () => {
    const input = document.getElementById('gemini-api-key-input');
    const key = input?.value.trim();
    if (!key) { showToast('Please paste your Gemini API key first', 'warning'); return; }
    PdfExtractor.setApiKey(key);
    if (input) input.value = '';
    updateGeminiKeyStatus();
    showToast('✅ Gemini API key saved! Upload a PDF to extract questions.', 'success', 4000);
  };

  // ── Extract questions from a PDF buffer ──────────────────
  const extractQuestionsFromDoc = async (arrayBuffer, docName, docId) => {
    if (typeof PdfExtractor === 'undefined' || !PdfExtractor.hasApiKey()) return;

    const progressEl  = document.getElementById('extraction-progress');
    const statusEl    = document.getElementById('extraction-status-text');
    const barEl       = document.getElementById('extraction-progress-bar');

    if (progressEl) progressEl.style.display = 'block';

    try {
      const questions = await PdfExtractor.extractQuestionsFromPdf(
        arrayBuffer,
        docName,
        docId,
        (current, total, found) => {
          const pct = total > 0 ? Math.round((current / total) * 100) : 0;
          if (statusEl) statusEl.textContent = `Chunk ${current}/${total} — ${found} questions found so far`;
          if (barEl) barEl.style.width = pct + '%';
        }
      );

      if (questions.length > 0) {
        // Save to cloud
        if (typeof CloudQuestions !== 'undefined') {
          await CloudQuestions.saveQuestionsForDoc(docId, docName, questions);
        }

        // Add to in-memory question bank immediately
        AppData.QUESTIONS = AppData.QUESTIONS.filter(q => q.docId !== docId || !q.id.startsWith('extracted_'));
        AppData.QUESTIONS.push(...questions);

        // Update library list to show question count
        renderLibraryList();
        showToast(`🧠 Extracted ${questions.length} questions from "${docName}"!`, 'success', 5000);
      } else {
        showToast(`No MCQ questions found in "${docName}"`, 'info', 4000);
      }
    } catch (err) {
      console.error('Extraction error:', err);
      showToast(`Extraction failed: ${err.message}`, 'error', 6000);
    } finally {
      if (progressEl) progressEl.style.display = 'none';
      if (barEl) barEl.style.width = '0%';
    }
  };

  // ── Re-extract a specific document ──────────────────────
  const reExtractDoc = async (docId) => {
    const entry = docFileStore[docId];
    if (!entry?.arrayBuffer) {
      // Need to fetch from cloud first
      showToast('Opening document to re-extract...', 'info', 2000);
      const stored = await DB.getPdf(docId).catch(() => null);
      if (!stored) { showToast('Could not load PDF for re-extraction', 'error'); return; }
      docFileStore[docId] = { arrayBuffer: stored.arrayBuffer, name: stored.name };
    }
    const name = docFileStore[docId].name || docId;
    await extractQuestionsFromDoc(docFileStore[docId].arrayBuffer, name, docId);
  };


  // ── Sync Logic ───────────────────────────────────────────
  const openSyncModal = () => {
    document.getElementById('sidebar')?.classList.remove('open');
    document.getElementById('sidebar-overlay')?.classList.remove('open');
    const uid = localStorage.getItem('pharmprep_uid') || '';
    const input = document.getElementById('current-sync-code');
    if (input) input.value = uid;
    document.getElementById('sync-modal')?.classList.add('show');
  };

  const applySyncCode = () => {
    const code = document.getElementById('new-sync-code')?.value.trim();
    if (!code) return;
    if (confirm("Are you sure? Your current local stats and PDFs will be unlinked, and this device will use the cloud storage of the code you entered.")) {
      localStorage.setItem('pharmprep_uid', code);
      location.reload();
    }
  };

  // ── Helpers ─────────────────────────────────────────────
  const setEl    = (id, text)       => { const e = document.getElementById(id); if (e) e.textContent = text; };
  const setStyle = (id, prop, val)  => { const e = document.getElementById(id); if (e) e.style[prop] = val; };

  const makeDocId = (file) =>
    file.name.replace(/[^a-zA-Z0-9.\-_ ()]/g, '_');

  const formatTime = (s) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;
  const formatDuration = (ms) => {
    const s = Math.floor(ms / 1000);
    if (s < 60) return `${s}s`;
    return `${Math.floor(s/60)}m ${s%60}s`;
  };
  const greeting = () => {
    const h = new Date().getHours();
    return h < 12 ? '☀️ Good Morning!' : h < 17 ? '🌤 Good Afternoon!' : '🌙 Good Evening!';
  };

  // ── Router ───────────────────────────────────────────────
  const navigate = (view) => {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const viewEl = document.getElementById('view-' + view);
    if (!viewEl) return;
    viewEl.classList.add('active');
    document.querySelector(`[data-view="${view}"]`)?.classList.add('active');
    currentView = view;
    document.getElementById('sidebar')?.classList.remove('open');
    document.getElementById('sidebar-overlay')?.classList.remove('open');
    if (view === 'dashboard') renderDashboard();
    if (view === 'analytics') renderAnalytics();
    if (view === 'bookmarks') renderBookmarks();
    if (view === 'practice')  renderPracticeSetup();
  };

  // ── Dashboard ────────────────────────────────────────────
  const renderDashboard = () => {
    setEl('dash-greeting', greeting());
    const ts = Storage.getTodayStats();
    const tot = Storage.getTotalStats();
    const str = Storage.getStreak();
    setEl('dash-today-answered', ts.answered);
    setEl('dash-today-accuracy', ts.answered > 0 ? Math.round((ts.correct/ts.answered)*100)+'%' : '—');
    setEl('dash-total-answered', tot.totalAnswered);
    setEl('dash-streak-count', str.count);
    setEl('streak-count', str.count);

    const domainStats = Storage.getDomainStats();
    const grid = document.getElementById('domain-progress-grid');
    if (grid) {
      grid.innerHTML = Object.values(AppData.DOMAINS).map(d => {
        const st  = domainStats[d.id] || { attempts:0, correct:0 };
        const totalQ = AppData.QUESTIONS.filter(q => q.domain === d.id).length;
        const acc = st.attempts > 0 ? Math.round((st.correct/st.attempts)*100) : 0;
        const attempted = AppData.QUESTIONS.filter(q => q.domain === d.id && (() => {
          const p = Storage.getQuestionProgress(q.id); return p && p.attempts > 0;
        })()).length;
        const pct = totalQ > 0 ? Math.round((attempted/totalQ)*100) : 0;
        return `<div class="domain-card" onclick="App.startQuickPractice('${d.id}')" style="--domain-color:${d.color}">
          <div class="domain-card-header">
            <span class="domain-icon">${d.icon}</span>
            <div class="domain-meta"><h3>${d.name}</h3><p>${totalQ} questions</p></div>
            <span class="domain-accuracy" style="color:${d.color}">${st.attempts>0?acc+'%':'—'}</span>
          </div>
          <div class="progress-bar-wrap"><div class="progress-bar" style="--pct:${pct}%;--color:${d.color}"></div></div>
          <div class="domain-card-footer"><span>${attempted}/${totalQ} attempted</span><span style="color:${d.color}">${pct}% done</span></div>
        </div>`;
      }).join('');
    }
    renderMistakes();
  };

  const renderMistakes = () => {
    const container = document.getElementById('mistakes-list');
    if (!container) return;
    const progress = Storage.getProgress();
    const mistakes = AppData.QUESTIONS
      .filter(q => { const p = progress[q.id]; return p && p.attempts > 0 && (p.correct/p.attempts) < 0.6; })
      .slice(0, 4);
    if (!mistakes.length) {
      container.innerHTML = '<p class="empty-msg">No weak areas yet — keep practicing! 🎯</p>';
      return;
    }
    container.innerHTML = mistakes.map(q => {
      const p = progress[q.id];
      const d = AppData.DOMAINS[q.domain];
      return `<div class="mistake-item" onclick="App.reviewQuestion('${q.id}')">
        <div class="mistake-domain-tag" style="color:${d.color};border-color:${d.color}40">${d.icon} ${d.shortName}</div>
        <p class="mistake-q">${q.question.substring(0,80)}…</p>
        <span class="mistake-acc">${Math.round((p.correct/p.attempts)*100)}% accuracy (${p.attempts} attempts)</span>
      </div>`;
    }).join('');
  };

  // ── Practice Setup ───────────────────────────────────────
  const renderPracticeSetup = () => updateQuestionCountDisplay();

  const initPracticeControls = () => {
    document.querySelectorAll('.domain-filter-btn').forEach(btn => btn.addEventListener('click', () => {
      document.querySelectorAll('.domain-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      quizSettings.domain = btn.dataset.domain;
      updateQuestionCountDisplay();
    }));
    document.querySelectorAll('.diff-filter-btn').forEach(btn => btn.addEventListener('click', () => {
      document.querySelectorAll('.diff-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      quizSettings.difficulty = btn.dataset.diff;
      updateQuestionCountDisplay();
    }));
    document.querySelectorAll('.mode-btn').forEach(btn => btn.addEventListener('click', () => {
      document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      quizSettings.mode = btn.dataset.mode;
    }));
    const slider = document.getElementById('question-count-slider');
    if (slider) slider.addEventListener('input', () => {
      quizSettings.count = parseInt(slider.value);
      updateQuestionCountDisplay();
    });
  };

  const updateQuestionCountDisplay = () => {
    const pool = AppData.QUESTIONS.filter(q => {
      const dm = quizSettings.domain === 'ALL' || q.domain === quizSettings.domain;
      const df = quizSettings.difficulty === 'ALL' || q.difficulty === quizSettings.difficulty;
      return dm && df;
    });
    const count = Math.min(quizSettings.count, pool.length);
    setEl('question-count-display', count);
    setEl('pool-count-display', pool.length);
    setEl('question-count-display-preview', count);
    const preview = document.getElementById('question-count-display-preview');
    if (preview) preview.textContent = count;
    const p2 = document.getElementById('question-count-display-preview');
    if (p2) p2.textContent = count;
    // sync the "Your session will include X questions" text
    const p3 = document.querySelector('#question-count-display-preview');
    if (p3) p3.textContent = count;
    const slider = document.getElementById('question-count-slider');
    if (slider) {
      slider.max = Math.max(1, pool.length);
      if (parseInt(slider.value) > pool.length) { slider.value = pool.length; quizSettings.count = pool.length; }
    }
    // Update preview card
    const prev = document.getElementById('question-count-display-preview');
    if (prev) prev.textContent = count;
  };

  // ── Quiz ─────────────────────────────────────────────────
  const startQuiz = (options = {}) => {
    const settings = { ...quizSettings, ...options };
    const session = Quiz.createSession(settings);
    if (!session || !session.questions.length) {
      showToast('No questions match those filters.', 'warning'); return;
    }
    openQuizOverlay();
    renderCurrentQuestion();
  };

  const startQuickPractice = (domain) => {
    navigate('practice');
    setTimeout(() => {
      document.querySelectorAll('.domain-filter-btn').forEach(b => { if (b.dataset.domain === domain) b.click(); });
    }, 100);
  };

  const openQuizOverlay = () => {
    document.getElementById('quiz-overlay')?.classList.add('open');
    document.body.classList.add('quiz-open');
  };

  const closeQuizOverlay = () => {
    document.getElementById('quiz-overlay')?.classList.remove('open');
    document.body.classList.remove('quiz-open');
    Quiz.endSession();
  };

  const renderCurrentQuestion = () => {
    const q = Quiz.getCurrentQuestion();
    const progress = Quiz.getSessionProgress();
    const session = Quiz.getSession();
    if (!q || !progress) return;

    const pct = ((progress.current - 1) / progress.total) * 100;
    setStyle('quiz-progress-fill', 'width', pct + '%');
    setEl('quiz-progress-text', `${progress.current} / ${progress.total}`);

    const d    = AppData.DOMAINS[q.domain];
    const diff = AppData.DIFFICULTIES[q.difficulty];
    setEl('quiz-domain-badge', `${d?.icon||''} ${d?.shortName||q.domain}`);
    setStyle('quiz-domain-badge', 'color', d?.color||'#00c2d1');
    setEl('quiz-diff-badge', diff?.label||q.difficulty);
    setStyle('quiz-diff-badge', 'color', diff?.color||'#94a3b8');
    setEl('quiz-question-text', q.question);

    const optEl = document.getElementById('quiz-options');
    if (optEl) {
      optEl.innerHTML = q.options.map((opt, i) =>
        `<button class="quiz-option" id="opt-${i}" onclick="App.selectOption(${i})" data-index="${i}">
          <span class="opt-letter">${String.fromCharCode(65+i)}</span>
          <span class="opt-text">${opt}</span>
          <span class="opt-indicator"></span>
        </button>`
      ).join('');
    }

    const bookmarked = Storage.isBookmarked(q.id);
    const bBtn = document.getElementById('quiz-bookmark-btn');
    if (bBtn) { bBtn.textContent = bookmarked?'★':'☆'; bBtn.classList.toggle('bookmarked', bookmarked); }

    document.getElementById('quiz-explanation')?.classList.remove('visible');
    const nextBtn = document.getElementById('quiz-next-btn');
    if (nextBtn) {
      nextBtn.style.display = 'none';
      nextBtn.textContent = progress.current >= progress.total ? 'See Results' : 'Next Question →';
    }

    const timerEl = document.getElementById('quiz-timer');
    if (session?.mode === 'exam') {
      if (timerEl) timerEl.style.display = 'flex';
      Quiz.resetTimer(Storage.getSettings().timerSeconds || 90,
        (rem) => { setEl('quiz-timer-val', formatTime(rem)); timerEl?.classList.toggle('timer-warning', rem<=15); },
        () => { if (Quiz.getSession()?.state === 'answering') selectOption(-1); }
      );
    } else {
      if (timerEl) timerEl.style.display = 'none';
    }
  };

  const selectOption = (selectedIndex) => {
    const session = Quiz.getSession();
    if (!session || session.state !== 'answering') return;
    const result = Quiz.submitAnswer(selectedIndex);
    if (!result) return;
    Quiz.stopTimer();

    document.querySelectorAll('.quiz-option').forEach((btn, i) => {
      btn.disabled = true;
      if (i === result.correctIndex) btn.classList.add('opt-correct');
      else if (selectedIndex !== -1 && i === selectedIndex && !result.isCorrect) btn.classList.add('opt-wrong');
      else btn.classList.add('opt-dim');
    });

    const icon = document.getElementById('quiz-result-icon');
    if (icon) { icon.textContent = result.isCorrect ? '✅' : '❌'; icon.classList.add('result-pop'); setTimeout(() => icon.classList.remove('result-pop'), 600); }

    const q = AppData.QUESTIONS.find(q2 => q2.id === Quiz.getCurrentQuestion()?.id);
    if (q) {
      const expEl = document.getElementById('quiz-explanation');
      const expTx = document.getElementById('quiz-explanation-text');
      const expRf = document.getElementById('quiz-explanation-ref');
      if (expEl && expTx) {
        expTx.innerHTML = q.explanation.replace(/\n/g, '<br>');
        if (expRf) expRf.textContent = '📖 ' + (q.reference||'');
        expEl.classList.add('visible');
      }
    }

    const nextBtn = document.getElementById('quiz-next-btn');
    if (nextBtn) nextBtn.style.display = 'flex';
  };

  const advanceQuiz = () => {
    const p = Quiz.getSessionProgress();
    if ((p && p.current >= p.total) || !Quiz.nextQuestion()) showResults();
    else renderCurrentQuestion();
  };

  const showResults = () => {
    const s = Quiz.getSessionSummary();
    if (!s) return;
    document.getElementById('quiz-overlay')?.classList.add('results-mode');
    setEl('result-score', s.correct + '/' + s.total);
    setEl('result-accuracy', s.accuracy + '%');
    setEl('result-duration', formatDuration(s.durationMs));
    setEl('result-grade-msg', s.accuracy>=80?'🏆 Excellent!':s.accuracy>=60?'👍 Good Work':s.accuracy>=40?'📚 Keep Studying':'💪 Don\'t Give Up!');
    const color = s.accuracy>=80?'#22c55e':s.accuracy>=60?'#f59e0b':'#ef4444';
    const sc = document.getElementById('result-score'); if (sc) sc.style.color = color;
    const bd = document.getElementById('result-domain-breakdown');
    if (bd) {
      bd.innerHTML = Object.entries(s.byDomain).map(([dId, st]) => {
        const d = AppData.DOMAINS[dId];
        const acc = Math.round((st.correct/st.total)*100);
        return `<div class="result-domain-row">
          <span>${d?.icon||''} ${d?.shortName||dId}</span>
          <div class="result-domain-bar-wrap"><div class="result-domain-bar" style="width:${acc}%;background:${d?.color||'#00c2d1'}"></div></div>
          <span>${st.correct}/${st.total} (${acc}%)</span>
        </div>`;
      }).join('');
    }
    setTimeout(() => Charts.drawRingChart('result-ring-canvas', s.accuracy, 'Score', color), 100);
    const qm = document.getElementById('quiz-main');
    const qr = document.getElementById('quiz-results');
    if (qm) qm.classList.add('hidden');
    if (qr) { qr.classList.remove('hidden'); qr.style.display = 'flex'; }
  };

  const reviewQuestion = (questionId) => {
    const q = AppData.QUESTIONS.find(q2 => q2.id === questionId);
    if (!q) return;
    startQuiz({ domain: q.domain, count: 1, mode: 'study' });
  };

  // ── Analytics ────────────────────────────────────────────
  const renderAnalytics = () => {
    const ds  = Storage.getDomainStats();
    const tot = Storage.getTotalStats();
    setEl('analytics-total', tot.totalAnswered);
    setEl('analytics-accuracy', tot.totalAnswered>0 ? Math.round((tot.totalCorrect/tot.totalAnswered)*100)+'%' : '—');
    setEl('analytics-streak', Storage.getStreak().count + ' days');

    setTimeout(() => {
      Charts.drawRadarChart('radar-canvas', Object.values(AppData.DOMAINS).map(d => {
        const st = ds[d.id]||{attempts:0,correct:0};
        return { label: d.shortName, value: st.attempts>0?Math.round((st.correct/st.attempts)*100):0 };
      }));
      Charts.drawBarChart('bar-canvas', Object.values(AppData.DOMAINS).map(d => {
        const st = ds[d.id]||{attempts:0,correct:0};
        return { label: d.icon, value: st.attempts>0?Math.round((st.correct/st.attempts)*100):0, color: d.color };
      }));
      const history = Storage.getDailyHistory();
      Charts.drawLineChart('line-canvas', Array.from({length:7}, (_,i) => {
        const dt  = new Date(Date.now() - (6-i)*86400000);
        const key = dt.toISOString().split('T')[0];
        const day = history[key]||{answered:0,correct:0};
        return { label: dt.toLocaleDateString('en',{weekday:'short'}), value: day.answered>0?Math.round((day.correct/day.answered)*100):0 };
      }));
      const oa = tot.totalAnswered>0?(tot.totalCorrect/tot.totalAnswered)*100:0;
      Charts.drawRingChart('overall-ring-canvas', oa, 'Overall', '#00c2d1');
    }, 50);

    const wc = document.getElementById('weak-areas-list');
    if (wc) {
      const weak = Object.values(AppData.DOMAINS)
        .map(d => { const st=ds[d.id]||{attempts:0,correct:0}; return {...d,...st,acc:st.attempts>0?(st.correct/st.attempts)*100:null}; })
        .filter(d => d.acc!==null && d.acc<70)
        .sort((a,b) => a.acc-b.acc);
      wc.innerHTML = weak.length
        ? weak.map(d => `<div class="weak-area-item"><span class="weak-icon">${d.icon}</span><div class="weak-info"><strong>${d.name}</strong><span>${d.attempts} attempts — ${Math.round(d.acc)}% accuracy</span></div><button class="btn btn-sm btn-outline" onclick="App.startQuickPractice('${d.id}')">Practice</button></div>`).join('')
        : '<p class="empty-msg">No weak areas yet. Keep practicing! 🌟</p>';
    }
  };

  // ── Bookmarks ────────────────────────────────────────────
  const renderBookmarks = () => {
    const container = document.getElementById('bookmarks-grid');
    if (!container) return;
    const bookmarks = Storage.getBookmarks();
    if (!bookmarks.length) {
      container.innerHTML = `<div class="empty-state"><span class="empty-icon">⭐</span><h3>No bookmarks yet</h3><p>While practicing, tap ☆ to bookmark questions for later review.</p></div>`;
      return;
    }
    container.innerHTML = AppData.QUESTIONS.filter(q => bookmarks.includes(q.id)).map(q => {
      const d = AppData.DOMAINS[q.domain];
      const p = Storage.getQuestionProgress(q.id);
      const acc = p&&p.attempts>0 ? Math.round((p.correct/p.attempts)*100)+'%' : 'Not attempted';
      return `<div class="bookmark-card">
        <div class="bookmark-card-header">
          <span class="domain-pill" style="color:${d.color};border-color:${d.color}40">${d.icon} ${d.shortName}</span>
          <button class="bookmark-remove-btn" onclick="App.removeBookmark('${q.id}')" title="Remove bookmark">✕</button>
        </div>
        <p class="bookmark-question">${q.question}</p>
        <div class="bookmark-card-footer">
          <span class="bookmark-accuracy">${acc}</span>
          <button class="btn btn-sm btn-primary" onclick="App.reviewQuestion('${q.id}')">Practice →</button>
        </div>
      </div>`;
    }).join('');
  };

  const removeBookmark = (questionId) => {
    Storage.toggleBookmark(questionId);
    renderBookmarks();
    showToast('Bookmark removed', 'info');
  };

  // ── Library ──────────────────────────────────────────────
  const renderLibraryList = () => {
    const meta = Storage.getLibraryMeta();
    const container = document.getElementById('library-doc-list');
    if (!container) return;
    if (!meta.length) {
      container.innerHTML = `<div class="empty-state"><span class="empty-icon">📚</span><h3>No documents yet</h3><p>Upload your reference PDFs to study here.</p></div>`;
      return;
    }
    container.innerHTML = meta.map(m => {
      const pct        = m.totalPages ? Math.round(((m.lastPage||1)/m.totalPages)*100) : 0;
      const ready      = !!docFileStore[m.id];
      const qCount     = typeof CloudQuestions !== 'undefined' ? CloudQuestions.getQuestionCountForDoc(m.id) : 0;
      const qBadge     = qCount > 0 ? `<span style="font-size:0.65rem;background:#8b5cf622;color:#8b5cf6;padding:2px 7px;border-radius:10px;font-weight:600;margin-left:4px">${qCount} Qs</span>` : '';
      const reExtractBtn = `<button class="doc-delete-btn" onclick="event.stopPropagation();App.reExtractDoc('${m.id}')" title="Re-extract questions with AI" style="font-size:0.8rem">🤖</button>`;
      return `<div class="doc-item ${ready?'':'doc-item-stale'}" onclick="App.openDoc('${m.id}')" title="${ready?'Click to read':'Restoring…'}">
        <span class="doc-icon">${ready?'📄':'🔒'}</span>
        <div class="doc-info">
          <div style="display:flex;align-items:center;flex-wrap:wrap;gap:2px"><strong>${m.name}</strong>${qBadge}</div>
          <span>Page ${m.lastPage||1} / ${m.totalPages||'?'} · ${pct}% read${ready?'':' · loading…'}</span>
          <div class="doc-progress-bar"><div style="width:${pct}%;background:var(--primary)"></div></div>
        </div>
        <div style="display:flex;flex-direction:column;gap:4px">
          ${reExtractBtn}
          <button class="doc-delete-btn" onclick="event.stopPropagation();App.deleteDoc('${m.id}')" title="Remove">🗑</button>
        </div>
      </div>`;
    }).join('');
  };

  const openDoc = async (docId) => {
    navigate('library');
    let entry = docFileStore[docId];

    // Entry exists but has no bytes yet — fetch from Cloud Storage
    if (entry && !entry.arrayBuffer && typeof DB !== 'undefined' && DB.isAvailable()) {
      showToast('📥 Loading PDF from cloud…', 'info', 3000);
      try {
        const stored = await DB.getPdf(docId);
        if (stored) { entry = { arrayBuffer: stored.arrayBuffer, name: stored.name }; docFileStore[docId] = entry; renderLibraryList(); }
      } catch(e) { console.warn('Cloud DB read failed:', e); }
    }

    // Not in memory at all — try fetching from DB
    if (!entry && typeof DB !== 'undefined') {
      showToast('📥 Loading PDF from cloud…', 'info', 3000);
      try {
        const stored = await DB.getPdf(docId);
        if (stored) { entry = { arrayBuffer: stored.arrayBuffer, name: stored.name }; docFileStore[docId] = entry; renderLibraryList(); }
      } catch(e) { console.warn('DB read failed:', e); }
    }
    if (!entry) {
      showToast('PDF not found — please re-upload the file.', 'warning', 4000);
      document.getElementById('pdf-upload-input')?.click();
      return;
    }
    await Reader.openFromArrayBuffer(entry.arrayBuffer, entry.name, docId, 'pdf-canvas', ({name, totalPages}) => {
      Storage.addLibraryItem({ id: docId, totalPages });
      setEl('reader-doc-title', name.replace(/\.pdf$/i, ''));
      document.getElementById('reader-empty-state')?.classList.add('hidden');
      document.getElementById('pdf-reader-wrap')?.classList.remove('hidden');
      
      // Switch to reader view on mobile
      document.querySelector('.library-layout')?.classList.add('doc-open');
      
      renderLibraryList(); // update sidebar UI with true page count
    });
  };

  const deleteDoc = async (docId) => {
    if (!confirm('Remove this document from your library?')) return;
    Storage.removeLibraryItem(docId);
    delete docFileStore[docId];
    try { if (typeof DB !== 'undefined') await DB.deletePdf(docId); } catch(e){}
    // Remove extracted questions for this doc
    if (typeof CloudQuestions !== 'undefined') {
      await CloudQuestions.deleteQuestionsForDoc(docId).catch(() => {});
    }
    AppData.QUESTIONS = AppData.QUESTIONS.filter(q => q.docId !== docId);
    Reader.close();
    document.getElementById('pdf-reader-wrap')?.classList.add('hidden');
    document.getElementById('reader-empty-state')?.classList.remove('hidden');
    document.querySelector('.library-layout')?.classList.remove('doc-open');
    setEl('reader-doc-title', 'No document open');
    renderLibraryList();
    showToast('Document removed', 'info');
  };

  const restoreFromDB = async () => {
    if (typeof DB === 'undefined' || !DB.isAvailable()) return;
    try {
      const all = await DB.getAllPdfs();
      all.forEach(pdf => {
        // Cloud returns metadata stubs (arrayBuffer = null until opened)
        if (!docFileStore[pdf.id]) {
          docFileStore[pdf.id] = { arrayBuffer: pdf.arrayBuffer, name: pdf.name };
        }
        
        // Automatically add to local metadata if missing (for shared global DB)
        const metaList = Storage.getLibraryMeta();
        if (!metaList.find(m => m.id === pdf.id)) {
          Storage.addLibraryItem({
            id: pdf.id,
            name: pdf.name,
            size: 0,
            totalPages: 1,
            lastPage: 1,
            addedAt: pdf.savedAt
          });
        }
      });
      renderLibraryList();
    } catch(e) { console.warn('Cloud DB restore failed:', e); }

    // Also load any previously extracted questions from cloud
    await loadExtractedQuestionsIntoBank();
  };

  // ── Quiz bookmark toggle ─────────────────────────────────
  const toggleQuizBookmark = () => {
    const q = Quiz.getCurrentQuestion();
    if (!q) return;
    const nb = Storage.toggleBookmark(q.id);
    const btn = document.getElementById('quiz-bookmark-btn');
    if (btn) { btn.textContent = nb?'★':'☆'; btn.classList.toggle('bookmarked', nb); }
    showToast(nb ? 'Bookmarked! ⭐' : 'Bookmark removed', nb ? 'success' : 'info');
  };

  // ── Init ─────────────────────────────────────────────────
  const init = async () => {
    Storage.updateStreak();

    // Hash router
    const hashRoute = () => navigate(window.location.hash.replace('#','') || 'dashboard');
    window.addEventListener('hashchange', hashRoute);
    hashRoute();

    // Nav clicks
    document.querySelectorAll('.nav-item').forEach(item => item.addEventListener('click', (e) => {
      e.preventDefault();
      navigate(item.dataset.view);
      window.location.hash = item.dataset.view;
    }));

    // Mobile sidebar
    document.getElementById('menu-btn')?.addEventListener('click', () => {
      document.getElementById('sidebar')?.classList.toggle('open');
      document.getElementById('sidebar-overlay')?.classList.toggle('open');
    });
    document.getElementById('sidebar-overlay')?.addEventListener('click', () => {
      document.getElementById('sidebar')?.classList.remove('open');
      document.getElementById('sidebar-overlay')?.classList.remove('open');
    });

    // Practice
    initPracticeControls();
    document.getElementById('start-quiz-btn')?.addEventListener('click', () => startQuiz());

    // Quiz overlay
    document.getElementById('quiz-close-btn')?.addEventListener('click', () => {
      if (Quiz.getSession()?.state !== 'complete' && !confirm('Exit quiz? Progress will be lost.')) return;
      closeQuizOverlay();
      document.getElementById('quiz-main')?.classList.remove('hidden');
      const qr = document.getElementById('quiz-results');
      if (qr) { qr.classList.add('hidden'); qr.style.display=''; }
      document.getElementById('quiz-overlay')?.classList.remove('results-mode');
    });
    document.getElementById('quiz-next-btn')?.addEventListener('click', advanceQuiz);
    document.getElementById('quiz-bookmark-btn')?.addEventListener('click', toggleQuizBookmark);

    // Results
    document.getElementById('result-retry-btn')?.addEventListener('click', () => {
      document.getElementById('quiz-main')?.classList.remove('hidden');
      const qr = document.getElementById('quiz-results');
      if (qr) { qr.classList.add('hidden'); qr.style.display=''; }
      document.getElementById('quiz-overlay')?.classList.remove('results-mode');
      startQuiz();
    });
    document.getElementById('result-close-btn')?.addEventListener('click', () => {
      closeQuizOverlay();
      document.getElementById('quiz-main')?.classList.remove('hidden');
      const qr = document.getElementById('quiz-results');
      if (qr) { qr.classList.add('hidden'); qr.style.display=''; }
      document.getElementById('quiz-overlay')?.classList.remove('results-mode');
    });

    // PDF upload — multiple files, saved to IndexedDB
    const uploadInput = document.getElementById('pdf-upload-input');
    uploadInput?.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files);
      e.target.value = '';
      if (!files.length) return;
      const pdfs = files.filter(f => f.type === 'application/pdf');
      if (files.length - pdfs.length > 0) showToast(`${files.length-pdfs.length} non-PDF file(s) skipped`, 'warning');
      if (!pdfs.length) return;
      showToast(`Loading ${pdfs.length} file${pdfs.length>1?'s':''}…`, 'info', 2500);

      let firstOpened = false;
      for (const file of pdfs) {
        try {
          const docId = makeDocId(file);
          const buf   = await file.arrayBuffer();

          // Save to Cloud DB
          try { 
            if (typeof DB !== 'undefined') await DB.savePdf(docId, file.name, buf); 
          } catch(e) { 
            console.error('Cloud DB save failed:', e); 
            showToast(`Cloud Error: ${e.message}`, 'error', 5000);
          }

          // Keep in memory
          docFileStore[docId] = { arrayBuffer: buf, name: file.name };

          // Get page count
          await Reader.ensurePDFJSLoaded();
          const pdfjsDoc  = await pdfjsLib.getDocument({ data: new Uint8Array(buf.slice(0)) }).promise;
          const totalPages = pdfjsDoc.numPages;
          pdfjsDoc.destroy();

          // Save metadata
          Storage.addLibraryItem({ id: docId, name: file.name, size: file.size, totalPages, lastPage: 1, addedAt: Date.now() });

          // Open first in reader
          if (!firstOpened) {
            firstOpened = true;
            await Reader.openFromArrayBuffer(buf, file.name, docId, 'pdf-canvas', ({name, totalPages}) => {
              Storage.addLibraryItem({ id: docId, totalPages });
              setEl('reader-doc-title', name.replace(/\.pdf$/i, ''));
              document.getElementById('reader-empty-state')?.classList.add('hidden');
              document.getElementById('pdf-reader-wrap')?.classList.remove('hidden');
              
              document.querySelector('.library-layout')?.classList.add('doc-open');
              renderLibraryList();
            });
          }

          renderLibraryList();
        } catch(err) {
          showToast(`Failed to load "${file.name}"`, 'error');
          console.error('Upload error:', err);
        }
      }
      showToast(pdfs.length===1 ? `📄 Saved: ${pdfs[0].name}` : `📚 ${pdfs.length} documents saved!`, 'success', 4000);

      // Trigger AI question extraction for each PDF (if API key is set)
      if (typeof PdfExtractor !== 'undefined' && PdfExtractor.hasApiKey()) {
        showToast('🤖 Starting question extraction...', 'info', 3000);
        for (const file of pdfs) {
          const docId = file.name.replace(/[^a-zA-Z0-9.\-_ ()]/g, '_');
          const buf = docFileStore[docId]?.arrayBuffer;
          if (buf) {
            await extractQuestionsFromDoc(buf, file.name, docId);
          }
        }
      }
    });

    // PDF controls
    document.getElementById('reader-prev-btn')?.addEventListener('click',       () => Reader.prevPage('pdf-canvas'));
    document.getElementById('reader-next-btn')?.addEventListener('click',       () => Reader.nextPage('pdf-canvas'));
    document.getElementById('reader-zoom-in-btn')?.addEventListener('click',    () => Reader.zoomIn('pdf-canvas'));
    document.getElementById('reader-zoom-out-btn')?.addEventListener('click',   () => Reader.zoomOut('pdf-canvas'));
    document.getElementById('reader-zoom-reset-btn')?.addEventListener('click', () => Reader.resetZoom('pdf-canvas'));
    document.getElementById('upload-pdf-btn')?.addEventListener('click',        () => uploadInput?.click());

    const pageInput = document.getElementById('reader-page-input');
    pageInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { const p = parseInt(pageInput.value); if (!isNaN(p)) Reader.goToPage(p, 'pdf-canvas'); }
    });

    // Keyboard shortcuts (quiz)
    document.addEventListener('keydown', (e) => {
      if (!document.getElementById('quiz-overlay')?.classList.contains('open')) return;
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        const nb = document.getElementById('quiz-next-btn');
        if (nb && nb.style.display !== 'none') advanceQuiz();
      }
      ['1','2','3','4'].forEach((k,i) => { if (e.key===k) { const b=document.getElementById(`opt-${i}`); if(b&&!b.disabled) b.click(); } });
      if (e.key === 'Escape') document.getElementById('quiz-close-btn')?.click();
    });

    renderLibraryList();
    restoreFromDB();
    updateGeminiKeyStatus();
    await loadExtractedQuestionsIntoBank();
    renderLibraryList();

    // ── Theme toggle ──────────────────────────────────────
    const applyTheme = (dark) => {
      document.body.classList.toggle('dark', dark);
      const btn = document.getElementById('theme-toggle');
      if (btn) btn.textContent = dark ? '☀️' : '🌙';
      localStorage.setItem('pharmprep_theme', dark ? 'dark' : 'light');
    };
    applyTheme(localStorage.getItem('pharmprep_theme') === 'dark');
    document.getElementById('theme-toggle')?.addEventListener('click', () =>
      applyTheme(!document.body.classList.contains('dark'))
    );

    // ── Language toggle (Amharic / English) ──────────────
    if (typeof I18n !== 'undefined') {
      I18n.init();
      document.getElementById('lang-toggle')?.addEventListener('click', () => {
        I18n.toggleLang();
        // Re-apply greeting in correct language after switch
        const h = new Date().getHours();
        const lang = I18n.getLang();
        const greet = lang === 'am'
          ? (h < 12 ? '☀️ ደህና ጠዋት!' : h < 17 ? '🌤 ደህና ቀን!' : '🌙 ደህና ምሽት!')
          : (h < 12 ? '☀️ Good Morning!' : h < 17 ? '🌤 Good Afternoon!' : '🌙 Good Evening!');
        setEl('dash-greeting', greet);
      });
    }

    console.log('✅ PharmPrep UAE initialized');
  };

  return {
    init, navigate,
    startQuiz, startQuickPractice, advanceQuiz, selectOption,
    toggleQuizBookmark, reviewQuestion,
    renderBookmarks, removeBookmark,
    renderAnalytics, renderLibraryList,
    openDoc, deleteDoc,
    openSyncModal, applySyncCode,
    saveGeminiKey, reExtractDoc
  };
})();

// Bootstrap
document.addEventListener('DOMContentLoaded', App.init);
