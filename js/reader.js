// js/reader.js — PDF reader using PDF.js

const Reader = (() => {
  let pdfDoc = null;
  let currentPage = 1;
  let totalPages = 0;
  let currentScale = 1.4;
  let currentDocId = null;
  let renderTask = null;
  let isRendering = false;

  const PDFJS_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
  const WORKER_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  // ── Load PDF.js if not already loaded ──────────────────
  const ensurePDFJS = () => {
    return new Promise((resolve, reject) => {
      if (window.pdfjsLib) { resolve(); return; }
      const script = document.createElement('script');
      script.src = PDFJS_CDN;
      script.onload = () => {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_CDN;
        resolve();
      };
      script.onerror = () => reject(new Error('Failed to load PDF.js'));
      document.head.appendChild(script);
    });
  };

  // ── Open a PDF file from file input ────────────────────
  const openFile = async (file, canvasId, onLoaded) => {
    if (!file || file.type !== 'application/pdf') {
      showToast('Please select a valid PDF file', 'error');
      return;
    }

    try {
      await ensurePDFJS();
      updateReaderStatus('Loading PDF...');

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });

      loadingTask.onProgress = (progress) => {
        if (progress.total > 0) {
          const pct = Math.round((progress.loaded / progress.total) * 100);
          updateReaderStatus(`Loading... ${pct}%`);
        }
      };

      pdfDoc = await loadingTask.promise;
      totalPages = pdfDoc.numPages;
      currentPage = 1;

      // Generate a stable ID from filename
      currentDocId = 'doc_' + btoa(file.name + file.size).slice(0, 16);

      // Save metadata
      Storage.addLibraryItem({
        id: currentDocId,
        name: file.name,
        size: file.size,
        totalPages,
        lastPage: 1,
        addedAt: Date.now()
      });

      updateReaderStatus('');
      updatePageControls();

      // Try to restore last-read page
      const meta = Storage.getLibraryMeta().find(m => m.id === currentDocId);
      if (meta && meta.lastPage && meta.lastPage > 1) {
        currentPage = meta.lastPage;
      }

      await renderPage(currentPage, canvasId);
      onLoaded && onLoaded({ totalPages, name: file.name, docId: currentDocId });
    } catch (err) {
      updateReaderStatus('');
      showToast('Error loading PDF: ' + err.message, 'error');
      console.error('PDF load error:', err);
    }
  };

  // ── Render a specific page ──────────────────────────────
  const renderPage = async (pageNum, canvasId) => {
    if (!pdfDoc || isRendering) return;
    isRendering = true;

    const canvas = document.getElementById(canvasId);
    if (!canvas) { isRendering = false; return; }

    // Show loading spinner on canvas
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0f1626';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    try {
      if (renderTask) { await renderTask.promise.catch(() => {}); }

      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: currentScale });

      // Handle high-DPI (Retina) displays for crisp text on mobile
      const outputScale = window.devicePixelRatio || 1;
      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);
      canvas.style.width = Math.floor(viewport.width) + "px";
      canvas.style.height = Math.floor(viewport.height) + "px";

      // Apply dark background for dark-mode PDF reading
      ctx.fillStyle = '#12192b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const transform = outputScale !== 1 
        ? [outputScale, 0, 0, outputScale, 0, 0] 
        : null;

      renderTask = page.render({
        canvasContext: ctx,
        transform: transform,
        viewport: viewport,
        background: 'transparent'
      });

      await renderTask.promise;

      // Save progress
      if (currentDocId) {
        Storage.updateReadingProgress(currentDocId, pageNum);
      }
      updatePageControls();
    } catch (err) {
      if (err.name !== 'RenderingCancelledException') {
        console.error('Render error:', err);
      }
    } finally {
      isRendering = false;
    }
  };

  // ── Navigation ──────────────────────────────────────────
  const goToPage = async (pageNum, canvasId) => {
    if (!pdfDoc) return;
    pageNum = Math.max(1, Math.min(totalPages, pageNum));
    currentPage = pageNum;
    await renderPage(currentPage, canvasId);
  };

  const nextPage = async (canvasId) => {
    if (currentPage < totalPages) {
      currentPage++;
      await renderPage(currentPage, canvasId);
    }
  };

  const prevPage = async (canvasId) => {
    if (currentPage > 1) {
      currentPage--;
      await renderPage(currentPage, canvasId);
    }
  };

  // ── Zoom ────────────────────────────────────────────────
  const zoomIn = async (canvasId) => {
    currentScale = Math.min(3.0, currentScale + 0.2);
    await renderPage(currentPage, canvasId);
    updateZoomDisplay();
  };

  const zoomOut = async (canvasId) => {
    currentScale = Math.max(0.6, currentScale - 0.2);
    await renderPage(currentPage, canvasId);
    updateZoomDisplay();
  };

  const resetZoom = async (canvasId) => {
    currentScale = 1.4;
    await renderPage(currentPage, canvasId);
    updateZoomDisplay();
  };

  // ── Helpers ─────────────────────────────────────────────
  const updatePageControls = () => {
    const el = document.getElementById('reader-page-display');
    if (el) el.textContent = `Page ${currentPage} / ${totalPages}`;

    const prevBtn = document.getElementById('reader-prev-btn');
    const nextBtn = document.getElementById('reader-next-btn');
    if (prevBtn) prevBtn.disabled = currentPage <= 1;
    if (nextBtn) nextBtn.disabled = currentPage >= totalPages;

    const pageInput = document.getElementById('reader-page-input');
    if (pageInput) pageInput.value = currentPage;
  };

  const updateZoomDisplay = () => {
    const el = document.getElementById('reader-zoom-display');
    if (el) el.textContent = Math.round(currentScale * 100) + '%';
  };

  const updateReaderStatus = (msg) => {
    const el = document.getElementById('reader-status');
    if (el) {
      el.textContent = msg;
      el.style.display = msg ? 'flex' : 'none';
    }
  };

  // ── Open a PDF from a stored ArrayBuffer ───────────────
  // Used when restoring from IndexedDB (no File object available)
  const openFromArrayBuffer = async (arrayBuffer, name, docId, canvasId, onLoaded) => {
    try {
      await ensurePDFJS();
      updateReaderStatus('Opening…');

      // Use a copy of the buffer — PDF.js may internally consume the source
      const data = new Uint8Array(arrayBuffer.slice(0));
      const loadingTask = pdfjsLib.getDocument({ data });

      pdfDoc      = await loadingTask.promise;
      totalPages  = pdfDoc.numPages;
      currentPage = 1;
      currentDocId = docId;

      // Restore last-read page if saved
      const meta = Storage.getLibraryMeta().find(m => m.id === docId);
      if (meta && meta.lastPage > 1) currentPage = meta.lastPage;

      updateReaderStatus('');
      updatePageControls();
      await renderPage(currentPage, canvasId);
      onLoaded && onLoaded({ totalPages, name, docId });
    } catch (err) {
      updateReaderStatus('');
      window.showToast && showToast('Error opening PDF: ' + err.message, 'error');
      console.error('openFromArrayBuffer error:', err);
    }
  };

  const isLoaded = () => pdfDoc !== null;
  const getCurrentPage = () => currentPage;
  const getTotalPages = () => totalPages;

  const close = () => {
    pdfDoc = null;
    currentPage = 1;
    totalPages = 0;
    currentDocId = null;
    currentScale = 1.4;
  };

  return {
    openFile, openFromArrayBuffer,
    renderPage, goToPage, nextPage, prevPage,
    zoomIn, zoomOut, resetZoom,
    isLoaded, getCurrentPage, getTotalPages,
    close, updatePageControls, updateZoomDisplay,
    ensurePDFJSLoaded: ensurePDFJS   // public alias for app.js
  };
})();

window.Reader = Reader;

