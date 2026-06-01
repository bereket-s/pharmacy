// js/cloud-db.js — Supabase Storage PDF manager
// Drop-in replacement for js/db.js (same interface: savePdf, getPdf, getAllPdfs, deletePdf)
// Requires supabase-config.js to be loaded first.

const DB = (() => {
  // ── Anonymous user ID (persists per browser) ──────────────
  const getUserId = () => {
    let uid = localStorage.getItem('pharmprep_uid');
    if (!uid) {
      uid = 'user_' + Math.random().toString(36).slice(2, 10) + '_' + Date.now();
      localStorage.setItem('pharmprep_uid', uid);
    }
    return uid;
  };

  const client = () => window.supabaseClient;

  // ── Check availability ────────────────────────────────────
  const isAvailable = () =>
    typeof supabase !== 'undefined' &&
    typeof window.supabaseClient !== 'undefined' &&
    SUPABASE_URL !== 'YOUR_SUPABASE_PROJECT_URL';

  // ── Save PDF: upload ArrayBuffer → Supabase Storage ───────
  const savePdf = async (id, name, arrayBuffer) => {
    if (!isAvailable()) throw new Error('Supabase not initialised');
    const uid = getUserId();
    const filePath = `${uid}/${id}.pdf`;

    // Upload raw bytes to 'pdfs' bucket
    const { data, error } = await client().storage
      .from('pdfs')
      .upload(filePath, arrayBuffer, {
        contentType: 'application/pdf',
        upsert: true
      });

    if (error) throw error;

    // Save metadata locally to track real names
    const meta = JSON.parse(localStorage.getItem('pharmprep_pdf_meta') || '{}');
    meta[id] = { id, name, size: arrayBuffer.byteLength, savedAt: Date.now(), uid };
    localStorage.setItem('pharmprep_pdf_meta', JSON.stringify(meta));

    return id;
  };

  // ── Get PDF: download from Supabase Storage → ArrayBuffer ──
  const getPdf = async (id) => {
    if (!isAvailable()) return null;
    const uid = getUserId();
    const filePath = `${uid}/${id}.pdf`;

    try {
      const { data, error } = await client().storage.from('pdfs').download(filePath);
      if (error) throw error;

      const arrayBuffer = await data.arrayBuffer();
      
      const metaMap = JSON.parse(localStorage.getItem('pharmprep_pdf_meta') || '{}');
      const meta = metaMap[id] || { name: 'Document.pdf', savedAt: Date.now() };

      return { id, name: meta.name, arrayBuffer, savedAt: meta.savedAt };
    } catch (err) {
      console.warn('getPdf failed:', err);
      return null;
    }
  };

  // ── Get all PDFs (metadata only, no bytes) ────────────────
  const getAllPdfs = async () => {
    if (!isAvailable()) return [];
    const uid = getUserId();
    
    try {
      // List files in the user's folder
      const { data, error } = await client().storage.from('pdfs').list(uid);
      if (error || !data) return [];

      const metaMap = JSON.parse(localStorage.getItem('pharmprep_pdf_meta') || '{}');

      // Map back to our stub format
      return data.filter(f => f.name.endsWith('.pdf')).map(f => {
        const id = f.name.replace('.pdf', '');
        const meta = metaMap[id] || { name: f.name, savedAt: new Date(f.created_at).getTime() };
        return {
          id:          id,
          name:        meta.name,
          savedAt:     meta.savedAt,
          arrayBuffer: null   // lazy-loaded in openDoc()
        };
      }).sort((a,b) => b.savedAt - a.savedAt);

    } catch (err) {
      console.warn('getAllPdfs failed:', err);
      return [];
    }
  };

  // ── Delete PDF from Supabase Storage ──────────────────────
  const deletePdf = async (id) => {
    if (!isAvailable()) return;
    const uid = getUserId();
    const filePath = `${uid}/${id}.pdf`;
    
    try {
      await client().storage.from('pdfs').remove([filePath]);
      
      const meta = JSON.parse(localStorage.getItem('pharmprep_pdf_meta') || '{}');
      delete meta[id];
      localStorage.setItem('pharmprep_pdf_meta', JSON.stringify(meta));
    } catch (err) {
      console.warn('deletePdf failed:', err);
    }
  };

  return { savePdf, getPdf, getAllPdfs, deletePdf, isAvailable, getUserId };
})();

window.DB = DB;
