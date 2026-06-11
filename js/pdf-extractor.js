// js/pdf-extractor.js — Extract MCQ questions from PDFs using Gemini API

const PdfExtractor = (() => {
  const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

  // ── Get/Set Gemini API key ──────────────────────────────
  const getApiKey = () => localStorage.getItem('gemini_api_key') || '';
  const setApiKey = (key) => localStorage.setItem('gemini_api_key', key.trim());
  const hasApiKey = () => !!getApiKey();

  // ── Extract raw text from a PDF ArrayBuffer (via PDF.js) ──
  const extractTextFromPdf = async (arrayBuffer) => {
    await Reader.ensurePDFJSLoaded();
    const data = new Uint8Array(arrayBuffer.slice(0));
    const pdf = await pdfjsLib.getDocument({ data }).promise;
    const totalPages = pdf.numPages;
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const text = textContent.items.map(item => item.str).join(' ');
      pages.push({ page: i, text: text.trim() });
    }

    await pdf.destroy();
    return pages;
  };

  // ── Call Gemini API to extract MCQs from a text chunk ──
  const extractMcqsFromText = async (text, docName, apiKey) => {
    if (!text || text.trim().length < 20) return [];

    const prompt = `You are a pharmacy exam question extractor. Analyze the following text from a pharmacy study document and extract ALL multiple-choice questions (MCQs) you find.

For each MCQ found, return a JSON object with:
- "question": the question stem/text (string)
- "options": array of exactly 4 strings, each being one answer option (include the letter prefix like "A." if present)
- "correct": index (0-3) of the correct answer
- "explanation": brief explanation of why the correct answer is right (use your knowledge if not given)
- "difficulty": "easy", "medium", or "hard"
- "domain": one of: "PHARM", "CLIN", "LAW", "PHSCI", "PRAC", "CALC", "THER", "REG", "HERB"

Return ONLY a valid JSON array like: [{"question":"...","options":["A. ...","B. ...","C. ...","D. ..."],"correct":0,"explanation":"...","difficulty":"easy","domain":"PHARM"}]

If no MCQ questions are found in this text, return an empty array: []

Do NOT include any text before or after the JSON array.

Document: "${docName}"
Text to analyze:
${text.substring(0, 8000)}`;

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 8192,
          responseMimeType: 'application/json'
        }
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.error?.message || `Gemini API error ${response.status}`);
    }

    const data = await response.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || '[]';

    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      // Try to extract JSON array from response if it has extra text
      const match = raw.match(/\[[\s\S]*\]/);
      if (match) {
        try { return JSON.parse(match[0]); } catch { return []; }
      }
      return [];
    }
  };

  // ── Batch pages into chunks to reduce API calls ──────────
  const chunkPages = (pages, charsPerChunk = 6000) => {
    const chunks = [];
    let current = '';
    for (const p of pages) {
      if ((current + p.text).length > charsPerChunk && current.length > 0) {
        chunks.push(current);
        current = p.text;
      } else {
        current += (current ? '\n\n' : '') + p.text;
      }
    }
    if (current) chunks.push(current);
    return chunks;
  };

  // ── Main extraction entry point ─────────────────────────
  // onProgress(current, total, foundSoFar) callback for UI updates
  const extractQuestionsFromPdf = async (arrayBuffer, docName, docId, onProgress) => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error('No Gemini API key set. Please add it in Settings.');

    onProgress && onProgress(0, 1, 0);

    // Extract text from all pages
    const pages = await extractTextFromPdf(arrayBuffer);
    const chunks = chunkPages(pages, 6000);
    const allQuestions = [];
    const seenQuestions = new Set();

    for (let i = 0; i < chunks.length; i++) {
      onProgress && onProgress(i + 1, chunks.length, allQuestions.length);

      try {
        const questions = await extractMcqsFromText(chunks[i], docName, apiKey);

        for (const q of questions) {
          // Deduplicate by question text
          const key = q.question?.trim().toLowerCase().substring(0, 60);
          if (!key || seenQuestions.has(key)) continue;
          seenQuestions.add(key);

          // Validate structure
          if (!q.question || !Array.isArray(q.options) || q.options.length < 2) continue;

          // Ensure exactly 4 options
          while (q.options.length < 4) q.options.push('');
          q.options = q.options.slice(0, 4);

          // Ensure correct index is valid
          if (typeof q.correct !== 'number' || q.correct < 0 || q.correct >= q.options.length) {
            q.correct = 0;
          }

          allQuestions.push({
            id: `extracted_${docId}_${allQuestions.length}`,
            question: q.question.trim(),
            options: q.options.map(o => o.trim()),
            correct: q.correct,
            explanation: q.explanation || 'See source document for details.',
            difficulty: ['easy', 'medium', 'hard'].includes(q.difficulty) ? q.difficulty : 'medium',
            domain: q.domain || 'PHARM',
            source: docName,
            docId: docId,
            extractedAt: Date.now()
          });
        }
      } catch (err) {
        console.warn(`Chunk ${i + 1} extraction failed:`, err);
        // Continue with remaining chunks even if one fails
      }

      // Small delay between API calls to respect rate limits
      if (i < chunks.length - 1) {
        await new Promise(r => setTimeout(r, 500));
      }
    }

    onProgress && onProgress(chunks.length, chunks.length, allQuestions.length);
    return allQuestions;
  };

  return { extractQuestionsFromPdf, getApiKey, setApiKey, hasApiKey };
})();

window.PdfExtractor = PdfExtractor;
