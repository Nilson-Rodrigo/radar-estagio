import { useEffect, useState } from "react";
import type { Vaga } from "../types/Vaga";
import Button from "../shared/ui/Button";
import Card from "../shared/ui/Card";

type Props = {
    onClose: () => void;
    onSalvar: (vaga: Vaga) => void;
    vagaEditando: Vaga | null;
};

export default function NovaVagaModal({
    onClose,
    onSalvar,
    vagaEditando,
}: Props) {
    const [titulo, setTitulo] = useState("");
    const [empresa, setEmpresa] = useState("");
    const [cidade, setCidade] = useState("");
    const [modalidade, setModalidade] = useState("Remoto");
    const [bolsa, setBolsa] = useState("");
    const [link, setLink] = useState("");

    useEffect(() => {
        if (!vagaEditando) return;

        setTitulo(vagaEditando.titulo);
        setEmpresa(vagaEditando.empresa);
        setCidade(vagaEditando.cidade);
        setModalidade(vagaEditando.modalidade);
        setBolsa(vagaEditando.bolsa);
        setLink(vagaEditando.link);
    }, [vagaEditando]);

    function salvar() {
        if (!titulo.trim() || !empresa.trim()) {
            alert("Preencha todos os campos.");
            return;
        }

        const novaVaga: Vaga = {
            titulo,
            empresa,
            cidade,
            modalidade,
            bolsa,
            link,
        };

        onSalvar(novaVaga);

        setTitulo("");
        setEmpresa("");

        onClose();
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8 backdrop-blur-sm">
            <Card className="w-full max-w-2xl overflow-hidden border border-[#cfe5d9] bg-[#eef8f2] text-slate-900 shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
                <div className="border-b border-[#d8eadf] bg-[#f7fbf8] px-6 py-5 sm:px-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Painel administrativo
                    </p>
                    <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-900">
                        {vagaEditando ? "Editar vaga" : "Nova vaga"}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                        Preencha as informações da oportunidade com o mesmo padrão visual do sistema.
                    </p>
                </div>

                <div className="grid gap-4 px-6 py-6 sm:px-8">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="space-y-2 text-sm font-medium text-slate-800">
                            <span>Título da vaga</span>
                            <input
                                className="w-full rounded-control border border-[#d2e5d8] bg-[#fbfdfc] px-4 py-3 text-slate-900 shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-[#a9caba] focus:outline-none focus:ring-2 focus:ring-[#d8eadf]"
                                placeholder="Título da vaga"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                            />
                        </label>

                        <label className="space-y-2 text-sm font-medium text-slate-800">
                            <span>Empresa</span>
                            <input
                                className="w-full rounded-control border border-[#d2e5d8] bg-[#fbfdfc] px-4 py-3 text-slate-900 shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-[#a9caba] focus:outline-none focus:ring-2 focus:ring-[#d8eadf]"
                                placeholder="Empresa"
                                value={empresa}
                                onChange={(e) => setEmpresa(e.target.value)}
                            />
                        </label>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="space-y-2 text-sm font-medium text-slate-800">
                            <span>Cidade</span>
                            <input
                                className="w-full rounded-control border border-[#d2e5d8] bg-[#fbfdfc] px-4 py-3 text-slate-900 shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-[#a9caba] focus:outline-none focus:ring-2 focus:ring-[#d8eadf]"
                                placeholder="Cidade"
                                value={cidade}
                                onChange={(e) => setCidade(e.target.value)}
                            />
                        </label>

                        <label className="space-y-2 text-sm font-medium text-slate-800">
                            <span>Modalidade</span>
                            <select
                                className="w-full rounded-control border border-[#d2e5d8] bg-[#fbfdfc] px-4 py-3 text-slate-900 shadow-sm transition-all duration-200 focus:border-[#a9caba] focus:outline-none focus:ring-2 focus:ring-[#d8eadf]"
                                value={modalidade}
                                onChange={(e) => setModalidade(e.target.value)}
                            >
                                <option>Remoto</option>
                                <option>Presencial</option>
                                <option>Híbrido</option>
                            </select>
                        </label>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="space-y-2 text-sm font-medium text-slate-800">
                            <span>Bolsa</span>
                            <input
                                className="w-full rounded-control border border-[#d2e5d8] bg-[#fbfdfc] px-4 py-3 text-slate-900 shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-[#a9caba] focus:outline-none focus:ring-2 focus:ring-[#d8eadf]"
                                placeholder="Ex: R$ 1.500,00"
                                value={bolsa}
                                onChange={(e) => setBolsa(e.target.value)}
                            />
                        </label>

                        <label className="space-y-2 text-sm font-medium text-slate-800">
                            <span>Link da vaga</span>
                            <input
                                className="w-full rounded-control border border-[#d2e5d8] bg-[#fbfdfc] px-4 py-3 text-slate-900 shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-[#a9caba] focus:outline-none focus:ring-2 focus:ring-[#d8eadf]"
                                placeholder="Link da vaga"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                            />
                        </label>
                    </div>

                    <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            className="w-full border border-[#d2e5d8] bg-[#fbfdfc] text-slate-900 hover:bg-white sm:w-auto"
                        >
                            Cancelar
                        </Button>

                        <Button
                            type="button"
                            onClick={salvar}
                            className="w-full border border-[#d2e5d8] bg-white text-slate-900 hover:bg-[#f6fbf7] sm:w-auto"
                        >
                            Salvar
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}