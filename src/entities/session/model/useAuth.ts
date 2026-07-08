import { useEffect, useState } from 'react';
import type { User, UseAuthReturn } from './types';

// TODO(Wesley): substituir este mock pela integração real com Supabase Auth (UC01/UC02).
// Contrato a preservar: UseAuthReturn (ver types.ts). Nenhum componente ou hook que
// consome useAuth() precisa ser alterado quando a versão real entrar — só o corpo
// desta função muda.
const MOCK_USER: User = {
  id: 'mock-user-id',
  nome: 'Estudante Teste',
  email: 'estudante.teste@aluno.ifpi.edu.br',
  curso: 'Análise e Desenvolvimento de Sistemas',
  periodo: 3,
  role: 'estudante',
};

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setUser(MOCK_USER);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
  };
}