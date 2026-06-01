// js/db.js — IndexedDB wrapper for persistent PDF storage
// PDFs are stored as ArrayBuffers so they survive page refreshes.

const DB = (() => {
  const DB_NAME    = 'pharmprep_db';
  const DB_VERSION = 1;
  const STORE      = 'pdfs';

  let _db = null;

  // ── Open / create the database ──────────────────────────
  const open = () => new Promise((resolve, reject) => {
    if (_db) { resolve(_db); return; }

    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' });
      }
    };

    req.onsuccess  = (e) => { _db = e.target.result; resolve(_db); };
    req.onerror    = ()  => reject(req.error);
    req.onblocked  = ()  => reject(new Error('IndexedDB blocked'));
  });

  // ── Save a PDF ──────────────────────────────────────────
  const savePdf = async (id, name, arrayBuffer) => {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put({ id, name, arrayBuffer, savedAt: Date.now() });
      tx.oncomplete = () => resolve(id);
      tx.onerror    = () => reject(tx.error);
    });
  };

  // ── Retrieve a single PDF by id ─────────────────────────
  const getPdf = async (id) => {
    const db = await open();
    return new Promise((resolve, reject) => {
      const req = db.transaction(STORE).objectStore(STORE).get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror   = () => reject(req.error);
    });
  };

  // ── Retrieve ALL stored PDFs ────────────────────────────
  const getAllPdfs = async () => {
    const db = await open();
    return new Promise((resolve, reject) => {
      const req = db.transaction(STORE).objectStore(STORE).getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror   = () => reject(req.error);
    });
  };

  // ── Delete a PDF ────────────────────────────────────────
  const deletePdf = async (id) => {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).delete(id);
      tx.oncomplete = resolve;
      tx.onerror    = () => reject(tx.error);
    });
  };

  // ── Check if IndexedDB is usable ───────────────────────
  const isAvailable = () => typeof indexedDB !== 'undefined';

  return { savePdf, getPdf, getAllPdfs, deletePdf, isAvailable, open };
})();

window.DB = DB;
