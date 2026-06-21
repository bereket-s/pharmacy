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

    const systemPrompt = `You are a highly accurate UAE Pharmacy License exam question extractor. This app is used by pharmacists preparing for the UAE Prometric Pharmacy exam (administered by MOHAP, DHA, and DOH). All questions MUST be 100% aligned with UAE pharmacy practice, UAE drug law, and international clinical guidelines.

CRITICAL UAE CONTEXT RULES — YOU MUST FOLLOW ALL OF THESE:
1. This is for the UAE Pharmacy License exam. NEVER reference Saudi Arabia, Saudi MOH, SCFHS, Kingdom of Saudi Arabia, or KSA. Replace any such reference with the UAE equivalent: use MOHAP (Ministry of Health and Prevention), DHA (Dubai Health Authority), or DOH (Department of Health Abu Dhabi).
2. UAE Drug Scheduling: Schedule 1 = most dangerous (e.g., heroin), Schedule 4 = OTC. Controlled substances require triplicate prescription in the UAE.
3. UAE Pharmacy Law context: Pharmacists must be licensed by MOHAP. A pharmacy must have a licensed pharmacist on-site at all times.
4. If a text contains a question mentioning a non-UAE country's specific laws/procedures, adapt it to UAE context or SKIP it entirely.

EXTRACTION INSTRUCTIONS:
1. Extract ALL explicit MCQ questions found in the text.
2. Convert facts, bullet points, Q&A, paragraphs into high-quality MCQs — generate 3 plausible wrong distractors.
3. Verify every correct answer using your pharmacological knowledge. Do NOT guess — if you are unsure, mark difficulty as "hard".
4. Explanations must be detailed, accurate, and use correct pharmacological reasoning (2-3 sentences).

You MUST return ONLY a valid JSON array — no explanation, no markdown, no extra text.

Schema:
[
  {
    "question": "The full question stem text",
    "options": ["A. First option", "B. Second option", "C. Third option", "D. Fourth option"],
    "correct": 0,
    "explanation": "Detailed pharmacological explanation of why the correct answer is right",
    "difficulty": "easy",
    "domain": "PHARM"
  }
]

Rules:
- "correct": 0-based index (0=A, 1=B, 2=C, 3=D). MUST provide exactly 4 options per question.
- "difficulty": "easy", "medium", or "hard"
- "domain": PHARM (mechanisms/pharmacology), CLIN (clinical cases/patient management), CALC (calculations/pharmacokinetics), REG (UAE regulations/law/MOHAP/DHA), HERB (herbal/alternative), PHSCI (pharmaceutical sciences), PRAC (pharmacy practice/dispensing), THER (therapeutics/disease management), LAW (drug scheduling/controlled substances). If a topic does not fit any, invent a short 4-5 uppercase ID (e.g., MICRO, PEDS, ONCOL, IMMUN).
- If there is no testable pharmacy content, return exactly: []`;

    const userContent = `Document: "${docName}"

Extract all testable pharmacy MCQ questions from this text. Remember: this is for UAE Pharmacy License exam preparation. Adapt any non-UAE regulatory references to UAE context (MOHAP/DHA/DOH):

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

            // ── UAE Quality Filter ───────────────────────────────
            // Reject questions that are Saudi-specific and cannot be adapted
            const nonUAEPattern = /\b(Saudi Arabia|Kingdom of Saudi|KSA|SCFHS|Saudi MOH|Saudi Commission)\b/i;
            const questionText = q.question + ' ' + (q.explanation || '');
            if (nonUAEPattern.test(questionText)) {
              console.warn('Rejected non-UAE question:', q.question.substring(0, 80));
              duplicatesSkipped++;
              continue;
            }

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
