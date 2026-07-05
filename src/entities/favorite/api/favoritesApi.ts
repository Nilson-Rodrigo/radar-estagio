import type { Favorite } from '../model/types';

// TODO(Eric): substituir este mock pela integração real com Supabase Database.
// Contrato a preservar: as assinaturas de getFavoriteJobIds e toggleFavorite
// abaixo. Nenhum componente ou hook que consome favoritesApi precisa ser
// alterado quando a versão real entrar — só o corpo destas funções muda.
// Ao integrar (UC04): toggleFavorite deve checar se o par (user_id, job_id) já
// existe na tabela favorites e decidir entre .insert() ou .delete(); há uma
// constraint de unicidade composta sobre (user_id, job_id) no banco real.

const MOCK_FAVORITES: Favorite[] = [
  {
    id: 'fav-1',
    user_id: 'mock-user-id',
    job_id: '1',
    created_at: new Date().toISOString(),
  },
  {
    id: 'fav-2',
    user_id: 'mock-user-id',
    job_id: '5',
    created_at: new Date().toISOString(),
  },
];

function atrasoSimulado<T>(valor: T, ms = 250): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(valor), ms));
}

export async function getFavoriteJobIds(userId: string): Promise<string[]> {
  const ids = MOCK_FAVORITES
    .filter((fav) => fav.user_id === userId)
    .map((fav) => fav.job_id);

  return atrasoSimulado(ids);
}

export async function toggleFavorite(userId: string, jobId: string): Promise<boolean> {
  const indiceExistente = MOCK_FAVORITES.findIndex(
    (fav) => fav.user_id === userId && fav.job_id === jobId
  );

  if (indiceExistente >= 0) {
    // Já era favorito: remove (comportamento .delete() do UC04, FA01).
    MOCK_FAVORITES.splice(indiceExistente, 1);
    return atrasoSimulado(false);
  }

  // Não era favorito: adiciona (comportamento .insert() do UC04, fluxo principal).
  MOCK_FAVORITES.push({
    id: `fav-${Date.now()}`,
    user_id: userId,
    job_id: jobId,
    created_at: new Date().toISOString(),
  });
  return atrasoSimulado(true);
}