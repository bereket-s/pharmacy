// js/pdf-extractor.js — UAE Pharmacy License Exam — Advanced AI Extraction Engine v2.0
// Model: Llama 3.3 70B via Groq API (OpenAI-compatible)

const PdfExtractor = (() => {
  const GROQ_URL   = 'https://api.groq.com/openai/v1/chat/completions';
  const GROQ_MODEL = 'llama-3.3-70b-versatile';

  const getApiKey = () => localStorage.getItem('gemini_api_key') || '';
  const setApiKey = (key) => localStorage.setItem('gemini_api_key', key.trim());
  const hasApiKey = () => !!getApiKey();

  // ── Groq API call ─────────────────────────────────────────
  const groqRequest = async (systemPrompt, userContent, apiKey, maxTokens = 8192) => {
    return fetch(GROQ_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.05,   // Very low temperature = more deterministic, accurate answers
        max_tokens: maxTokens,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user',   content: userContent  }
        ]
      })
    });
  };

  // ── Extract raw text from PDF via PDF.js ──────────────────
  const extractTextFromPdf = async (arrayBuffer) => {
    await Reader.ensurePDFJSLoaded();
    const data = new Uint8Array(arrayBuffer.slice(0));
    const pdf  = await pdfjsLib.getDocument({ data }).promise;
    const pages = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page        = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      // Preserve layout: join items with space, items starting with newline get separator
      const text = textContent.items.map(item => item.str).join(' ').trim();
      if (text.length > 10) pages.push({ page: i, text });
    }
    await pdf.destroy();
    return pages;
  };

  // ── System Prompt — UAE Pharmacy License Exam Extractor ───
  const buildSystemPrompt = () => `You are a senior UAE Pharmacy License exam coach and question writer. You extract and create high-quality MCQ questions for pharmacists preparing for the UAE Prometric Pharmacy exam (administered by MOHAP, DHA, and DOH Abu Dhabi).

=== UAE EXAM CONTEXT (MANDATORY) ===
- Regulatory authority: MOHAP (Ministry of Health & Prevention) — federal UAE body
- Emirate-level: DHA (Dubai), DOH (Abu Dhabi), Sharjah Health Authority
- UAE Drug Schedules: Schedule I (very high abuse/dangerous, e.g., heroin), Schedule II (high abuse, e.g., morphine, strong opioids), Schedule III (moderate abuse, e.g., codeine combinations), Schedule IV (low abuse, e.g., benzodiazepines), Schedule V (OTC preparations)
- Controlled substances in UAE: require triplicate prescriptions, strict record-keeping
- NEVER reference Saudi Arabia, SCFHS, KSA, or Saudi MOH — if found in source, REPLACE with UAE equivalents
- Clinical guidelines: Use international (WHO, GINA, JNC, ESC, AHA) guidelines unless UAE-specific guidance exists

=== EXTRACTION RULES ===
1. Extract EVERY explicit MCQ question in the text — do not skip any
2. Convert ALL factual content (facts, bullet points, tables, Q&A pairs, numbered lists) into full MCQs
3. For converted facts: write a clear clinical question stem, then generate 3 plausible but incorrect distractors
4. Verify every answer with your pharmacological knowledge — if uncertain, set difficulty to "hard"
5. Explanations: minimum 2 sentences, include mechanism of action, clinical reasoning, or UAE regulatory rationale

=== FEW-SHOT EXAMPLES ===
Input fact: "Salbutamol is a short-acting beta-2 agonist used as rescue therapy in asthma."
Output MCQ:
{"question":"Which statement BEST describes the mechanism and clinical role of salbutamol in asthma management?","options":["A. It is a long-acting beta-2 agonist used for daily maintenance therapy","B. It is a short-acting beta-2 agonist used as rescue (reliever) therapy for acute bronchospasm","C. It is an inhaled corticosteroid that reduces airway inflammation","D. It is a leukotriene receptor antagonist used for prophylaxis"],"correct":1,"explanation":"Salbutamol (albuterol) is a selective short-acting beta-2 agonist (SABA). It rapidly bronchodilates by stimulating B2 receptors in bronchial smooth muscle, with onset in 5 minutes and duration of 4-6 hours. It is the first-line rescue medication for acute asthma attacks and exercise-induced bronchoconstriction — NOT for maintenance therapy (LABAs serve that role).","difficulty":"easy","domain":"PHARM"}

Input MCQ: "Q: What is the antidote for heparin overdose? A) Protamine sulfate B) Vitamin K C) Naloxone D) Flumazenil — Answer: A"
Output MCQ:
{"question":"A patient on IV heparin infusion develops severe bleeding. Which agent should be administered immediately as the specific antidote?","options":["A. Protamine sulfate","B. Vitamin K (phytomenadione)","C. Naloxone","D. Flumazenil"],"correct":0,"explanation":"Protamine sulfate is the specific antidote for heparin overdose. It is a positively charged protein that binds to negatively charged heparin, forming an inactive complex. Vitamin K reverses warfarin (not heparin); Naloxone reverses opioids; Flumazenil reverses benzodiazepines. Dose: 1 mg protamine per 100 units heparin given in the last 2-4 hours.","difficulty":"medium","domain":"CLIN"}

=== OUTPUT FORMAT ===
Return ONLY a valid JSON array. No markdown. No explanation. No extra text.
[
  {
    "question": "Full question stem",
    "options": ["A. Option","B. Option","C. Option","D. Option"],
    "correct": 0,
    "explanation": "Detailed, accurate pharmacological explanation (2-3 sentences)",
    "difficulty": "easy|medium|hard",
    "domain": "PHARM|CLIN|CALC|REG|HERB|PHSCI|PRAC|THER|LAW|MICRO|PEDS|ONCOL|IMMUN|CARD|ENDO|RENAL|GI|NEURO|PSYCH|DERM|HEMA"
  }
]

If the text contains no pharmacy content, return: []`;

  // ── Parse Groq response to JSON array ────────────────────
  const parseGroqJson = (raw) => {
    if (!raw || !raw.trim()) return [];
    // Direct parse
    try { const p = JSON.parse(raw.trim()); return Array.isArray(p) ? p : []; } catch {}
    // Strip markdown fences
    const stripped = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();
    try { const p = JSON.parse(stripped); return Array.isArray(p) ? p : []; } catch {}
    // Extract first JSON array
    const m = stripped.match(/\[[\s\S]*\]/);
    if (m) { try { return JSON.parse(m[0]); } catch {} }
    console.warn('Could not parse Groq JSON:', raw.slice(0, 300));
    return [];
  };

  // ── UAE Quality Filter ────────────────────────────────────
  const UAE_BLOCKLIST = /\b(Saudi Arabia|Kingdom of Saudi|KSA|SCFHS|Saudi MOH|Saudi Commission|Saudi Board)\b/i;

  const isValidQuestion = (q) => {
    if (!q.question || typeof q.question !== 'string' || q.question.trim().length < 10) return false;
    if (!Array.isArray(q.options) || q.options.length < 4) return false;
    if (typeof q.correct !== 'number' || q.correct < 0 || q.correct >= q.options.length) return false;
    // Reject Saudi-specific questions
    const fullText = q.question + ' ' + (q.explanation || '') + ' ' + q.options.join(' ');
    if (UAE_BLOCKLIST.test(fullText)) {
      console.warn('[UAE Filter] Rejected non-UAE question:', q.question.substring(0, 80));
      return false;
    }
    return true;
  };

  // ── Call Groq with retry & rate-limit backoff ─────────────
  const groqWithRetry = async (systemPrompt, userContent, apiKey, maxRetries = 3) => {
    let retries = 0;
    while (retries <= maxRetries) {
      const response = await groqRequest(systemPrompt, userContent, apiKey);
      if (response.ok) {
        const data = await response.json();
        const raw  = data?.choices?.[0]?.message?.content || '';
        return parseGroqJson(raw);
      }
      const errBody = await response.text().catch(() => '');
      const msg = (() => { try { return JSON.parse(errBody)?.error?.message || `HTTP ${response.status}`; } catch { return `HTTP ${response.status}`; } })();
      if (response.status === 429 && retries < maxRetries) {
        retries++;
        const backoff = Math.pow(2, retries) * 2000;
        console.warn(`[Groq] Rate limited. Retrying in ${backoff}ms (attempt ${retries}/${maxRetries})...`);
        await new Promise(r => setTimeout(r, backoff));
      } else {
        throw new Error(msg);
      }
    }
    return [];
  };

  // ── Batch pages into overlapping chunks ───────────────────
  // Larger chunks = more context = fewer hallucinations
  const chunkPages = (pages, charsPerChunk = 12000) => {
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

  // ── Main extraction entry point ───────────────────────────
  const extractQuestionsFromPdf = async (arrayBuffer, docName, docId, onProgress) => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error('No API key set. Please add your Groq key in Settings.');

    onProgress && onProgress(0, 1, 0);

    const pages      = await extractTextFromPdf(arrayBuffer);
    const totalPages = pages.length;
    const chunks     = chunkPages(pages, 12000);
    const allQuestions    = [];
    const seenQuestions   = new Set();
    let failedChunks      = 0;
    let duplicatesSkipped = 0;
    let nonUAESkipped     = 0;

    const systemPrompt = buildSystemPrompt();

    for (let i = 0; i < chunks.length; i++) {
      onProgress && onProgress(i + 1, chunks.length, allQuestions.length);

      try {
        const userContent = `Document: "${docName}"\n\nExtract ALL testable MCQ questions from this text for UAE Pharmacy License exam preparation:\n\n${chunks[i]}`;
        const questions = await groqWithRetry(systemPrompt, userContent, apiKey);

        for (const q of questions) {
          if (!isValidQuestion(q)) {
            nonUAESkipped++;
            continue;
          }

          const key = q.question.trim().toLowerCase().substring(0, 70);
          if (seenQuestions.has(key)) { duplicatesSkipped++; continue; }
          seenQuestions.add(key);

          // Normalize options to exactly 4
          while (q.options.length < 4) q.options.push('D. —');
          q.options = q.options.slice(0, 4);

          const domain = (q.domain || 'PHARM').toUpperCase().substring(0, 6);
          const difficulty = ['easy', 'medium', 'hard'].includes(q.difficulty) ? q.difficulty : 'medium';

          allQuestions.push({
            id:          `extracted_${docId}_${allQuestions.length}`,
            question:    q.question.trim(),
            options:     q.options.map(o => String(o).trim()),
            correct:     q.correct,
            explanation: (q.explanation || 'See source document for details.').trim(),
            difficulty,
            domain,
            source:      docName,
            docId,
            extractedAt: Date.now()
          });
        }
      } catch (err) {
        console.error(`[Extractor] Chunk ${i + 1} failed:`, err.message);
        failedChunks++;
      }

      // Delay between chunks to respect Groq free-tier 30 RPM limit
      if (i < chunks.length - 1) await new Promise(r => setTimeout(r, 2500));
    }

    // ── Quality Score ─────────────────────────────────────
    const qualityScore = allQuestions.length === 0 ? 0 : Math.round(
      (allQuestions.filter(q =>
        q.options.every(o => o.trim().length > 3) &&
        q.explanation && q.explanation.length > 40 &&
        q.explanation !== 'See source document for details.'
      ).length / allQuestions.length) * 100
    );

    onProgress && onProgress(chunks.length, chunks.length, allQuestions.length);

    return {
      questions: allQuestions,
      meta: {
        docId, docName, totalPages,
        chunksProcessed: chunks.length,
        failedChunks, duplicatesSkipped, nonUAESkipped,
        totalFound: allQuestions.length,
        qualityScore,
        extractedAt: Date.now()
      }
    };
  };

  return { extractQuestionsFromPdf, getApiKey, setApiKey, hasApiKey };
})();

window.PdfExtractor = PdfExtractor;
