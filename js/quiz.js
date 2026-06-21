// js/quiz.js — Quiz session engine v2.0
// Features: Study mode, Timed Exam (Prometric simulation), Spaced Repetition, Flag-for-review

const Quiz = (() => {
  let session = null;

  // ── Spaced Repetition weight calculator ──────────────────
  // Returns a weight (1-5): questions answered wrong recently get higher weight
  const getSpacedWeight = (questionId) => {
    const progress = Storage.getProgress();
    const p = progress[questionId];
    if (!p || p.attempts === 0) return 3; // Unseen = medium priority
    const accuracy = p.correct / p.attempts;
    const daysSinceSeen = p.lastSeen ? (Date.now() - p.lastSeen) / 86400000 : 999;
    // Low accuracy + long time since seen = highest priority
    if (accuracy < 0.4 && daysSinceSeen > 1) return 5;
    if (accuracy < 0.6) return 4;
    if (accuracy < 0.8) return 3;
    if (daysSinceSeen > 7) return 2; // Mastered but review time
    return 1; // Mastered and recently seen
  };

  // ── Build weighted question pool ─────────────────────────
  const buildPool = (options = {}) => {
    const { domain = 'ALL', difficulty = 'ALL', count = 10, mode = 'study', onlyBookmarked = false, onlyFlagged = false, smartRepeat = false } = options;

    let pool = AppData.QUESTIONS.filter(q => {
      if (domain !== 'ALL' && q.domain !== domain) return false;
      if (difficulty !== 'ALL' && q.difficulty !== difficulty) return false;
      if (onlyBookmarked && !Storage.isBookmarked(q.id)) return false;
      if (onlyFlagged && !Storage.isFlagged(q.id)) return false;
      return true;
    });

    if (smartRepeat && pool.length > 0) {
      // Spaced repetition: weighted random shuffle — weak questions appear first
      const weighted = [];
      pool.forEach(q => {
        const w = getSpacedWeight(q.id);
        for (let i = 0; i < w; i++) weighted.push(q);
      });
      // Deduplicate after weighting, preserving order
      const seen = new Set();
      const deduped = [];
      weighted.sort(() => Math.random() - 0.5).forEach(q => {
        if (!seen.has(q.id)) { seen.add(q.id); deduped.push(q); }
      });
      return deduped.slice(0, Math.min(count, deduped.length));
    }

    // Standard shuffle
    return pool.sort(() => Math.random() - 0.5).slice(0, Math.min(count, pool.length));
  };

  // ── Session lifecycle ────────────────────────────────────
  const createSession = (options = {}) => {
    const {
      domain = 'ALL',
      difficulty = 'ALL',
      count = 10,
      mode = 'study',        // 'study' | 'exam' | 'bookmarked' | 'flagged' | 'smart'
      timedSeconds = 0,      // 0 = no timer; exam mode uses 90s/question
      onlyBookmarked = false,
      onlyFlagged = false,
      smartRepeat = false
    } = options;

    const pool = buildPool({ domain, difficulty, count, mode, onlyBookmarked, onlyFlagged, smartRepeat });

    session = {
      id: Date.now(),
      mode,
      domain,
      difficulty,
      questions: pool,
      currentIndex: 0,
      answers: [],       // { questionId, domain, selected, correct, timeMs, flagged }
      flaggedIds: new Set(), // flagged for review during exam
      startTime: Date.now(),
      timerInterval: null,
      timeRemaining: timedSeconds,
      totalSeconds: timedSeconds,
      state: 'answering', // 'answering' | 'revealed' | 'complete'
      answerStart: Date.now()
    };

    return session;
  };

  const getCurrentQuestion = () => session ? session.questions[session.currentIndex] || null : null;

  const getSessionProgress = () => {
    if (!session) return null;
    return {
      current: session.currentIndex + 1,
      total: session.questions.length,
      answered: session.answers.length,
      correct: session.answers.filter(a => a.correct).length,
      flagged: session.flaggedIds.size,
      timeRemaining: session.timeRemaining
    };
  };

  // ── Answer handling ──────────────────────────────────────
  const submitAnswer = (selectedIndex) => {
    if (!session || session.state !== 'answering') return null;
    const q = getCurrentQuestion();
    const isCorrect = selectedIndex === q.correct;
    const timeMs = Date.now() - (session.answerStart || session.startTime);

    const answerRecord = {
      questionId: q.id,
      domain: q.domain,
      selected: selectedIndex,
      correct: isCorrect,
      timeMs,
      flagged: session.flaggedIds.has(q.id)
    };

    session.answers.push(answerRecord);
    session.state = 'revealed';

    // Record in persistent storage
    Storage.recordAnswer(q.id, isCorrect, q.domain, timeMs);

    return { isCorrect, correctIndex: q.correct, answer: answerRecord };
  };

  // ── Flag current question for review ────────────────────
  const toggleFlag = () => {
    if (!session) return false;
    const q = getCurrentQuestion();
    if (!q) return false;
    if (session.flaggedIds.has(q.id)) {
      session.flaggedIds.delete(q.id);
    } else {
      session.flaggedIds.add(q.id);
    }
    Storage.toggleFlag(q.id);
    return session.flaggedIds.has(q.id);
  };

  const isFlagged = (questionId) => {
    if (!session) return Storage.isFlagged(questionId);
    return session.flaggedIds.has(questionId || getCurrentQuestion()?.id);
  };

  // ── Navigation ───────────────────────────────────────────
  const nextQuestion = () => {
    if (!session) return false;
    if (session.currentIndex < session.questions.length - 1) {
      session.currentIndex++;
      session.state = 'answering';
      session.answerStart = Date.now();
      return true;
    }
    session.state = 'complete';
    return false;
  };

  const jumpToQuestion = (index) => {
    if (!session || index < 0 || index >= session.questions.length) return false;
    session.currentIndex = index;
    // In exam mode, allow revisiting but keep the previous answer
    const alreadyAnswered = session.answers.some(a => a.questionId === session.questions[index].id);
    session.state = alreadyAnswered ? 'revealed' : 'answering';
    session.answerStart = Date.now();
    return true;
  };

  const isComplete = () => {
    return session && (
      session.state === 'complete' ||
      (session.currentIndex >= session.questions.length - 1 &&
       session.state === 'revealed' &&
       session.answers.length >= session.questions.length)
    );
  };

  // ── Session summary ──────────────────────────────────────
  const getSessionSummary = () => {
    if (!session) return null;
    const total   = session.questions.length;
    const correct = session.answers.filter(a => a.correct).length;
    const durationMs = Date.now() - session.startTime;
    const avgTimeMs  = session.answers.length > 0
      ? Math.round(session.answers.reduce((s, a) => s + a.timeMs, 0) / session.answers.length)
      : 0;

    const byDomain = {};
    session.answers.forEach(a => {
      if (!byDomain[a.domain]) byDomain[a.domain] = { correct: 0, total: 0, totalTimeMs: 0 };
      byDomain[a.domain].total++;
      byDomain[a.domain].totalTimeMs += a.timeMs;
      if (a.correct) byDomain[a.domain].correct++;
    });

    // Hardest questions (wrong answers)
    const wrongAnswers = session.answers
      .filter(a => !a.correct)
      .map(a => ({
        ...a,
        question: session.questions.find(q => q.id === a.questionId)
      }))
      .filter(a => a.question);

    // Exam readiness score (weighted: accuracy 70%, speed 20%, coverage 10%)
    const accuracy  = total > 0 ? correct / total : 0;
    const speedScore = Math.min(1, 90000 / Math.max(avgTimeMs, 1000)); // 90s/question target
    const readiness = Math.round((accuracy * 0.7 + speedScore * 0.2 + Math.min(1, total / 20) * 0.1) * 100);

    return {
      total, correct,
      wrong: total - correct,
      accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
      durationMs, avgTimeMs,
      byDomain,
      wrongAnswers,
      flaggedCount: session.flaggedIds.size,
      readinessScore: readiness,
      answers: session.answers
    };
  };

  // ── Timer ────────────────────────────────────────────────
  const startTimer = (seconds, onTick, onExpire) => {
    if (!session) return;
    session.timeRemaining = seconds;
    session.totalSeconds  = seconds;
    clearInterval(session.timerInterval);
    session.timerInterval = setInterval(() => {
      session.timeRemaining--;
      onTick && onTick(session.timeRemaining);
      if (session.timeRemaining <= 0) {
        clearInterval(session.timerInterval);
        onExpire && onExpire();
      }
    }, 1000);
  };

  const stopTimer  = () => { if (session?.timerInterval) clearInterval(session.timerInterval); };
  const resetTimer = (seconds, onTick, onExpire) => { stopTimer(); startTimer(seconds, onTick, onExpire); };

  // ── Cleanup ──────────────────────────────────────────────
  const endSession = () => { stopTimer(); session = null; };
  const getSession = () => session;

  return {
    createSession, getCurrentQuestion, getSessionProgress,
    submitAnswer, nextQuestion, jumpToQuestion, isComplete,
    toggleFlag, isFlagged,
    getSessionSummary,
    startTimer, stopTimer, resetTimer,
    endSession, getSession
  };
})();

window.Quiz = Quiz;
