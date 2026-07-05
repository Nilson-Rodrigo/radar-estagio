import { useEffect, useState } from "react";
import type { Vaga } from "../types/Vaga";

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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white rounded-xl p-8 w-[500px]">
                <h2 className="text-2xl font-bold mb-6">
                    {vagaEditando ? "Editar Vaga" : "Nova Vaga"}
                </h2>

                <div className="space-y-4">
                    <input
                        className="border rounded-lg w-full p-3"
                        placeholder="Título da vaga"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                    />

                    <input
                        className="border rounded-lg w-full p-3"
                        placeholder="Empresa"
                        value={empresa}
                        onChange={(e) => setEmpresa(e.target.value)}
                    />


                    <input
                        className="border rounded-lg w-full p-3"
                        placeholder="Cidade"
                        value={cidade}
                        onChange={(e) => setCidade(e.target.value)}
                    />

                    <select
                        className="border rounded-lg w-full p-3"
                        value={modalidade}
                        onChange={(e) => setModalidade(e.target.value)}
                    >
                        <option>Remoto</option>
                        <option>Presencial</option>
                        <option>Híbrido</option>
                    </select>

                    <input
                        className="border rounded-lg w-full p-3"
                        placeholder="Bolsa (Ex: R$ 1.500,00)"
                        value={bolsa}
                        onChange={(e) => setBolsa(e.target.value)}
                    />

                    <input
                        className="border rounded-lg w-full p-3"
                        placeholder="Link da vaga"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                    />




                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            onClick={onClose}
                            className="px-5 py-2 border rounded-lg"
                        >
                            Cancelar
                        </button>

                        <button
                            onClick={salvar}
                            className="bg-blue-600 text-white px-5 py-2 rounded-lg"
                        >
                            Salvar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}