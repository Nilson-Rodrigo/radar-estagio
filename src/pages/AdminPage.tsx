import { useEffect } from "react";
import { supabase } from "../lib/supabase";

import { useState } from "react";

import VagasTable from "../components/VagasTable";
import NovaVagaModal from "../components/NovaVagaModal";
import Button from "../shared/ui/Button";

import type { Vaga } from "../types/Vaga";

export default function AdminPage() {
  const [modalAberto, setModalAberto] = useState(false);

  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [vagaEditando, setVagaEditando] = useState<Vaga | null>(null);

  async function adicionarVaga(vaga: Vaga) {
  if (vagaEditando) {
    const { error } = await supabase
      .from("vagas")
      .update({
        titulo: vaga.titulo,
        empresa: vaga.empresa,
        cidade: vaga.cidade,
        modalidade: vaga.modalidade,
        bolsa: vaga.bolsa,
        link: vaga.link,
      })
      .eq("id", vagaEditando.id);

    if (error) {
      console.error(error);
      alert("Erro ao atualizar a vaga.");
      return;
    }

    setVagaEditando(null);
  } else {
    const { error } = await supabase
      .from("vagas")
      .insert({
        titulo: vaga.titulo,
        empresa: vaga.empresa,
        cidade: vaga.cidade,
        modalidade: vaga.modalidade,
        bolsa: vaga.bolsa,
        link: vaga.link,
      });

    if (error) {
      console.error(error);
      alert("Erro ao cadastrar a vaga.");
      return;
    }
  }

  carregarVagas();
  setModalAberto(false);
}

  async function excluirVaga(id: number) {
    const { error } = await supabase
      .from("vagas")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Erro ao excluir a vaga.");
      console.log(error);
      return;
    }

    setVagas((antigas) =>
      antigas.filter((vaga) => vaga.id !== id)
    );
  }

  function editarVaga(vaga: Vaga) {
    setVagaEditando(vaga);
    setModalAberto(true);
  }

  async function carregarVagas() {
    const { data, error } = await supabase
      .from("vagas")
      .select("*");

    if (error) {
      console.error(error);
      return;
    }

    setVagas(data);
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
            Gerencie as vagas publicadas em uma tela simples, limpa e coerente com o restante do sistema.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => setModalAberto(true)}
          variant="secondary"
          className="w-full border border-[#c9ddd2] bg-white text-slate-900 hover:bg-[#f6fbf7] sm:w-auto"
        >
          + Nova vaga
        </Button>
      </section>

      <VagasTable
        vagas={vagas}
        onExcluir={excluirVaga}
        onEditar={editarVaga}
      />

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