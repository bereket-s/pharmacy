// js/cloud-questions.js — Store & retrieve extracted questions from Supabase
// Uses the same Supabase project. Questions are stored in the 'questions' table.
// Requires supabase-config.js to be loaded first.

const CloudQuestions = (() => {
  const TABLE = 'extracted_questions';
  const client = () => window.supabaseClient;

  const isAvailable = () =>
    typeof window.supabaseClient !== 'undefined' &&
    typeof SUPABASE_URL !== 'undefined' &&
    SUPABASE_URL !== 'YOUR_SUPABASE_PROJECT_URL';

  // ── Save extracted questions array for a document ────────
  const saveQuestionsForDoc = async (docId, docName, questions) => {
    if (!isAvailable()) {
      // Fallback to localStorage
      saveToLocal(docId, questions);
      return;
    }

    try {
      // Delete existing questions for this doc first (re-extraction)
      await client().from(TABLE).delete().eq('doc_id', docId);

      if (!questions.length) return;

      // Insert all new questions
      const rows = questions.map(q => ({
        doc_id: docId,
        doc_name: docName,
        question_id: q.id,
        question: q.question,
        options: JSON.stringify(q.options),
        correct: q.correct,
        explanation: q.explanation,
        difficulty: q.difficulty,
        domain: q.domain,
        extracted_at: new Date(q.extractedAt).toISOString()
      }));

      const { error } = await client().from(TABLE).insert(rows);
      if (error) throw error;

      // Also save to local cache
      saveToLocal(docId, questions);
    } catch (err) {
      console.warn('CloudQuestions save failed, using localStorage:', err);
      saveToLocal(docId, questions);
    }
  };

  // ── Load all extracted questions (from cloud or local) ───
  const getAllExtractedQuestions = async () => {
    if (!isAvailable()) return getFromLocal();

    try {
      const { data, error } = await client()
        .from(TABLE)
        .select('*')
        .order('extracted_at', { ascending: false });

      if (error) throw error;

      const questions = (data || []).map(row => ({
        id: row.question_id,
        question: row.question,
        options: JSON.parse(row.options || '[]'),
        correct: row.correct,
        explanation: row.explanation,
        difficulty: row.difficulty,
        domain: row.domain,
        source: row.doc_name,
        docId: row.doc_id,
        extractedAt: new Date(row.extracted_at).getTime()
      }));

      // Update local cache
      const grouped = {};
      questions.forEach(q => {
        if (!grouped[q.docId]) grouped[q.docId] = [];
        grouped[q.docId].push(q);
      });
      Object.entries(grouped).forEach(([docId, qs]) => saveToLocal(docId, qs));

      return questions;
    } catch (err) {
      console.warn('CloudQuestions load failed, using localStorage:', err);
      return getFromLocal();
    }
  };

  // ── Delete all questions for a document ──────────────────
  const deleteQuestionsForDoc = async (docId) => {
    // Remove from local
    const allLocal = JSON.parse(localStorage.getItem('pharmprep_extracted_q') || '{}');
    delete allLocal[docId];
    localStorage.setItem('pharmprep_extracted_q', JSON.stringify(allLocal));

    if (!isAvailable()) return;

    try {
      await client().from(TABLE).delete().eq('doc_id', docId);
    } catch (err) {
      console.warn('CloudQuestions delete failed:', err);
    }
  };

  // ── Get question count for a document ────────────────────
  const getQuestionCountForDoc = (docId) => {
    const allLocal = JSON.parse(localStorage.getItem('pharmprep_extracted_q') || '{}');
    return (allLocal[docId] || []).length;
  };

  // ── LocalStorage fallback helpers ────────────────────────
  const saveToLocal = (docId, questions) => {
    const all = JSON.parse(localStorage.getItem('pharmprep_extracted_q') || '{}');
    all[docId] = questions;
    try {
      localStorage.setItem('pharmprep_extracted_q', JSON.stringify(all));
    } catch (e) {
      console.warn('localStorage full, could not cache questions');
    }
  };

  const getFromLocal = () => {
    const all = JSON.parse(localStorage.getItem('pharmprep_extracted_q') || '{}');
    return Object.values(all).flat();
  };

  return {
    saveQuestionsForDoc,
    getAllExtractedQuestions,
    deleteQuestionsForDoc,
    getQuestionCountForDoc,
    isAvailable
  };
})();

window.CloudQuestions = CloudQuestions;
