// js/cloud-db.js — Supabase Storage PDF manager
// Drop-in replacement for js/db.js (same interface: savePdf, getPdf, getAllPdfs, deletePdf)
// Requires supabase-config.js to be loaded first.

const DB = (() => {
  // ── Anonymous user ID (persists per browser) ──────────────
  const getUserId = () => {
    return 'global_shared';
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
    const safeName = name.replace(/[^a-zA-Z0-9.\-_ ()]/g, '_');
    const filePath = `${uid}/${safeName}`;

    const { data, error } = await client().storage
      .from('pdfs')
      .upload(filePath, arrayBuffer, {
        contentType: 'application/pdf',
        upsert: true
      });

    if (error) throw error;
    return safeName; // Return the filename as the ID
  };

  // ── Get PDF: download from Supabase Storage → ArrayBuffer ──
  const getPdf = async (id) => {
    if (!isAvailable()) return null;
    const uid = getUserId();
    const filePath = `${uid}/${id}`; // ID is now the safeName

    try {
      const { data, error } = await client().storage.from('pdfs').download(filePath);
      if (error) throw error;

      const arrayBuffer = await data.arrayBuffer();
      return { id, name: id, arrayBuffer, savedAt: Date.now() };
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
      const { data, error } = await client().storage.from('pdfs').list(uid);
      if (error || !data) return [];

      return data.filter(f => f.name.endsWith('.pdf')).map(f => {
        return {
          id:          f.name, // The filename is the ID
          name:        f.name,
          savedAt:     new Date(f.created_at).getTime(),
          arrayBuffer: null
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
    const filePath = `${uid}/${id}`;
    
    try {
      const { error } = await client().storage.from('pdfs').remove([filePath]);
      if (error) throw error;
    } catch(err) {
      console.warn('deletePdf failed:', err);
    }
  };

  return { savePdf, getPdf, getAllPdfs, deletePdf, isAvailable, getUserId };
})();

window.DB = DB;
