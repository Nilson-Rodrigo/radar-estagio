import { supabase } from '../../../lib/supabase';

// Integração real com o Supabase Database (tabela `favorites`) — UC04.
// Assinaturas idênticas às da versão mock da Ana Rosa: getFavoriteJobIds e
// toggleFavorite. toggleFavorite checa se o par (user_id, job_id) já existe e
// decide entre .insert() (favoritar) e .delete() (desfavoritar). Há uma
// constraint de unicidade composta (user_id, job_id) no banco.
// Retorno de toggleFavorite: true = acabou de favoritar; false = desfavoritou.

export async function getFavoriteJobIds(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('favorites')
    .select('job_id')
    .eq('user_id', userId);

  if (error) {
    throw new Error(`Falha ao carregar os favoritos: ${error.message}`);
  }

  return ((data ?? []) as { job_id: string }[]).map((linha) => linha.job_id);
}

export async function toggleFavorite(userId: string, jobId: string): Promise<boolean> {
  const { data: existente, error: erroBusca } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('job_id', jobId)
    .maybeSingle();

  if (erroBusca) {
    throw new Error(`Falha ao verificar o favorito: ${erroBusca.message}`);
  }

  // Já era favorito -> remove (UC04, FA01).
  if (existente) {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('job_id', jobId);

    if (error) {
      throw new Error(`Falha ao remover o favorito: ${error.message}`);
    }

    return false;
  }

  // Não era favorito -> adiciona (UC04, fluxo principal).
  const { error } = await supabase
    .from('favorites')
    .insert({ user_id: userId, job_id: jobId });

  if (error) {
    throw new Error(`Falha ao adicionar o favorito: ${error.message}`);
  }

  return true;
}
