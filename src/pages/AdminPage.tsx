import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Job } from '../entities/job/model/types';
import VagasTable from '../components/VagasTable';
import NovaVagaModal from '../components/NovaVagaModal';
import Button from '../shared/ui/Button';

export default function AdminPage() {
  const [modalAberto, setModalAberto] = useState(false);
  const [vagas, setVagas] = useState<Job[]>([]);
  const [vagaEditando, setVagaEditando] = useState<Job | null>(null);

  async function carregarVagas() {
    const { data, error } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Erro ao carregar vagas:', error.message);
      return;
    }
    setVagas((data ?? []) as Job[]);
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
        console.error('Erro ao atualizar vaga:', error.message);
        alert('Erro ao atualizar a vaga.');
        return;
      }
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
        console.error('Erro ao cadastrar vaga:', error.message);
        alert('Erro ao cadastrar a vaga.');
        return;
      }
    }

    carregarVagas();
    setModalAberto(false);
  }

  async function excluirVaga(id: string) {
    const { error } = await supabase.from('jobs').delete().eq('id', id);
    if (error) {
      console.error('Erro ao excluir vaga:', error.message);
      alert('Erro ao excluir a vaga.');
      return;
    }
    setVagas((antigas) => antigas.filter((v) => v.id !== id));
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
      <section className="flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Página do administrador
          </p>
          <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Painel do Administrador
          </h1>
          <p className="max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
            Gerencie as vagas publicadas no mural de estágios.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => {
            setVagaEditando(null);
            setModalAberto(true);
          }}
          variant="secondary"
          className="w-full border border-[#c9ddd2] bg-white text-slate-900 hover:bg-[#f6fbf7] sm:w-auto"
        >
          + Nova vaga
        </Button>
      </section>

      <VagasTable vagas={vagas} onExcluir={excluirVaga} onEditar={editarVaga} />

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
