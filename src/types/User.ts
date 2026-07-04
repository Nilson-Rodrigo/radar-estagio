export interface User {
  id: string;
  nome: string;
  email: string;
  curso: string | null;
  periodo: number | null;
  role: 'estudante' | 'admin';
  created_at: string;
}