import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Fallbacks válidos (URL/valor não-vazios) usados apenas quando o .env não está
// definido. Sem isso, createClient() lança "supabaseUrl is required." no import e
// derruba todo o app (tela branca). Com o fallback, a interface carrega e as
// chamadas ao Supabase apenas falham de forma controlada até o .env ser configurado.
const FALLBACK_URL = 'https://placeholder.supabase.co';
const FALLBACK_ANON_KEY = 'public-anon-key-placeholder';

if (!isSupabaseConfigured) {
  console.warn(
    'Supabase não configurado: crie um arquivo .env com VITE_SUPABASE_URL e ' +
      'VITE_SUPABASE_ANON_KEY. As funcionalidades que dependem do banco/autenticação ' +
      'ficarão indisponíveis até lá.'
  );
}

export const supabase = createClient(
  supabaseUrl ?? FALLBACK_URL,
  supabaseAnonKey ?? FALLBACK_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      flowType: 'pkce',
    },
  }
);
