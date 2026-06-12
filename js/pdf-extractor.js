// js/pdf-extractor.js — Extract MCQ questions from PDFs using Gemini API

const PdfExtractor = (() => {
  // Proxy URL — Supabase Edge Function handles Gemini call server-side
  const PROXY_URL = 'https://wtqkxdwilfpyuflresft.supabase.co/functions/v1/gemini-proxy';
  // Supabase anon key — safe to expose, needed for Edge Function JWT auth
  const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0cWt4ZHdpbGZweXVmbHJlc2Z0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMzYxOTgsImV4cCI6MjA5NTkxMjE5OH0.4A49bgexXUBB9qC7qB0C7jIYt4bmzQS_EJbT3UMHEDI';

  // ── Get/Set Gemini API key ──────────────────────────────
  const getApiKey = () => localStorage.getItem('gemini_api_key') || '';
  const setApiKey = (key) => localStorage.setItem('gemini_api_key', key.trim());
  const hasApiKey = () => !!getApiKey();

  // ── Call the Supabase proxy (no CORS issues, key never exposed in browser) ─
  const geminiRequest = async (prompt, apiKey) => {
    return fetch(PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON}`
      },
      body: JSON.stringify({
        apiKey,
        model: 'gemini-1.5-flash',
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 8192 }
      })
    });
  };

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

    const prompt = `You are a pharmacy exam question extractor. Analyze the following text from a pharmacy study document called "${docName}".

Extract ALL multiple-choice questions (MCQs) from this text. These are questions with 4 options labeled A, B, C, D (or 1,2,3,4).

Return ONLY a JSON array. Each item must have:
{
  "question": "the full question text",
  "options": ["A. option text", "B. option text", "C. option text", "D. option text"],
  "correct": 0,
  "explanation": "why this answer is correct",
  "difficulty": "easy" or "medium" or "hard",
  "domain": "PHARM" or "CLIN" or "CALC" or "REG" or "HERB"
}

Rules:
- "correct" is 0 for A, 1 for B, 2 for C, 3 for D
- Domain guide: PHARM=drug mechanisms/side effects, CLIN=clinical cases/dosing, CALC=calculations/pharmacokinetics, REG=laws/regulations, HERB=herbal
- If no MCQs found, return []
- Return ONLY the JSON array, no other text

Text to analyze:
${text.substring(0, 7000)}`;

    const response = await geminiRequest(prompt, apiKey);

    if (!response.ok) {
      const errBody = await response.text().catch(() => '');
      console.error('Gemini API error:', response.status, errBody);
      let msg = `HTTP ${response.status}`;
      try { msg = JSON.parse(errBody)?.error?.message || msg; } catch {}
      throw new Error(msg);
    }

    const data = await response.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    console.log('Gemini raw response (first 300 chars):', raw.slice(0, 300));

    if (!raw) {
      console.warn('Empty response from Gemini');
      return [];
    }

    // Try direct parse first
    try {
      const parsed = JSON.parse(raw.trim());
      return Array.isArray(parsed) ? parsed : [];
    } catch { /* fall through */ }

    // Strip markdown code fences (```json ... ``` or ``` ... ```)
    const stripped = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();
    try {
      const parsed = JSON.parse(stripped);
      return Array.isArray(parsed) ? parsed : [];
    } catch { /* fall through */ }

    // Find first JSON array in the response
    const match = stripped.match(/\[[\s\S]*\]/);
    if (match) {
      try { return JSON.parse(match[0]); } catch { /* fall through */ }
    }

    console.warn('Could not parse Gemini response as JSON:', raw.slice(0, 500));
    return [];
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
    const totalPages = pages.length;
    const chunks = chunkPages(pages, 6000);
    const allQuestions = [];
    const seenQuestions = new Set();
    let failedChunks = 0;
    let duplicatesSkipped = 0;
    let rawExtracted = 0; // before dedup/validation

    for (let i = 0; i < chunks.length; i++) {
      onProgress && onProgress(i + 1, chunks.length, allQuestions.length);

      try {
        const questions = await extractMcqsFromText(chunks[i], docName, apiKey);
        rawExtracted += questions.length;

        for (const q of questions) {
          // Deduplicate by question text
          const key = q.question?.trim().toLowerCase().substring(0, 60);
          if (!key || seenQuestions.has(key)) { duplicatesSkipped++; continue; }
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
        failedChunks++;
      }

      // Small delay between API calls to respect rate limits
      if (i < chunks.length - 1) {
        await new Promise(r => setTimeout(r, 500));
      }
    }

    // Quality score: % of questions with all 4 non-empty options + a real explanation
    const qualityScore = allQuestions.length === 0 ? 0 : Math.round(
      (allQuestions.filter(q =>
        q.options.every(o => o.trim().length > 0) &&
        q.explanation &&
        q.explanation !== 'See source document for details.'
      ).length / allQuestions.length) * 100
    );

    onProgress && onProgress(chunks.length, chunks.length, allQuestions.length);

    return {
      questions: allQuestions,
      meta: {
        docId,
        docName,
        totalPages,
        chunksProcessed: chunks.length,
        failedChunks,
        duplicatesSkipped,
        totalFound: allQuestions.length,
        qualityScore,
        extractedAt: Date.now()
      }
    };
  };

  return { extractQuestionsFromPdf, getApiKey, setApiKey, hasApiKey };
})();

window.PdfExtractor = PdfExtractor;
