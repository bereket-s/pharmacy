// js/supabase-config.js

const SUPABASE_URL  = "https://wtqkxwdwilfpyuflresft.supabase.co";
const SUPABASE_KEY  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0cWt4ZHdpbGZweXVmbHJlc2Z0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMzYxOTgsImV4cCI6MjA5NTkxMjE5OH0.4A49bgexXUBB9qC7qB0C7jIYt4bmzQS_EJbT3UMHEDI";

// Initialize Supabase client
window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
