// DiscoverInk - Supabase Client
// The anon key is safe to expose in client-side code.
// Access is controlled by Row Level Security policies in Supabase.
(function () {
  const SUPABASE_URL = 'https://hstivxzrhhfulctfgfow.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzdGl2eHpyaGhmdWxjdGZnZm93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNTI1NTIsImV4cCI6MjA4ODcyODU1Mn0.jqxcqh4k7Qdw6Fo2UVwh9HmxEbhC6t_RRVlkVj5rdyk';
  if (window.supabase && window.supabase.createClient) {
    window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
})();
