import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Job } from '../entities/job/model/types';
import VagasTable from '../components/VagasTable';
import NovaVagaModal from '../components/NovaVagaModal';
import Button from '../shared/ui/Button';

type Feedback = { type: 'success' | 'error'; message: string };

export default function AdminPage() {
  const [modalAberto, setModalAberto] = useState(false);
  const [vagas, setVagas] = useState<Job[]>([]);
  const [vagaEditando, setVagaEditando] = useState<Job | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  function mostrarFeedback(fb: Feedback) {
    setFeedback(fb);
    setTimeout(() => setFeedback(null), 4000);
  }

  async function carregarVagas() {
    setCarregando(true);
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      mostrarFeedback({ type: 'error', message: `Erro ao carregar vagas: ${error.message}` });
    } else {
      setVagas((data ?? []) as Job[]);
    }
    setCarregando(false);
  }

  async function adicionarVaga(vaga: Omit<Job, 'id'>) {
    if (vagaEditando) {
      const { error } = await supabase
        .from('jobs')
        .update({
          titulo: vaga.titulo,
          empresa: vaga.empresa,
          descricao: vaga.descricao,
          cidade: vaga.cidade,
          modalidade: vaga.modalidade,
          area_atuacao: vaga.area_atuacao,
          link: vaga.link,
        })
        .eq('id', vagaEditando.id);

      if (error) {
        mostrarFeedback({ type: 'error', message: `Erro ao atualizar: ${error.message}` });
        return;
      }
      mostrarFeedback({ type: 'success', message: 'Vaga atualizada com sucesso!' });
      setVagaEditando(null);
    } else {
      const { error } = await supabase.from('jobs').insert({
        titulo: vaga.titulo,
        empresa: vaga.empresa,
        descricao: vaga.descricao,
        cidade: vaga.cidade,
        modalidade: vaga.modalidade,
        area_atuacao: vaga.area_atuacao,
        link: vaga.link,
      });

      if (error) {
        mostrarFeedback({ type: 'error', message: `Erro ao cadastrar: ${error.message}` });
        return;
      }
      mostrarFeedback({ type: 'success', message: 'Vaga cadastrada com sucesso!' });
    }

    await carregarVagas();
    setModalAberto(false);
  }

  async function excluirVaga(id: string) {
    const { error } = await supabase.from('jobs').delete().eq('id', id);
    if (error) {
      mostrarFeedback({ type: 'error', message: `Erro ao excluir: ${error.message}` });
      return;
    }
    setVagas((antigas) => antigas.filter((v) => v.id !== id));
    mostrarFeedback({ type: 'success', message: 'Vaga excluída.' });
  }

  function editarVaga(vaga: Job) {
    setVagaEditando(vaga);
    setModalAberto(true);
  }

  useEffect(() => {
    carregarVagas();
  }, []);

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <section className="flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Painel administrativo
          </p>
          <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Gerenciar Vagas
          </h1>
          <p className="max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
            Cadastre, edite e exclua vagas publicadas no mural de estágios.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => {
            setVagaEditando(null);
            setModalAberto(true);
          }}
          variant="primary"
          size="lg"
          className="w-full sm:w-auto"
        >
          + Nova vaga
        </Button>
      </section>

      {/* Feedback */}
      {feedback && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
            feedback.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Tabela */}
      {carregando ? (
        <p className="py-10 text-center text-sm text-slate-500">Carregando vagas...</p>
      ) : (
        <VagasTable vagas={vagas} onExcluir={excluirVaga} onEditar={editarVaga} />
      )}

      {/* Modal */}
      {modalAberto && (
        <NovaVagaModal
          onClose={() => {
            setModalAberto(false);
            setVagaEditando(null);
          }}
          onSalvar={adicionarVaga}
          vagaEditando={vagaEditando}
        />
      )}
    </div>
  );
}
