// js/pdf-extractor.js — UAE Pharmacy License Exam — Advanced AI Extraction Engine v3.0
// Dual pipeline: PDF.js text layer → fallback to Tesseract.js OCR for scanned pages
// Model: Llama 3.3 70B via Groq API

const PdfExtractor = (() => {
  const GROQ_URL   = 'https://api.groq.com/openai/v1/chat/completions';
  const GROQ_MODEL = 'llama-3.3-70b-versatile';

  const getApiKey = () => localStorage.getItem('gemini_api_key') || '';
  const setApiKey = (key) => localStorage.setItem('gemini_api_key', key.trim());
  const hasApiKey = () => !!getApiKey();

  // ── Groq API call ─────────────────────────────────────────
  const groqRequest = async (systemPrompt, userContent, apiKey) => {
    return fetch(GROQ_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
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

  // ══════════════════════════════════════════════════════════
  //  TEXT EXTRACTION — PDF.js  (works for text-based PDFs)
  // ══════════════════════════════════════════════════════════
  const extractTextLayerFromPdf = async (arrayBuffer) => {
    await Reader.ensurePDFJSLoaded();
    const data = new Uint8Array(arrayBuffer.slice(0));
    const pdf  = await pdfjsLib.getDocument({ data }).promise;
    const pages = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page  = await pdf.getPage(i);
      const tc    = await page.getTextContent();
      // Smart joining: preserve line breaks for better MCQ structure
      let text = '';
      let lastY = null;
      for (const item of tc.items) {
        if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
          text += '\n';
        }
        text += item.str;
        lastY = item.transform[5];
      }
      pages.push({ page: i, text: text.trim(), pdfPage: page });
    }
    // Don't destroy the pdf yet — we may need pages for OCR
    return { pages, pdf };
  };

  // ══════════════════════════════════════════════════════════
  //  OCR PIPELINE — Tesseract.js  (for scanned image PDFs)
  // ══════════════════════════════════════════════════════════

  // Check if a page has meaningful text content (threshold: 40 chars)
  const isScannedPage = (text) => text.trim().replace(/\s+/g, ' ').length < 40;

  // Render a PDF page to a high-res canvas data URL for Tesseract
  const renderPageToImage = async (pdfPage, scale = 2.5) => {
    const viewport = pdfPage.getViewport({ scale });
    const canvas   = document.createElement('canvas');
    canvas.width   = viewport.width;
    canvas.height  = viewport.height;
    const ctx = canvas.getContext('2d');
    await pdfPage.render({ canvasContext: ctx, viewport }).promise;
    return canvas.toDataURL('image/png');
  };

  // Perform OCR on a single page image using Tesseract.js v5
  let _tesseractWorker = null;
  const getTesseractWorker = async () => {
    if (_tesseractWorker) return _tesseractWorker;
    if (typeof Tesseract === 'undefined') {
      throw new Error('Tesseract.js is not loaded. Check your internet connection.');
    }
    console.log('[OCR] Initialising Tesseract worker (English)...');
    _tesseractWorker = await Tesseract.createWorker('eng', 1, {
      logger: () => {} // suppress verbose logging
    });
    return _tesseractWorker;
  };

  const ocrPage = async (pdfPage) => {
    const worker   = await getTesseractWorker();
    const imageUrl = await renderPageToImage(pdfPage, 2.5);
    const { data: { text } } = await worker.recognize(imageUrl);
    return text.trim();
  };

  const terminateTesseract = async () => {
    if (_tesseractWorker) {
      await _tesseractWorker.terminate();
      _tesseractWorker = null;
    }
  };

  // ══════════════════════════════════════════════════════════
  //  TEXT CLEANING
  // ══════════════════════════════════════════════════════════
  const cleanText = (raw) => {
    return raw
      // Remove page headers/footers like "1 | P a g e"
      .replace(/\d+\s*\|\s*P\s*a\s*g\s*e/gi, '')
      // Collapse spaced-out letters: "Q u e s t i o n" → "Question"
      .replace(/\b([A-Za-z])\s(?=[A-Za-z]\s)/g, '$1')
      // Normalize whitespace
      .replace(/[ \t]+/g, ' ')
      // Collapse more than 3 consecutive newlines
      .replace(/\n{3,}/g, '\n\n')
      // Remove junk Unicode
      .replace(/[\u0000-\u0008\u000B\u000E-\u001F\u007F]/g, '')
      .trim();
  };

  // ══════════════════════════════════════════════════════════
  //  AI PROMPT — UAE Pharmacy License context
  // ══════════════════════════════════════════════════════════
  const SYSTEM_PROMPT = `You are a senior UAE Pharmacy License exam coach extracting MCQ questions for pharmacists preparing for the UAE Prometric exam (MOHAP, DHA, DOH Abu Dhabi).

=== UAE EXAM RULES (MANDATORY) ===
- Regulatory: MOHAP (federal), DHA (Dubai), DOH (Abu Dhabi). NEVER write Saudi Arabia/KSA/SCFHS.
- UAE Drug Schedules: I=heroin/very dangerous, II=morphine/opioids, III=codeine combos, IV=benzodiazepines, V=OTC
- Controlled substances need triplicate prescriptions in UAE
- Use WHO, GINA, JNC, ESC, AHA international clinical guidelines

=== EXTRACTION RULES ===
1. Extract EVERY single MCQ question — numbered, lettered, or with explicit A/B/C/D options
2. If the text has Q&A pairs, bullet facts, numbered lists — convert ALL of them into MCQs
3. For factual content: write a clear clinical question stem + 3 plausible wrong distractors
4. VERIFY every correct answer using pharmacological knowledge
5. Write explanations with mechanism, reasoning, or UAE regulatory basis (2-3 sentences)
6. DO NOT skip questions due to OCR noise — clean up and use the content

=== IMPORTANT: OCR TEXT ===
The text may contain OCR artifacts (garbled words, split letters, noise). Do your best to interpret the content. If a question is partially damaged but the core is clear, still include it.

=== FEW-SHOT EXAMPLES ===
Example 1 — OCR-noisy input:
"Q1. Wh at is th e fi rst-l ine tr eatment f or asthma re lie f? A) Sa lbut amol B) Fl uticasone C) Mon telukast D) The ophyl line Ans: A"
→ Output:
{"question":"What is the first-line relief (rescue) treatment for acute asthma?","options":["A. Salbutamol (SABA)","B. Fluticasone (inhaled corticosteroid)","C. Montelukast (leukotriene antagonist)","D. Theophylline (methylxanthine)"],"correct":0,"explanation":"Salbutamol is a short-acting beta-2 agonist (SABA) and the standard rescue bronchodilator for acute asthma. It acts within 5 minutes by relaxing bronchial smooth muscle. Fluticasone is a controller (not rescue) medication.","difficulty":"easy","domain":"PHARM"}

Example 2 — factual bullet:
"- Vancomycin requires therapeutic drug monitoring: trough 10-20 mg/L for serious infections"
→ Output:
{"question":"What is the recommended trough level for vancomycin when treating serious infections such as MRSA bacteraemia?","options":["A. 1-5 mg/L","B. 5-10 mg/L","C. 10-20 mg/L","D. 25-35 mg/L"],"correct":2,"explanation":"Vancomycin therapeutic drug monitoring targets a trough of 10-20 mg/L for serious infections (e.g., MRSA bacteraemia, endocarditis). Lower troughs risk treatment failure; higher troughs increase nephrotoxicity risk. AUC/MIC monitoring is increasingly preferred.","difficulty":"medium","domain":"CLIN"}

=== OUTPUT FORMAT ===
Return ONLY a valid JSON array. No markdown. No explanation text outside the array.
[
  {
    "question": "Full question stem",
    "options": ["A. option","B. option","C. option","D. option"],
    "correct": 0,
    "explanation": "Detailed explanation (2-3 sentences)",
    "difficulty": "easy|medium|hard",
    "domain": "PHARM|CLIN|CALC|REG|HERB|PHSCI|PRAC|THER|LAW|MICRO|PEDS|ONCOL|IMMUN|CARD|ENDO|RENAL|GI|NEURO|PSYCH|DERM|HEMA"
  }
]
If there is truly no pharmacy content, return: []`;

  // ══════════════════════════════════════════════════════════
  //  JSON PARSING — robust fallback chain
  // ══════════════════════════════════════════════════════════
  const parseGroqJson = (raw) => {
    if (!raw || !raw.trim()) return [];
    const attempts = [
      raw.trim(),
      raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim(),
      (() => { const m = raw.match(/\[[\s\S]*\]/); return m ? m[0] : null; })(),
    ];
    for (const attempt of attempts) {
      if (!attempt) continue;
      try {
        const parsed = JSON.parse(attempt);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    // Last resort: extract individual objects
    const objects = [];
    const regex = /\{[^{}]*"question"[^{}]*"options"[^{}]*"correct"[^{}]*\}/gs;
    let match;
    while ((match = regex.exec(raw)) !== null) {
      try { objects.push(JSON.parse(match[0])); } catch {}
    }
    if (objects.length > 0) return objects;
    console.warn('[Extractor] Could not parse Groq JSON. First 500 chars:', raw.slice(0, 500));
    return [];
  };

  // ══════════════════════════════════════════════════════════
  //  GROQ CALL WITH RETRY
  // ══════════════════════════════════════════════════════════
  const groqWithRetry = async (userContent, apiKey, maxRetries = 4) => {
    let retries = 0;
    while (retries <= maxRetries) {
      let response;
      try {
        response = await groqRequest(SYSTEM_PROMPT, userContent, apiKey);
      } catch (networkErr) {
        console.warn('[Groq] Network error:', networkErr.message);
        if (retries < maxRetries) { retries++; await sleep(3000 * retries); continue; }
        return [];
      }
      if (response.ok) {
        const data = await response.json();
        const raw  = data?.choices?.[0]?.message?.content || '';
        const parsed = parseGroqJson(raw);
        console.log(`[Groq] ✅ Parsed ${parsed.length} questions from chunk`);
        return parsed;
      }
      const errBody = await response.text().catch(() => '');
      let errMsg = `HTTP ${response.status}`;
      try { errMsg = JSON.parse(errBody)?.error?.message || errMsg; } catch {}
      console.warn(`[Groq] Error ${response.status}: ${errMsg}`);
      if (response.status === 429 && retries < maxRetries) {
        retries++;
        const backoff = Math.pow(2, retries) * 3000;
        console.log(`[Groq] Rate limited. Retrying in ${backoff / 1000}s...`);
        await sleep(backoff);
      } else if (response.status >= 500 && retries < maxRetries) {
        retries++;
        await sleep(5000);
      } else {
        throw new Error(errMsg);
      }
    }
    return [];
  };

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  // ══════════════════════════════════════════════════════════
  //  UAE QUALITY FILTER
  // ══════════════════════════════════════════════════════════
  const BLOCK_REGEX = /\b(Saudi Arabia|Kingdom of Saudi|KSA\b|SCFHS|Saudi MOH|Saudi Commission|Saudi Board)\b/i;

  const validateQuestion = (q) => {
    if (!q || typeof q !== 'object') return false;
    if (typeof q.question !== 'string' || q.question.trim().length < 10) return false;
    if (!Array.isArray(q.options) || q.options.length < 2) return false;
    if (typeof q.correct !== 'number' || q.correct < 0 || q.correct >= q.options.length) return false;
    const fullText = q.question + ' ' + (q.explanation || '') + ' ' + q.options.join(' ');
    if (BLOCK_REGEX.test(fullText)) {
      console.warn('[UAE Filter] Blocked:', q.question.slice(0, 80));
      return false;
    }
    return true;
  };

  // ══════════════════════════════════════════════════════════
  //  CHUNKING — split text into ~10k char blocks
  // ══════════════════════════════════════════════════════════
  const chunkText = (text, maxChars = 10000) => {
    if (text.length <= maxChars) return [text];
    const chunks = [];
    // Try to split at double newlines (between questions)
    const paragraphs = text.split(/\n{2,}/);
    let current = '';
    for (const para of paragraphs) {
      if ((current + '\n\n' + para).length > maxChars && current.length > 100) {
        chunks.push(current.trim());
        current = para;
      } else {
        current += (current ? '\n\n' : '') + para;
      }
    }
    if (current.trim()) chunks.push(current.trim());
    return chunks.filter(c => c.length > 30);
  };

  // ══════════════════════════════════════════════════════════
  //  MAIN ENTRY POINT
  // ══════════════════════════════════════════════════════════
  const extractQuestionsFromPdf = async (arrayBuffer, docName, docId, onProgress) => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error('No Groq API key set. Please add your Groq key in Settings → API Key.');

    onProgress?.('Analysing PDF structure…', 0, 1, 0);

    // ── Step 1: Extract text layer ─────────────────────────
    let { pages, pdf } = await extractTextLayerFromPdf(arrayBuffer);
    const totalPages = pages.length;

    // ── Step 2: Detect scanned pages and OCR them ──────────
    const scannedPages = pages.filter(p => isScannedPage(p.text));
    const hasScannedPages = scannedPages.length > 0;
    const scannedRatio = totalPages > 0 ? scannedPages.length / totalPages : 0;

    let ocrMode = false;
    if (hasScannedPages) {
      ocrMode = true;
      const scanLabel = scannedRatio > 0.5
        ? `Scanned PDF detected (${scannedPages.length}/${totalPages} pages). Running OCR…`
        : `Mixed PDF: ${scannedPages.length} scanned pages found. Running OCR on those…`;
      console.log('[Extractor]', scanLabel);
      onProgress?.(scanLabel, 0, totalPages, 0);

      for (let i = 0; i < pages.length; i++) {
        const p = pages[i];
        if (isScannedPage(p.text)) {
          onProgress?.(`OCR page ${p.page}/${totalPages}…`, i, totalPages, 0);
          try {
            const ocrText = await ocrPage(p.pdfPage);
            if (ocrText.length > 20) {
              pages[i] = { ...p, text: ocrText, ocrApplied: true };
              console.log(`[OCR] Page ${p.page}: extracted ${ocrText.length} chars`);
            }
          } catch (ocrErr) {
            console.warn(`[OCR] Page ${p.page} failed:`, ocrErr.message);
          }
        }
      }
      await terminateTesseract();
    }

    await pdf.destroy();

    // ── Step 3: Collect all page text ──────────────────────
    const allText = pages
      .filter(p => p.text && p.text.trim().length > 20)
      .map(p => `[Page ${p.page}]\n${cleanText(p.text)}`)
      .join('\n\n---\n\n');

    if (allText.trim().length < 50) {
      console.warn('[Extractor] No usable text extracted from PDF after all methods.');
      return { questions: [], meta: { docId, docName, totalPages, totalFound: 0, ocrMode, qualityScore: 0, extractedAt: Date.now() } };
    }

    // ── Step 4: Split into AI chunks ───────────────────────
    const chunks = chunkText(allText, 10000);
    console.log(`[Extractor] ${chunks.length} chunks to process (total ${allText.length} chars)`);

    // ── Step 5: Process each chunk through Groq ────────────
    const allQuestions  = [];
    const seenKeys      = new Set();
    let failedChunks    = 0;
    let duplicateCount  = 0;
    let nonUAECount     = 0;

    for (let i = 0; i < chunks.length; i++) {
      onProgress?.(
        ocrMode ? `AI extraction (chunk ${i + 1}/${chunks.length})…` : `Extracting chunk ${i + 1}/${chunks.length}…`,
        i + 1, chunks.length, allQuestions.length
      );

      try {
        const userContent = `Document: "${docName}"\n\nExtract ALL MCQ questions from this text for the UAE Pharmacy License exam. Be thorough — convert every fact, Q&A pair, or numbered item into a question:\n\n${chunks[i]}`;
        const questions = await groqWithRetry(userContent, apiKey);

        for (const q of questions) {
          if (!validateQuestion(q)) { nonUAECount++; continue; }

          const key = q.question.trim().toLowerCase().replace(/\s+/g, ' ').slice(0, 80);
          if (seenKeys.has(key)) { duplicateCount++; continue; }
          seenKeys.add(key);

          // Normalise options to exactly 4
          const opts = (q.options || []).map(o => String(o).trim()).filter(Boolean);
          while (opts.length < 4) opts.push(`${String.fromCharCode(65 + opts.length)}. —`);

          // Fix correct index if out of range
          let correct = typeof q.correct === 'number' ? Math.max(0, Math.min(3, q.correct)) : 0;

          const domain = (q.domain || 'PHARM').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 6) || 'PHARM';
          const difficulty = ['easy', 'medium', 'hard'].includes(q.difficulty?.toLowerCase())
            ? q.difficulty.toLowerCase() : 'medium';

          allQuestions.push({
            id:          `extracted_${docId}_${allQuestions.length}`,
            question:    q.question.trim(),
            options:     opts.slice(0, 4),
            correct,
            explanation: (q.explanation || 'See reference document for details.').trim(),
            difficulty,
            domain,
            source:      docName,
            docId,
            ocrPage:     q.ocrApplied || false,
            extractedAt: Date.now()
          });
        }
      } catch (err) {
        console.error(`[Extractor] Chunk ${i + 1} error:`, err.message);
        failedChunks++;
      }

      // Rate limit: wait between Groq calls
      if (i < chunks.length - 1) await sleep(2000);
    }

    // ── Step 6: Quality score ──────────────────────────────
    const qualityScore = allQuestions.length === 0 ? 0 : Math.round(
      allQuestions.filter(q =>
        q.options.every(o => o.length > 3 && o !== 'D. —') &&
        q.explanation && q.explanation.length > 40 &&
        q.explanation !== 'See reference document for details.'
      ).length / allQuestions.length * 100
    );

    onProgress?.('✅ Extraction complete!', chunks.length, chunks.length, allQuestions.length);

    console.log(`[Extractor] ✅ Done. Found ${allQuestions.length} questions. Quality: ${qualityScore}%. OCR: ${ocrMode}`);

    return {
      questions: allQuestions,
      meta: {
        docId, docName, totalPages,
        chunksProcessed: chunks.length, failedChunks,
        duplicatesSkipped: duplicateCount, nonUAESkipped: nonUAECount,
        totalFound: allQuestions.length,
        qualityScore, ocrMode,
        ocrPagesCount: ocrMode ? scannedPages.length : 0,
        extractedAt: Date.now()
      }
    };
  };

  return { extractQuestionsFromPdf, getApiKey, setApiKey, hasApiKey };
})();

window.PdfExtractor = PdfExtractor;
