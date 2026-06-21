// js/storage.js — LocalStorage abstraction v2.0
// Tracks: progress, bookmarks, flags, streak, domain stats, sessions

const Storage = (() => {
  const PREFIX = 'pharmprep_';

  const get = (key, fallback = null) => {
    try { const v = localStorage.getItem(PREFIX + key); return v !== null ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  };
  const set = (key, value) => {
    try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); }
    catch (e) { console.warn('Storage write failed:', e); }
  };

  // ── Progress tracking (per question) ───────────────────
  const getProgress = () => get('progress', {});

  const recordAnswer = (questionId, isCorrect, domain, timeMs = 0) => {
    const progress = getProgress();
    if (!progress[questionId]) {
      progress[questionId] = { attempts: 0, correct: 0, lastSeen: null, avgTimeMs: 0, streak: 0 };
    }
    const p = progress[questionId];
    p.attempts++;
    if (isCorrect) {
      p.correct++;
      p.streak = (p.streak || 0) + 1;
    } else {
      p.streak = 0;
    }
    p.lastSeen = Date.now();
    p.avgTimeMs = p.avgTimeMs ? Math.round((p.avgTimeMs + timeMs) / 2) : timeMs;
    set('progress', progress);

    // Update domain stats
    const domainStats = getDomainStats();
    if (!domainStats[domain]) domainStats[domain] = { attempts: 0, correct: 0 };
    domainStats[domain].attempts++;
    if (isCorrect) domainStats[domain].correct++;
    set('domainStats', domainStats);

    updateDailyHistory(isCorrect);
  };

  const getDomainStats    = () => get('domainStats', {});
  const getQuestionProgress = (id) => { const p = getProgress(); return p[id] || null; };

  // ── Bookmarks ───────────────────────────────────────────
  const getBookmarks  = () => get('bookmarks', []);
  const isBookmarked  = (id) => getBookmarks().includes(id);
  const toggleBookmark = (id) => {
    const b = getBookmarks();
    const i = b.indexOf(id);
    if (i === -1) b.push(id); else b.splice(i, 1);
    set('bookmarks', b);
    return b.includes(id);
  };

  // ── Flags (mark for review during exam) ────────────────
  const getFlags  = () => get('flags', []);
  const isFlagged = (id) => getFlags().includes(id);
  const toggleFlag = (id) => {
    const f = getFlags();
    const i = f.indexOf(id);
    if (i === -1) f.push(id); else f.splice(i, 1);
    set('flags', f);
    return f.includes(id);
  };
  const clearFlags = () => set('flags', []);

  // ── Streak ──────────────────────────────────────────────
  const getStreak = () => get('streak', { count: 0, lastDate: null });
  const updateStreak = () => {
    const streak = getStreak();
    const today     = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (streak.lastDate === today) return streak.count;
    streak.count = streak.lastDate === yesterday ? streak.count + 1 : 1;
    streak.lastDate = today;
    set('streak', streak);
    return streak.count;
  };

  // ── Daily history ────────────────────────────────────────
  const updateDailyHistory = (isCorrect) => {
    const today = new Date().toISOString().split('T')[0];
    const h = get('dailyHistory', {});
    if (!h[today]) h[today] = { answered: 0, correct: 0 };
    h[today].answered++;
    if (isCorrect) h[today].correct++;
    set('dailyHistory', h);
    updateStreak();
  };
  const getDailyHistory = () => get('dailyHistory', {});
  const getTodayStats   = () => {
    const today = new Date().toISOString().split('T')[0];
    return getDailyHistory()[today] || { answered: 0, correct: 0 };
  };

  // ── Totals ───────────────────────────────────────────────
  const getTotalStats = () => {
    const progress = getProgress();
    let totalAnswered = 0, totalCorrect = 0;
    Object.values(progress).forEach(p => { totalAnswered += p.attempts; totalCorrect += p.correct; });
    return { totalAnswered, totalCorrect };
  };

  // ── Session history (past exams) ─────────────────────────
  const saveSessionResult = (summary) => {
    const history = get('sessionHistory', []);
    history.unshift({ ...summary, savedAt: Date.now() });
    if (history.length > 50) history.pop(); // Keep last 50 sessions
    set('sessionHistory', history);
  };
  const getSessionHistory = () => get('sessionHistory', []);

  // ── Exam Readiness Score ─────────────────────────────────
  const getReadinessScore = () => {
    const { totalAnswered, totalCorrect } = getTotalStats();
    if (totalAnswered === 0) return 0;
    const domainStats = getDomainStats();
    const domains = Object.values(domainStats);
    const coveredDomains = domains.filter(d => d.attempts >= 5).length;
    const accuracy = totalCorrect / totalAnswered;
    const coverage = Math.min(1, coveredDomains / 9); // 9 official domains
    return Math.round((accuracy * 0.7 + coverage * 0.3) * 100);
  };

  // ── Reference Library ────────────────────────────────────
  const getLibraryMeta = ()        => get('libraryMeta', []);
  const saveLibraryMeta = (meta)   => set('libraryMeta', meta);
  const addLibraryItem = (item)    => {
    const meta = getLibraryMeta();
    const idx = meta.findIndex(m => m.id === item.id);
    if (idx >= 0) meta[idx] = { ...meta[idx], ...item }; else meta.push(item);
    saveLibraryMeta(meta);
  };
  const updateReadingProgress = (id, page) => {
    const meta = getLibraryMeta();
    const item = meta.find(m => m.id === id);
    if (item) { item.lastPage = page; item.lastRead = Date.now(); saveLibraryMeta(meta); }
  };
  const removeLibraryItem = (id) => saveLibraryMeta(getLibraryMeta().filter(m => m.id !== id));

  // ── Extraction History ────────────────────────────────────
  const saveExtractionHistory = (meta) => {
    const h = get('extractionHistory', []);
    h.unshift(meta);
    if (h.length > 100) h.pop();
    set('extractionHistory', h);
  };
  const getExtractionHistory = () => get('extractionHistory', []);

  // ── Settings ─────────────────────────────────────────────
  const getSettings  = () => get('settings', {
    quizTimer: true, timerSeconds: 90,
    showExplanationAfterEach: true, defaultDomain: 'ALL',
    prometricMode: false, smartRepeat: true
  });
  const saveSettings = (s) => set('settings', s);

  // ── Clear all data ────────────────────────────────────────
  const clearAll = () => {
    ['progress', 'domainStats', 'bookmarks', 'flags', 'streak', 'dailyHistory',
     'settings', 'sessionHistory', 'extractionHistory'].forEach(k => localStorage.removeItem(PREFIX + k));
  };

  return {
    recordAnswer, getProgress, getDomainStats, getQuestionProgress,
    getBookmarks, toggleBookmark, isBookmarked,
    getFlags, toggleFlag, isFlagged, clearFlags,
    getStreak, updateStreak,
    getDailyHistory, getTodayStats, getTotalStats,
    saveSessionResult, getSessionHistory,
    getReadinessScore,
    getLibraryMeta, addLibraryItem, updateReadingProgress, removeLibraryItem,
    saveExtractionHistory, getExtractionHistory,
    getSettings, saveSettings,
    clearAll
  };
})();

window.Storage = Storage;
