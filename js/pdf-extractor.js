// js/pdf-extractor.js — UAE Pharmacy License Exam — Extraction Engine v4.0
// VISION-FIRST pipeline: sends PDF pages as images to Llama 4 Scout (Groq Vision API)
// Fallback: Tesseract.js OCR → Llama 3.3 text model
// For text-layer PDFs: direct text → Llama 3.3

const PdfExtractor = (() => {
  const GROQ_URL        = 'https://api.groq.com/openai/v1/chat/completions';
  const GROQ_TEXT_MODEL = 'llama-3.3-70b-versatile';       // text-layer PDFs
  const GROQ_VIS_MODEL  = 'meta-llama/llama-4-scout-17b-16e-instruct'; // scanned/image PDFs

  const getApiKey  = () => localStorage.getItem('gemini_api_key') || '';
  const setApiKey  = (key) => localStorage.setItem('gemini_api_key', key.trim());
  const hasApiKey  = () => !!getApiKey();
  const sleep      = (ms) => new Promise(r => setTimeout(r, ms));

  // ════════════════════════════════════════════════════════
  //  UAE SYSTEM PROMPT (shared by both pipelines)
  // ════════════════════════════════════════════════════════
  const SYSTEM_PROMPT = `You are a senior UAE Pharmacy License exam coach. Extract MCQ questions for pharmacists preparing for the UAE Prometric exam (MOHAP, DHA, DOH Abu Dhabi).

=== UAE RULES (MANDATORY) ===
- Authorities: MOHAP (federal), DHA (Dubai), DOH (Abu Dhabi). NEVER write Saudi Arabia/KSA/SCFHS.
- UAE Drug Schedules: I=dangerous (heroin), II=strong opioids, III=codeine, IV=benzodiazepines, V=OTC
- Controlled substances need triplicate prescriptions in UAE
- Use WHO, GINA, JNC, ESC, AHA international clinical guidelines

=== EXTRACTION RULES ===
1. Extract EVERY numbered or lettered MCQ question you see — do not skip any
2. Convert bullet facts, Q&A pairs, numbered facts → full MCQs with 4 options
3. VERIFY every correct answer using pharmacological knowledge
4. Write explanations with mechanism + reasoning (2-3 sentences minimum)
5. If OCR/image is noisy, still extract — do your best with partial content

=== OUTPUT FORMAT ===
Return ONLY a valid JSON array. No markdown wrapper. No text outside the array.
[
  {
    "question": "Full question stem text",
    "options": ["A. option text","B. option text","C. option text","D. option text"],
    "correct": 0,
    "explanation": "Detailed pharmacological explanation (2-3 sentences)",
    "difficulty": "easy|medium|hard",
    "domain": "PHARM|CLIN|CALC|REG|HERB|PHSCI|PRAC|THER|LAW|MICRO|PEDS|ONCOL|IMMUN|CARD|ENDO|RENAL|GI|NEURO|PSYCH|DERM|HEMA"
  }
]
If no pharmacy MCQ content is present, return exactly: []`;

  // ════════════════════════════════════════════════════════
  //  PDF.js — extract text layer
  // ════════════════════════════════════════════════════════
  const getPdfDoc = async (arrayBuffer) => {
    await Reader.ensurePDFJSLoaded();
    const data = new Uint8Array(arrayBuffer.slice(0));
    return pdfjsLib.getDocument({ data }).promise;
  };

  const extractPageText = async (pdfPage) => {
    const tc = await pdfPage.getTextContent();
    let text = '';
    let lastY = null;
    for (const item of tc.items) {
      if (lastY !== null && Math.abs(item.transform[5] - lastY) > 4) text += '\n';
      text += item.str;
      lastY = item.transform[5];
    }
    return text.trim();
  };

  // ════════════════════════════════════════════════════════
  //  PDF.js — render page to JPEG base64 (for vision model)
  // ════════════════════════════════════════════════════════
  const renderPageToBase64 = async (pdfPage, scale = 2.0) => {
    const viewport = pdfPage.getViewport({ scale });
    const canvas   = document.createElement('canvas');
    canvas.width   = viewport.width;
    canvas.height  = viewport.height;
    const ctx = canvas.getContext('2d');
    // White background (PDFs with transparent bg become black otherwise)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await pdfPage.render({ canvasContext: ctx, viewport }).promise;
    // JPEG at 92% quality — good balance of sharpness vs size
    return canvas.toDataURL('image/jpeg', 0.92).split(',')[1]; // strip the data: prefix
  };

  // ════════════════════════════════════════════════════════
  //  GROQ VISION API — send page image directly to Llama 4
  // ════════════════════════════════════════════════════════
  const extractFromImage = async (base64Jpeg, pageNum, docName, apiKey) => {
    const response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: GROQ_VIS_MODEL,
        temperature: 0.1,
        max_tokens: 8192,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Jpeg}`,
                  detail: 'high'
                }
              },
              {
                type: 'text',
                text: `Document: "${docName}" — Page ${pageNum}\n\nExtract ALL MCQ questions visible in this image for the UAE Pharmacy License exam. Extract every numbered question and all answer options. If you see partial questions at the top or bottom of the page, still include them.`
              }
            ]
          }
        ]
      })
    });
    if (!response.ok) {
      const body = await response.text().catch(() => '');
      let msg = `HTTP ${response.status}`;
      try { msg = JSON.parse(body)?.error?.message || msg; } catch {}
      throw Object.assign(new Error(msg), { status: response.status });
    }
    const data = await response.json();
    return data?.choices?.[0]?.message?.content || '';
  };

  // ════════════════════════════════════════════════════════
  //  GROQ TEXT API — send text to Llama 3.3
  // ════════════════════════════════════════════════════════
  const extractFromText = async (text, docName, apiKey) => {
    const response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: GROQ_TEXT_MODEL,
        temperature: 0.1,
        max_tokens: 8192,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content: `Document: "${docName}"\n\nExtract ALL MCQ questions from this text for the UAE Pharmacy License exam. Convert every fact, Q&A pair, or numbered item into a question:\n\n${text}`
          }
        ]
      })
    });
    if (!response.ok) {
      const body = await response.text().catch(() => '');
      let msg = `HTTP ${response.status}`;
      try { msg = JSON.parse(body)?.error?.message || msg; } catch {}
      throw Object.assign(new Error(msg), { status: response.status });
    }
    const data = await response.json();
    return data?.choices?.[0]?.message?.content || '';
  };

  // ════════════════════════════════════════════════════════
  //  JSON PARSING — 4-layer fallback
  // ════════════════════════════════════════════════════════
  const parseJson = (raw) => {
    if (!raw?.trim()) return [];
    const cleaners = [
      s => s,
      s => s.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, ''),
      s => { const m = s.match(/\[[\s\S]*\]/); return m ? m[0] : null; },
    ];
    for (const fn of cleaners) {
      const cleaned = fn(raw.trim());
      if (!cleaned) continue;
      try { const p = JSON.parse(cleaned); if (Array.isArray(p)) return p; } catch {}
    }
    // Object-by-object extraction as last resort
    const found = [];
    const re = /\{(?:[^{}]|\{[^{}]*\})*"question"(?:[^{}]|\{[^{}]*\})*\}/gs;
    let m;
    while ((m = re.exec(raw)) !== null) {
      try { found.push(JSON.parse(m[0])); } catch {}
    }
    return found;
  };

  // ════════════════════════════════════════════════════════
  //  RETRY WRAPPER — handles 429 rate limits + server errors
  // ════════════════════════════════════════════════════════
  const withRetry = async (fn, label, maxRetries = 3) => {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (err) {
        if (attempt < maxRetries && (err.status === 429 || err.status >= 500 || !err.status)) {
          const wait = err.status === 429 ? (attempt + 1) * 8000 : (attempt + 1) * 3000;
          console.warn(`[Extractor] ${label} attempt ${attempt + 1} failed (${err.message}). Retrying in ${wait / 1000}s...`);
          await sleep(wait);
        } else {
          console.error(`[Extractor] ${label} failed permanently:`, err.message);
          return null;
        }
      }
    }
    return null;
  };

  // ════════════════════════════════════════════════════════
  //  UAE QUALITY FILTER
  // ════════════════════════════════════════════════════════
  const BLOCK_RE = /\b(Saudi Arabia|Kingdom of Saudi|KSA\b|SCFHS|Saudi MOH|Saudi Commission|Saudi Board)\b/i;

  const isValid = (q) => {
    if (!q || typeof q.question !== 'string' || q.question.trim().length < 8) return false;
    if (!Array.isArray(q.options) || q.options.length < 2) return false;
    if (typeof q.correct !== 'number') return false;
    const txt = [q.question, ...(q.options || []), q.explanation || ''].join(' ');
    if (BLOCK_RE.test(txt)) { console.warn('[UAE Filter] Blocked:', q.question.slice(0, 60)); return false; }
    return true;
  };

  const normalise = (q, idx, docId, docName, pipeline) => {
    const opts = (q.options || []).map(o => String(o).trim()).filter(Boolean);
    while (opts.length < 4) opts.push(`${String.fromCharCode(65 + opts.length)}. —`);
    const correct  = Math.max(0, Math.min(3, typeof q.correct === 'number' ? q.correct : 0));
    const domain   = (q.domain || 'PHARM').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 6) || 'PHARM';
    const difficulty = ['easy', 'medium', 'hard'].includes((q.difficulty || '').toLowerCase())
      ? q.difficulty.toLowerCase() : 'medium';
    return {
      id:          `extracted_${docId}_${idx}`,
      question:    q.question.trim(),
      options:     opts.slice(0, 4),
      correct,
      explanation: (q.explanation || 'See reference document.').trim(),
      difficulty, domain,
      source:      docName, docId, pipeline,
      extractedAt: Date.now()
    };
  };

  // ════════════════════════════════════════════════════════
  //  TESSERACT OCR — used only as fallback when vision fails
  // ════════════════════════════════════════════════════════
  let _ocrWorker = null;
  const getOcrWorker = async () => {
    if (_ocrWorker) return _ocrWorker;
    if (typeof Tesseract === 'undefined') throw new Error('Tesseract.js not loaded');
    _ocrWorker = await Tesseract.createWorker('eng', 1, { logger: () => {} });
    return _ocrWorker;
  };
  const ocrImage = async (base64) => {
    const worker = await getOcrWorker();
    const { data: { text } } = await worker.recognize(`data:image/jpeg;base64,${base64}`);
    return text.trim();
  };
  const terminateOcr = async () => {
    if (_ocrWorker) { await _ocrWorker.terminate(); _ocrWorker = null; }
  };

  // ════════════════════════════════════════════════════════
  //  MAIN ENTRY POINT
  // ════════════════════════════════════════════════════════
  const extractQuestionsFromPdf = async (arrayBuffer, docName, docId, onProgress) => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error('No Groq API key. Add it in Library → API Key settings.');

    onProgress?.('Loading PDF…', 0, 1, 0);

    const pdf        = await getPdfDoc(arrayBuffer);
    const totalPages = pdf.numPages;
    const allFound   = [];
    const seenKeys   = new Set();
    let visionCount  = 0, textCount = 0, ocrFallbackCount = 0, skipCount = 0;

    // ── Detect PDF type: text-based or image/scanned ─────
    // Sample first 5 pages to determine PDF type
    const sampleSize  = Math.min(5, totalPages);
    let totalTextLen  = 0;
    const samplePages = [];
    for (let i = 1; i <= sampleSize; i++) {
      const p = await pdf.getPage(i);
      const t = await extractPageText(p);
      totalTextLen += t.length;
      samplePages.push({ pageNum: i, text: t, pdfPage: p });
    }
    const avgTextPerPage = totalTextLen / sampleSize;
    // If average text < 80 chars per page → treat as scanned (image PDF)
    const isImagePdf = avgTextPerPage < 80;

    console.log(`[Extractor] "${docName}" — ${totalPages} pages, avg text/page: ${Math.round(avgTextPerPage)} chars → ${isImagePdf ? '🔬 IMAGE PDF (vision pipeline)' : '📄 TEXT PDF (text pipeline)'}`);

    // ── Per-page processing ───────────────────────────────
    // For image PDFs: process page-by-page through vision model
    // For text PDFs: chunk pages and send in larger batches through text model

    if (isImagePdf) {
      // VISION PIPELINE: one page at a time through Llama 4 Scout
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        onProgress?.(
          `🔬 Vision AI — page ${pageNum}/${totalPages} · ${allFound.length} questions found`,
          pageNum, totalPages, allFound.length
        );

        const pdfPage = pageNum <= sampleSize
          ? samplePages[pageNum - 1].pdfPage
          : await pdf.getPage(pageNum);

        // Render page to JPEG
        let base64;
        try { base64 = await renderPageToBase64(pdfPage, 2.0); }
        catch (e) { console.warn(`[Extractor] Render failed p${pageNum}:`, e.message); continue; }

        // Try vision model first
        let raw = await withRetry(
          () => extractFromImage(base64, pageNum, docName, apiKey),
          `Vision p${pageNum}`
        );
        let pipeline = 'vision';

        // Fallback: if vision totally failed, try Tesseract OCR + text model
        if (raw === null) {
          console.log(`[Extractor] Vision failed on page ${pageNum}, trying OCR fallback…`);
          try {
            const ocrText = await ocrImage(base64);
            if (ocrText.length > 30) {
              raw = await withRetry(
                () => extractFromText(ocrText.slice(0, 9000), docName, apiKey),
                `OCR-text p${pageNum}`
              );
              pipeline = 'ocr-text';
              ocrFallbackCount++;
            }
          } catch (ocrErr) {
            console.warn(`[Extractor] OCR fallback also failed on page ${pageNum}:`, ocrErr.message);
          }
        } else {
          visionCount++;
        }

        if (!raw) { skipCount++; continue; }

        const items = parseJson(raw);
        for (const q of items) {
          if (!isValid(q)) continue;
          const key = q.question.trim().toLowerCase().slice(0, 80);
          if (seenKeys.has(key)) continue;
          seenKeys.add(key);
          allFound.push(normalise(q, allFound.length, docId, docName, pipeline));
        }

        // Polite delay between pages to respect Groq rate limits
        if (pageNum < totalPages) await sleep(1800);
      }

    } else {
      // TEXT PIPELINE: collect all text, chunk, send to Llama 3.3
      // First collect remaining pages text
      const allPages = [...samplePages];
      for (let i = sampleSize + 1; i <= totalPages; i++) {
        const p = await pdf.getPage(i);
        const t = await extractPageText(p);
        allPages.push({ pageNum: i, text: t });
      }

      // Build full text
      const fullText = allPages
        .filter(p => p.text.trim().length > 10)
        .map(p => `[Page ${p.pageNum}]\n${p.text.trim()}`)
        .join('\n\n---\n\n');

      // Chunk into ~9000 char blocks at paragraph boundaries
      const chunks = [];
      const paragraphs = fullText.split(/\n{2,}/);
      let current = '';
      for (const para of paragraphs) {
        if ((current + '\n\n' + para).length > 9000 && current.length > 100) {
          chunks.push(current.trim());
          current = para;
        } else {
          current += (current ? '\n\n' : '') + para;
        }
      }
      if (current.trim().length > 30) chunks.push(current.trim());

      for (let i = 0; i < chunks.length; i++) {
        onProgress?.(
          `📄 Processing chunk ${i + 1}/${chunks.length} · ${allFound.length} questions found`,
          i + 1, chunks.length, allFound.length
        );

        const raw = await withRetry(
          () => extractFromText(chunks[i], docName, apiKey),
          `Text chunk ${i + 1}`
        );
        textCount++;

        if (!raw) { skipCount++; continue; }

        const items = parseJson(raw);
        for (const q of items) {
          if (!isValid(q)) continue;
          const key = q.question.trim().toLowerCase().slice(0, 80);
          if (seenKeys.has(key)) continue;
          seenKeys.add(key);
          allFound.push(normalise(q, allFound.length, docId, docName, 'text'));
        }

        if (i < chunks.length - 1) await sleep(2000);
      }
    }

    await terminateOcr();
    await pdf.destroy();

    // Quality score
    const qualityScore = allFound.length === 0 ? 0 : Math.round(
      allFound.filter(q =>
        q.options.every(o => o.length > 3 && !o.endsWith('—')) &&
        q.explanation && q.explanation.length > 40 &&
        q.explanation !== 'See reference document.'
      ).length / allFound.length * 100
    );

    onProgress?.('✅ Done!', totalPages, totalPages, allFound.length);
    console.log(`[Extractor] ✅ "${docName}" — ${allFound.length} questions | quality: ${qualityScore}% | vision: ${visionCount} pages | ocr-fb: ${ocrFallbackCount} | text: ${textCount} | skipped: ${skipCount}`);

    return {
      questions: allFound,
      meta: {
        docId, docName, totalPages,
        totalFound:  allFound.length,
        qualityScore,
        pipeline:    isImagePdf ? 'vision' : 'text',
        visionPages: visionCount,
        ocrFallback: ocrFallbackCount,
        textChunks:  textCount,
        skippedPages: skipCount,
        extractedAt: Date.now()
      }
    };
  };

  return { extractQuestionsFromPdf, getApiKey, setApiKey, hasApiKey };
})();

window.PdfExtractor = PdfExtractor;
