// js/storage.js — LocalStorage abstraction for progress, bookmarks, and streak

const Storage = (() => {
  const PREFIX = 'pharmprep_';

  const get = (key, fallback = null) => {
    try {
      const val = localStorage.getItem(PREFIX + key);
      return val !== null ? JSON.parse(val) : fallback;
    } catch { return fallback; }
  };

  const set = (key, value) => {
    try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); }
    catch (e) { console.warn('Storage write failed:', e); }
  };

  // ── Progress tracking ───────────────────────────────────
  const getProgress = () => get('progress', {});

  const recordAnswer = (questionId, isCorrect, domain) => {
    const progress = getProgress();
    if (!progress[questionId]) {
      progress[questionId] = { attempts: 0, correct: 0, lastSeen: null };
    }
    progress[questionId].attempts++;
    if (isCorrect) progress[questionId].correct++;
    progress[questionId].lastSeen = Date.now();
    set('progress', progress);

    // Update domain stats
    const domainStats = getDomainStats();
    if (!domainStats[domain]) domainStats[domain] = { attempts: 0, correct: 0 };
    domainStats[domain].attempts++;
    if (isCorrect) domainStats[domain].correct++;
    set('domainStats', domainStats);

    // Update daily history
    updateDailyHistory(isCorrect);
  };

  const getDomainStats = () => get('domainStats', {});

  const getQuestionProgress = (questionId) => {
    const progress = getProgress();
    return progress[questionId] || null;
  };

  // ── Bookmarks ───────────────────────────────────────────
  const getBookmarks = () => get('bookmarks', []);

  const toggleBookmark = (questionId) => {
    const bookmarks = getBookmarks();
    const idx = bookmarks.indexOf(questionId);
    if (idx === -1) {
      bookmarks.push(questionId);
    } else {
      bookmarks.splice(idx, 1);
    }
    set('bookmarks', bookmarks);
    return bookmarks.includes(questionId);
  };

  const isBookmarked = (questionId) => getBookmarks().includes(questionId);

  // ── Streak ──────────────────────────────────────────────
  const getStreak = () => get('streak', { count: 0, lastDate: null });

  const updateStreak = () => {
    const streak = getStreak();
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (streak.lastDate === today) return streak.count;
    if (streak.lastDate === yesterday) {
      streak.count++;
    } else {
      streak.count = 1;
    }
    streak.lastDate = today;
    set('streak', streak);
    return streak.count;
  };

  // ── Daily History ───────────────────────────────────────
  const updateDailyHistory = (isCorrect) => {
    const today = new Date().toISOString().split('T')[0];
    const history = get('dailyHistory', {});
    if (!history[today]) history[today] = { answered: 0, correct: 0 };
    history[today].answered++;
    if (isCorrect) history[today].correct++;
    set('dailyHistory', history);
    updateStreak();
  };

  const getDailyHistory = () => get('dailyHistory', {});

  const getTodayStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const history = getDailyHistory();
    return history[today] || { answered: 0, correct: 0 };
  };

  // ── Totals ──────────────────────────────────────────────
  const getTotalStats = () => {
    const progress = getProgress();
    let totalAnswered = 0, totalCorrect = 0;
    Object.values(progress).forEach(p => {
      totalAnswered += p.attempts;
      totalCorrect += p.correct;
    });
    return { totalAnswered, totalCorrect };
  };

  // ── Reference Library ───────────────────────────────────
  const getLibraryMeta = () => get('libraryMeta', []);

  const saveLibraryMeta = (meta) => set('libraryMeta', meta);

  const addLibraryItem = (item) => {
    const meta = getLibraryMeta();
    const existing = meta.findIndex(m => m.id === item.id);
    if (existing >= 0) {
      meta[existing] = { ...meta[existing], ...item };
    } else {
      meta.push(item);
    }
    saveLibraryMeta(meta);
  };

  const updateReadingProgress = (id, page) => {
    const meta = getLibraryMeta();
    const item = meta.find(m => m.id === id);
    if (item) {
      item.lastPage = page;
      item.lastRead = Date.now();
      saveLibraryMeta(meta);
    }
  };

  const removeLibraryItem = (id) => {
    const meta = getLibraryMeta().filter(m => m.id !== id);
    saveLibraryMeta(meta);
  };

  // ── Settings ────────────────────────────────────────────
  const getSettings = () => get('settings', {
    quizTimer: true,
    timerSeconds: 90,
    showExplanationAfterEach: true,
    defaultDomain: 'ALL'
  });

  const saveSettings = (settings) => set('settings', settings);

  // ── Clear all data ──────────────────────────────────────
  const clearAll = () => {
    ['progress', 'domainStats', 'bookmarks', 'streak', 'dailyHistory', 'settings'].forEach(k => {
      localStorage.removeItem(PREFIX + k);
    });
  };

  return {
    recordAnswer, getProgress, getDomainStats, getQuestionProgress,
    getBookmarks, toggleBookmark, isBookmarked,
    getStreak, updateStreak,
    getDailyHistory, getTodayStats, getTotalStats,
    getLibraryMeta, addLibraryItem, updateReadingProgress, removeLibraryItem,
    getSettings, saveSettings,
    clearAll
  };
})();

window.Storage = Storage;
