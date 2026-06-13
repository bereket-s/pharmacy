// js/pdf-extractor.js — Extract MCQ questions from PDFs using Groq API (Llama 3.3 70B)

const PdfExtractor = (() => {
  const GROQ_URL   = 'https://api.groq.com/openai/v1/chat/completions';
  const GROQ_MODEL = 'llama-3.3-70b-versatile'; // State-of-the-art free model

  // ── Get/Set API key ──────────────────────────────────────
  const getApiKey = () => localStorage.getItem('gemini_api_key') || ''; // reuse same storage key
  const setApiKey = (key) => localStorage.setItem('gemini_api_key', key.trim());
  const hasApiKey = () => !!getApiKey();

  // ── Call Groq (OpenAI-compatible) ────────────────────────
  const groqRequest = async (systemPrompt, userContent, apiKey) => {
    return fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.1,
        max_tokens: 8192,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user',   content: userContent  }
        ]
      })
    });
  };

  // ── Extract raw text from a PDF ArrayBuffer (via PDF.js) ──
  const extractTextFromPdf = async (arrayBuffer) => {
    await Reader.ensurePDFJSLoaded();
    const data = new Uint8Array(arrayBuffer.slice(0));
    const pdf  = await pdfjsLib.getDocument({ data }).promise;
    const totalPages = pdf.numPages;
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      const page        = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const text        = textContent.items.map(item => item.str).join(' ');
      pages.push({ page: i, text: text.trim() });
    }

    await pdf.destroy();
    return pages;
  };

  // ── Extract MCQs from one text chunk ────────────────────
  const extractMcqsFromText = async (text, docName, apiKey) => {
    if (!text || text.trim().length < 20) return [];

    const systemPrompt = `You are an expert pharmacy exam question extractor for the UAE Pharmacy License exam. Your job is to extract multiple-choice questions (MCQs) from pharmacy study material with perfect accuracy.

Crucial Instruction: You must extract EVERYTHING testable. 
1. If the text already contains explicit MCQs, extract them.
2. If the text contains factual statements, Q&A, bullet points, or paragraphs without choices, you MUST CONVERT them into high-quality MCQs. Generate 3 plausible but incorrect distractors for the "options" array.

You MUST return ONLY a valid JSON array — no explanation, no markdown, no extra text.

Each extracted question must follow this exact schema:
[
  {
    "question": "The full question stem text",
    "options": ["A. First option", "B. Second option", "C. Third option", "D. Fourth option"],
    "correct": 0,
    "explanation": "Clear explanation of why the correct answer is right, with pharmacological reasoning",
    "difficulty": "easy",
    "domain": "PHARM"
  }
]

Rules:
- "correct" is the 0-based index: 0=A, 1=B, 2=C, 3=D. You MUST provide exactly 4 options.
- "difficulty": "easy", "medium", or "hard"
- "domain": Use one of these if it fits: PHARM, CLIN, CALC, REG, HERB, PHSCI, PRAC, THER, LAW. If the topic is entirely new (e.g., microbiology, pediatrics), invent a short 4-5 uppercase letter ID for it (e.g. MICRO, PEDS, ONCOL).
- Extract EVERY possible testable concept as an MCQ — do not skip any information.
- If the correct answer is explicitly stated, use it. Otherwise use your pharmacology knowledge to identify the correct answer and plausible distractors.
- Write detailed explanations (2-3 sentences) using your medical knowledge.
- If there is absolutely no testable medical/pharmacy content, return exactly: []`;

    const userContent = `Document: "${docName}"

Extract all MCQ questions from this text:

${text.substring(0, 8000)}`;

    const response = await groqRequest(systemPrompt, userContent, apiKey);

    if (!response.ok) {
      const errBody = await response.text().catch(() => '');
      console.error('Groq API error:', response.status, errBody);
      let msg = `HTTP ${response.status}`;
      try { msg = JSON.parse(errBody)?.error?.message || msg; } catch {}
      throw new Error(msg);
    }

    const data = await response.json();
    const raw  = data?.choices?.[0]?.message?.content || '';

    console.log('Groq response (first 300 chars):', raw.slice(0, 300));

    if (!raw) return [];

    // Try direct parse
    try {
      const parsed = JSON.parse(raw.trim());
      return Array.isArray(parsed) ? parsed : [];
    } catch { /* fall through */ }

    // Strip markdown fences ```json ... ```
    const stripped = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/,'').trim();
    try {
      const parsed = JSON.parse(stripped);
      return Array.isArray(parsed) ? parsed : [];
    } catch { /* fall through */ }

    // Find first JSON array in response
    const match = stripped.match(/\[[\s\S]*\]/);
    if (match) {
      try { return JSON.parse(match[0]); } catch { /* fall through */ }
    }

    console.warn('Could not parse Groq response as JSON:', raw.slice(0, 500));
    return [];
  };

  // ── Batch pages into chunks ──────────────────────────────
  const chunkPages = (pages, charsPerChunk = 8000) => {
    const chunks = [];
    let current  = '';
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

  // ── Main extraction entry point ──────────────────────────
  const extractQuestionsFromPdf = async (arrayBuffer, docName, docId, onProgress) => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error('No API key set. Please add your Groq key in Settings.');

    onProgress && onProgress(0, 1, 0);

    const pages      = await extractTextFromPdf(arrayBuffer);
    const totalPages = pages.length;
    const chunks     = chunkPages(pages, 8000);  // larger chunks = fewer API calls
    const allQuestions   = [];
    const seenQuestions  = new Set();
    let failedChunks     = 0;
    let duplicatesSkipped = 0;

    for (let i = 0; i < chunks.length; i++) {
      onProgress && onProgress(i + 1, chunks.length, allQuestions.length);

      let chunkSuccess = false;
      let retries = 0;
      const maxRetries = 3;

      while (!chunkSuccess && retries <= maxRetries) {
        try {
          const questions = await extractMcqsFromText(chunks[i], docName, apiKey);

          for (const q of questions) {
            const key = q.question?.trim().toLowerCase().substring(0, 60);
            if (!key || seenQuestions.has(key)) { duplicatesSkipped++; continue; }
            seenQuestions.add(key);

            if (!q.question || !Array.isArray(q.options) || q.options.length < 2) continue;

            while (q.options.length < 4) q.options.push('');
            q.options = q.options.slice(0, 4);

            if (typeof q.correct !== 'number' || q.correct < 0 || q.correct >= q.options.length) {
              q.correct = 0;
            }

            allQuestions.push({
              id:          `extracted_${docId}_${allQuestions.length}`,
              question:    q.question.trim(),
              options:     q.options.map(o => o.trim()),
              correct:     q.correct,
              explanation: q.explanation || 'See source document for details.',
              difficulty:  ['easy','medium','hard'].includes(q.difficulty) ? q.difficulty : 'medium',
              domain:      q.domain ? q.domain.toUpperCase().substring(0, 5) : 'PHARM',
              source:      docName,
              docId,
              extractedAt: Date.now()
            });
          }
          chunkSuccess = true; // Success! Break the retry loop.
        } catch (err) {
          if (err.message.includes('429') || err.message.includes('Rate limit')) {
            retries++;
            if (retries <= maxRetries) {
              const backoff = Math.pow(2, retries) * 2000; // 4s, 8s, 16s
              console.warn(`Rate limited on chunk ${i + 1}. Retrying in ${backoff}ms...`);
              await new Promise(r => setTimeout(r, backoff));
            } else {
              console.error(`Chunk ${i + 1} failed after ${maxRetries} retries:`, err);
              failedChunks++;
            }
          } else {
            console.warn(`Chunk ${i + 1} failed with non-retryable error:`, err);
            failedChunks++;
            break; // Break the retry loop for non-429 errors
          }
        }
      }

      // Groq free tier: 30 RPM — 2500ms delay between chunks ensures we stay safely under limit
      if (i < chunks.length - 1) {
        await new Promise(r => setTimeout(r, 2500));
      }
    }


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
        docId, docName, totalPages,
        chunksProcessed: chunks.length,
        failedChunks, duplicatesSkipped,
        totalFound: allQuestions.length,
        qualityScore,
        extractedAt: Date.now()
      }
    };
  };

  return { extractQuestionsFromPdf, getApiKey, setApiKey, hasApiKey };
})();

window.PdfExtractor = PdfExtractor;
