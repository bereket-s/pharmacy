// js/supabase-config.js
// ══════════════════════════════════════════════════════════
//  STEP 1 — Go to https://supabase.com and create a project
//  STEP 2 — Wait 2 mins for database to provision
//  STEP 3 — Go to Storage → Create a bucket named "pdfs" (make it Public)
//  STEP 4 — Go to Project Settings → API
//  STEP 5 — Copy your Project URL and anon key into the variables below
// ══════════════════════════════════════════════════════════

const SUPABASE_URL  = "https://wtqkxwdwilfpyuflresft.supabase.co";
const SUPABASE_KEY  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0cWt4ZHdpbGZweXVmbHJlc2Z0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMzYxOTgsImV4cCI6MjA5NTkxMjE5OH0.4A49bgexXUBB9qC7qB0C7jIYt4bmzQS_EJbT3UMHEDI";

// Initialize Supabase client
window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
