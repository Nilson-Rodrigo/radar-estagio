import type { Vaga } from "../types/Vaga";
import Badge from "../shared/ui/Badge";
import Button from "../shared/ui/Button";
import Card from "../shared/ui/Card";

type VagasTableProps = {
    vagas: Vaga[];
    onExcluir: (id: number) => void;
    onEditar: (vaga: Vaga) => void;
};

export default function VagasTable({
    vagas,
    onExcluir,
    onEditar,
}: VagasTableProps) {
    return (
        <Card className="overflow-hidden border border-[#d8eadf] bg-white text-slate-900 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#e4efe7] px-6 py-4 sm:px-8">
                <div>
                    <h2 className="font-display text-xl font-bold tracking-tight text-slate-900">
                        Vagas cadastradas
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                        {vagas.length} {vagas.length === 1 ? "vaga" : "vagas"} no painel.
                    </p>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#e4efe7]">
                    <thead className="bg-[#f9fcfa]">
                        <tr className="text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                            <th className="px-6 py-4 sm:px-8">Empresa</th>
                            <th className="px-6 py-4">Vaga</th>
                            <th className="px-6 py-4">Cidade</th>
                            <th className="px-6 py-4">Modalidade</th>
                            <th className="px-6 py-4">Bolsa</th>
                            <th className="px-6 py-4 text-right">Ações</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-[#edf4ef] bg-white">
                        {vagas.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-14 text-center sm:px-8">
                                    <div className="mx-auto max-w-sm space-y-2">
                                        <p className="font-display text-lg font-semibold text-slate-900">
                                            Nenhuma vaga cadastrada ainda.
                                        </p>
                                        <p className="text-sm leading-6 text-slate-600">
                                            Clique em Nova vaga para começar a publicar oportunidades.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            vagas.map((vaga) => (
                                <tr key={vaga.id} className="transition-colors hover:bg-[#f8fcf9]">
                                    <td className="px-6 py-5 sm:px-8">
                                        <div className="font-medium text-slate-900">{vaga.empresa}</div>
                                    </td>
                                    <td className="px-6 py-5 text-slate-700">{vaga.titulo}</td>
                                    <td className="px-6 py-5 text-slate-700">{vaga.cidade}</td>
                                    <td className="px-6 py-5">
                                        <Badge variant="neutral" className="border-[#d2e5d8] bg-white text-slate-800">
                                            {vaga.modalidade}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-5 text-slate-700">{vaga.bolsa}</td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => onEditar(vaga)}
                                                className="border border-[#d2e5d8] bg-white text-slate-900 hover:bg-[#f6fbf7]"
                                            >
                                                Editar
                                            </Button>

                                            <Button
                                                type="button"
                                                variant="danger"
                                                size="sm"
                                                className="border border-[#d2e5d8] bg-white text-slate-900 hover:bg-[#f6fbf7]"
                                                onClick={() => onExcluir(vaga.id!)}
                                            >
                                                Excluir
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}