// js/quiz.js — Quiz session engine

const Quiz = (() => {
  let session = null;

  // ── Session lifecycle ───────────────────────────────────
  const createSession = (options = {}) => {
    const {
      domain = 'ALL',
      difficulty = 'ALL',
      count = 10,
      mode = 'study' // 'study' | 'exam'
    } = options;

    let pool = AppData.QUESTIONS.filter(q => {
      const domainMatch = domain === 'ALL' || q.domain === domain;
      const diffMatch = difficulty === 'ALL' || q.difficulty === difficulty;
      return domainMatch && diffMatch;
    });

    // Shuffle pool
    pool = pool.sort(() => Math.random() - 0.5).slice(0, Math.min(count, pool.length));

    session = {
      id: Date.now(),
      mode,
      domain,
      difficulty,
      questions: pool,
      currentIndex: 0,
      answers: [],       // { questionId, selected, correct, timeMs }
      startTime: Date.now(),
      timerInterval: null,
      timeRemaining: 0,
      state: 'answering' // 'answering' | 'revealed' | 'complete'
    };

    return session;
  };

  const getCurrentQuestion = () => {
    if (!session) return null;
    return session.questions[session.currentIndex] || null;
  };

  const getSessionProgress = () => {
    if (!session) return null;
    return {
      current: session.currentIndex + 1,
      total: session.questions.length,
      answered: session.answers.length,
      correct: session.answers.filter(a => a.correct).length
    };
  };

  // ── Answer handling ─────────────────────────────────────
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
      timeMs
    };

    session.answers.push(answerRecord);
    session.state = 'revealed';

    // Record in storage
    Storage.recordAnswer(q.id, isCorrect, q.domain);

    return { isCorrect, correctIndex: q.correct, answer: answerRecord };
  };

  // ── Navigation ──────────────────────────────────────────
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

  const isComplete = () => {
    return session && (
      session.state === 'complete' ||
      session.currentIndex >= session.questions.length - 1 && session.state === 'revealed' &&
      session.answers.length >= session.questions.length
    );
  };

  // ── Session summary ─────────────────────────────────────
  const getSessionSummary = () => {
    if (!session) return null;
    const total = session.questions.length;
    const correct = session.answers.filter(a => a.correct).length;
    const durationMs = Date.now() - session.startTime;

    // Breakdown by domain
    const byDomain = {};
    session.answers.forEach(a => {
      if (!byDomain[a.domain]) byDomain[a.domain] = { correct: 0, total: 0 };
      byDomain[a.domain].total++;
      if (a.correct) byDomain[a.domain].correct++;
    });

    return {
      total,
      correct,
      wrong: total - correct,
      accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
      durationMs,
      byDomain,
      answers: session.answers
    };
  };

  // ── Timer ───────────────────────────────────────────────
  const startTimer = (seconds, onTick, onExpire) => {
    if (!session) return;
    session.timeRemaining = seconds;
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

  const stopTimer = () => {
    if (session && session.timerInterval) {
      clearInterval(session.timerInterval);
    }
  };

  const resetTimer = (seconds, onTick, onExpire) => {
    stopTimer();
    startTimer(seconds, onTick, onExpire);
  };

  // ── Cleanup ─────────────────────────────────────────────
  const endSession = () => {
    stopTimer();
    session = null;
  };

  const getSession = () => session;

  return {
    createSession, getCurrentQuestion, getSessionProgress,
    submitAnswer, nextQuestion, isComplete,
    getSessionSummary,
    startTimer, stopTimer, resetTimer,
    endSession, getSession
  };
})();

window.Quiz = Quiz;
