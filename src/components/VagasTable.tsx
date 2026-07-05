import type { Vaga } from "../types/Vaga";

type VagasTableProps = {
    vagas: Vaga[];
    onExcluir: (id: number) => void;
};

export default function VagasTable({
    vagas,
    onExcluir,
}: VagasTableProps) {
    return (
        <div className="bg-white rounded-xl shadow p-6">
            <table className="w-full">
                <thead>
                    <tr className="border-b text-left">
                        <th className="pb-3">Empresa</th>
                        <th className="pb-3">Cargo</th>
                        <th className="pb-3">Ações</th>
                    </tr>
                </thead>

                <tbody>
                    {vagas.length === 0 ? (
                        <tr>
                            <td colSpan={3} className="py-4 text-center text-gray-500">
                                Nenhuma vaga cadastrada.
                            </td>
                        </tr>
                    ) : (
                        vagas.map((vaga) => (
                            <tr key={vaga.id} className="border-b">
                                <td className="py-4">{vaga.empresa}</td>
                                <td>{vaga.titulo}</td>
                                <td>
                                    <button className="text-blue-600 mr-4">
                                        Editar
                                    </button>

                                    <button
                                        onClick={() => onExcluir(vaga.id!)}
                                        className="text-red-600"
                                    >
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}