export interface User {
  id: string;
  nome: string;
  email: string;
  curso: string | null;
  periodo: number | null;
  role: 'estudante' | 'admin';
}

export interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}