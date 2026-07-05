import { useEffect } from "react";
import { supabase } from "../lib/supabase";

import { useState } from "react";

import Sidebar from "../components/Sidebar";
import AdminHeader from "../components/AdminHeader";
import VagasTable from "../components/VagasTable";
import NovaVagaModal from "../components/NovaVagaModal";

import type { Vaga } from "../types/Vaga";

export default function AdminPage() {
  const [modalAberto, setModalAberto] = useState(false);

  const [vagas, setVagas] = useState<Vaga[]>([]);

 async function adicionarVaga(vaga: Vaga) {
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
  console.error("Erro Supabase:", error);
  alert(error.message);
  return;
}

  carregarVagas();
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
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-8">
        <AdminHeader onNovaVaga={() => setModalAberto(true)} />

        <VagasTable
          vagas={vagas}
          onExcluir={excluirVaga}
        />

        {modalAberto && (
          <NovaVagaModal
            onClose={() => setModalAberto(false)}
            onSalvar={adicionarVaga}
          />
        )}
      </main>
    </div>
  );
}