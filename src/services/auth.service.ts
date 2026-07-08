import { createClient } from '@supabase/supabase-js';
import type { User } from '../entities/session/model/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const missingAuthConfig = !supabaseUrl || !supabaseAnonKey;

export const supabase = missingAuthConfig
  ? null
  : createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        flowType: 'pkce',
      },
    });

function normalizeRole(role: unknown): User['role'] {
  return role === 'admin' ? 'admin' : 'estudante';
}

function normalizePeriod(periodo: unknown): number | null {
  if (typeof periodo === 'number' && Number.isFinite(periodo)) {
    return periodo;
  }

  if (typeof periodo === 'string' && periodo.trim() !== '') {
    const parsed = Number(periodo);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function getDisplayName(authUser: { user_metadata?: Record<string, unknown>; email?: string | null }, profileName?: string | null): string {
  if (typeof profileName === 'string' && profileName.trim()) {
    return profileName.trim();
  }

  const metadataName = authUser.user_metadata?.name;
  if (typeof metadataName === 'string' && metadataName.trim()) {
    return metadataName.trim();
  }

  const metadataFullName = authUser.user_metadata?.full_name;
  if (typeof metadataFullName === 'string' && metadataFullName.trim()) {
    return metadataFullName.trim();
  }

  return authUser.email?.split('@')[0] ?? 'Usuário';
}

function mapSupabaseError(error: { message?: string; code?: string } | null | undefined): Error {
  if (!error) {
    return new Error('Não foi possível concluir a operação. Tente novamente.');
  }

  const code = error.code?.toLowerCase();
  const message = error.message?.toLowerCase() ?? '';

  if (code === 'user_already_exists' || message.includes('user already exists')) {
    return new Error('Este e-mail já está associado a uma conta ativa.');
  }

  if (code === 'invalid_credentials' || message.includes('invalid login credentials') || message.includes('invalid_credentials')) {
    return new Error('E-mail ou senha incorretos.');
  }

  if (message.includes('over request rate limit') || message.includes('rate limit')) {
    return new Error('Muitas tentativas. Aguarde 2 minutos antes de tentar novamente.');
  }

  if (message.includes('network') || message.includes('timeout') || message.includes('fetch')) {
    return new Error('Erro de comunicação com o servidor. Verifique sua conexão e tente novamente.');
  }

  if (!supabase) {
    return new Error('A autenticação via Supabase ainda não está configurada. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.');
  }

  return new Error(error.message ?? 'Não foi possível concluir a operação.');
}

async function getProfileByUserId(userId: string): Promise<Partial<User> | null> {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('users')
    .select('id, nome, email, curso, periodo, role')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    return null;
  }

  return data as Partial<User> | null;
}

async function buildUserFromAuthUser(authUser: {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown>;
}): Promise<User | null> {
  const profile = await getProfileByUserId(authUser.id);

  return {
    id: authUser.id,
    nome: getDisplayName(authUser, profile?.nome ?? null),
    email: authUser.email ?? profile?.email ?? '',
    curso: typeof profile?.curso === 'string' ? profile.curso : null,
    periodo: normalizePeriod(profile?.periodo ?? null),
    role: normalizeRole(profile?.role ?? authUser.user_metadata?.role ?? 'estudante'),
  };
}

export const authService = {
  isConfigured(): boolean {
    return Boolean(supabase);
  },

  subscribeToAuthChanges(callback: (event: string) => void) {
    if (!supabase) {
      return { data: { subscription: { unsubscribe: () => undefined } } };
    }

    return supabase.auth.onAuthStateChange((event) => {
      callback(event);
    });
  },

  async getCurrentUser(): Promise<User | null> {
    if (!supabase) {
      return null;
    }

    const { data: userData, error } = await supabase.auth.getUser();
    if (error || !userData.user) {
      return null;
    }

    return buildUserFromAuthUser(userData.user);
  },

  async signUpWithEmail(email: string, password: string, payload: { nome: string; curso?: string | null; periodo?: number | null }): Promise<User | null> {
    if (!supabase) {
      throw mapSupabaseError(null);
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: payload.nome,
          full_name: payload.nome,
          curso: payload.curso ?? null,
          periodo: payload.periodo ?? null,
          role: 'estudante',
        },
      },
    });

    if (error) {
      throw mapSupabaseError(error);
    }

    if (!data.user) {
      return null;
    }

    try {
      await supabase.from('users').upsert({
        id: data.user.id,
        nome: payload.nome,
        email,
        curso: payload.curso ?? null,
        periodo: payload.periodo ?? null,
        role: 'estudante',
      }, { onConflict: 'id' });
    } catch {
      // Ignora falha de sincronização de perfil quando a tabela ainda não está disponível.
    }

    return buildUserFromAuthUser(data.user);
  },

  async signInWithPassword(email: string, password: string): Promise<User | null> {
    if (!supabase) {
      throw mapSupabaseError(null);
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw mapSupabaseError(error);
    }

    if (!data.user) {
      return null;
    }

    return buildUserFromAuthUser(data.user);
  },

  async signOut(): Promise<void> {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
  },
};
