import { supabase, isSupabaseConfigured } from '../../../shared/lib/supabase';
import type { User } from '../model/types';

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

  if (code === 'email_not_confirmed' || message.includes('email not confirmed') || message.includes('email_not_confirmed')) {
    return new Error('CONFIRMAR_EMAIL');
  }

  if (
    code === 'over_request_rate_limit' ||
    code === 'rate_limit_exceeded' ||
    message.includes('over request rate limit') ||
    message.includes('rate limit') ||
    message.includes('too many requests') ||
    message.includes('retry after')
  ) {
    const secondsMatch = message.match(/(\d+)\s*(segundos?|seconds?)/i);
    const minutesMatch = message.match(/(\d+)\s*(minutos?|minutes?)/i);
    let waitLabel = 'alguns minutos';
    if (secondsMatch) {
      const seconds = Number(secondsMatch[1]);
      waitLabel = seconds >= 60 ? `${Math.ceil(seconds / 60)} minuto(s)` : `${seconds} segundo(s)`;
    } else if (minutesMatch) {
      waitLabel = `${Number(minutesMatch[1])} minuto(s)`;
    }
    return new Error(`Muitas tentativas. Aguarde ${waitLabel} antes de tentar novamente.`);
  }

  if (
    code === 'session_not_found' ||
    message.includes('auth session missing') ||
    message.includes('session missing') ||
    message.includes('session_not_found') ||
    message.includes('jwt expired') ||
    message.includes('invalid claim') ||
    message.includes('refresh_token_not_found') ||
    message.includes('refresh token not found')
  ) {
    return new Error('Sua sessão expirou. Faça login novamente para continuar.');
  }

  if (code === 'otp_expired' || message.includes('otp_expired') || message.includes('token has expired') || message.includes('expired') || message.includes('is invalid or has expired')) {
    return new Error('O link expirou ou é inválido. Solicite um novo link.');
  }

  if (code === 'weak_password' || message.includes('password should be') || message.includes('weak password') || message.includes('password is too short')) {
    return new Error('Senha muito fraca. Use ao menos 8 caracteres com letras, números e símbolos.');
  }

  if (code === 'validation_failed' || message.includes('unable to validate email address') || message.includes('invalid email')) {
    return new Error('E-mail inválido. Verifique o endereço digitado.');
  }

  if (code === 'email_exists' || message.includes('email address is already registered') || message.includes('already registered')) {
    return new Error('Este e-mail já está associado a uma conta ativa.');
  }

  if (code === 'signup_disabled' || message.includes('signups not allowed') || message.includes('signup is disabled')) {
    return new Error('Os cadastros estão temporariamente desativados. Tente novamente mais tarde.');
  }

  if (message.includes('network') || message.includes('timeout') || message.includes('fetch')) {
    return new Error('Erro de comunicação com o servidor. Verifique sua conexão e tente novamente.');
  }

  if (!isSupabaseConfigured) {
    return new Error('A autenticação via Supabase ainda não está configurada. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.');
  }

  return new Error('Não foi possível concluir a operação. Tente novamente em instantes.');
}

async function getProfileByUserId(userId: string): Promise<Partial<User> | null> {
  if (!isSupabaseConfigured) {
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

export interface SignUpResult {
  user: User | null;
  needsEmailConfirmation: boolean;
}

export const authService = {
  isConfigured(): boolean {
    return isSupabaseConfigured;
  },

  subscribeToAuthChanges(callback: (event: string) => void) {
    if (!isSupabaseConfigured) {
      return { data: { subscription: { unsubscribe: () => undefined } } };
    }

    return supabase.auth.onAuthStateChange((event) => {
      callback(event);
    });
  },

  async getCurrentUser(): Promise<User | null> {
    if (!isSupabaseConfigured) {
      return null;
    }

    const { data: userData, error } = await supabase.auth.getUser();
    if (error || !userData.user) {
      return null;
    }

    return buildUserFromAuthUser(userData.user);
  },

  async signUpWithEmail(email: string, password: string, payload: { nome: string; curso?: string | null; periodo?: number | null }): Promise<SignUpResult> {
    if (!isSupabaseConfigured) {
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
      return { user: null, needsEmailConfirmation: false };
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
    } catch (error) {
      if (error instanceof Error) {
        const relationMissing = /relation .*users.* does not exist|does not exist/i.test(error.message);
        if (relationMissing) {
          console.warn('Tabela users ainda não está disponível no Supabase.', error.message);
        } else {
          console.error('Falha ao sincronizar perfil do usuário após cadastro.', error);
        }
      } else {
        console.error('Falha ao sincronizar perfil do usuário após cadastro.', error);
      }
    }

    const user = await buildUserFromAuthUser(data.user);
    const needsEmailConfirmation = !data.session;

    return { user, needsEmailConfirmation };
  },

  async resendConfirmationEmail(email: string): Promise<void> {
    if (!isSupabaseConfigured) {
      throw mapSupabaseError(null);
    }

    const { error } = await supabase.auth.resend({ type: 'signup', email });
    if (error) {
      throw mapSupabaseError(error);
    }
  },

  async resetPasswordForEmail(email: string): Promise<void> {
    if (!isSupabaseConfigured) {
      throw mapSupabaseError(null);
    }

    const redirectTo = `${window.location.origin}/redefinir-senha`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) {
      throw mapSupabaseError(error);
    }
  },

  async updatePassword(password: string): Promise<void> {
    if (!isSupabaseConfigured) {
      throw mapSupabaseError(null);
    }

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      throw mapSupabaseError(error);
    }
  },

  async signInWithPassword(email: string, password: string): Promise<User | null> {
    if (!isSupabaseConfigured) {
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
    if (!isSupabaseConfigured) {
      return;
    }

    await supabase.auth.signOut();
  },
};
