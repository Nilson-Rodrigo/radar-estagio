import { useState, useEffect } from 'react';
import type { User } from '../types/User';

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

/**
 * VERSÃO PROVISÓRIA — implementação temporária criada pela Ana Rosa
 * para viabilizar o desenvolvimento do módulo de Vagas/Favoritos (UC03/UC04)
 * em paralelo, enquanto a autenticação real (UC01/UC02, responsabilidade
 * do Wesley) ainda não foi integrada ao Supabase Auth.
 *
 * Contrato de retorno mantido idêntico ao que a implementação final deve
 * seguir, para permitir substituição sem alterar nenhum componente que
 * consome este hook.
 *
 * TODO (Wesley): substituir o corpo desta função pela leitura real da
 * sessão via supabase.auth.getSession() / onAuthStateChange(), buscando
 * o registro correspondente na tabela `users` (incluindo o campo `role`).
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula um estudante autenticado para permitir testar
    // a busca de vagas e o favoritar/desfavoritar (UC03/UC04).
    const usuarioSimulado: User = {
      id: 'temp-usuario-teste',
      nome: 'Estudante de Teste',
      email: 'teste@aluno.ifpi.edu.br',
      curso: 'Análise e Desenvolvimento de Sistemas',
      periodo: 3,
      role: 'estudante',
      created_at: new Date().toISOString(),
    };

    setUser(usuarioSimulado);
    setLoading(false);
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
  };
}