import { useEffect, useState } from 'react';
import type { Job } from '../../../entities/job/model/types';
import Button from '../../../shared/ui/Button';
import Card from '../../../shared/ui/Card';

type Props = {
  onClose: () => void;
  onSalvar: (vaga: Omit<Job, 'id'>) => void;
  vagaEditando: Job | null;
};

export default function NovaVagaModal({ onClose, onSalvar, vagaEditando }: Props) {
  const [titulo, setTitulo] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [descricao, setDescricao] = useState('');
  const [cidade, setCidade] = useState('');
  const [modalidade, setModalidade] = useState<Job['modalidade']>('Remoto');
  const [areaAtuacao, setAreaAtuacao] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    if (!vagaEditando) return;
    setTitulo(vagaEditando.titulo);
    setEmpresa(vagaEditando.empresa);
    setDescricao(vagaEditando.descricao);
    setCidade(vagaEditando.cidade);
    setModalidade(vagaEditando.modalidade);
    setAreaAtuacao(vagaEditando.area_atuacao);
    setLink(vagaEditando.link);
  }, [vagaEditando]);

  function salvar() {
    if (!titulo.trim() || !empresa.trim() || !descricao.trim()) {
      alert('Título, empresa e descrição são obrigatórios.');
      return;
    }

    onSalvar({ titulo, empresa, descricao, cidade, modalidade, area_atuacao: areaAtuacao, link });
    onClose();
  }

  const inputClass =
    'w-full rounded-control border border-[#d2e5d8] bg-[#fbfdfc] px-4 py-3 text-slate-900 shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-[#a9caba] focus:outline-none focus:ring-2 focus:ring-[#d8eadf]';
  const labelClass = 'space-y-2 text-sm font-medium text-slate-800';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8 backdrop-blur-sm">
      <Card className="w-full max-w-2xl overflow-hidden border border-[#cfe5d9] bg-[#eef8f2] text-slate-900 shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
        <div className="border-b border-[#d8eadf] bg-[#f7fbf8] px-6 py-5 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Painel administrativo
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-900">
            {vagaEditando ? 'Editar vaga' : 'Nova vaga'}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Preencha as informações da oportunidade de estágio.
          </p>
        </div>

        <div className="grid gap-4 px-6 py-6 sm:px-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={labelClass}>
              <span>Título da vaga</span>
              <input
                className={inputClass}
                placeholder="Ex: Estagiário de Desenvolvimento"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </label>

            <label className={labelClass}>
              <span>Empresa</span>
              <input
                className={inputClass}
                placeholder="Nome da empresa"
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
              />
            </label>
          </div>

          <label className={labelClass}>
            <span>Descrição</span>
            <textarea
              className={`${inputClass} min-h-[90px] resize-y`}
              placeholder="Descreva as atividades, requisitos e diferenciais da vaga..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className={labelClass}>
              <span>Área de atuação</span>
              <input
                className={inputClass}
                placeholder="Ex: Tecnologia da Informação"
                value={areaAtuacao}
                onChange={(e) => setAreaAtuacao(e.target.value)}
              />
            </label>

            <label className={labelClass}>
              <span>Cidade</span>
              <input
                className={inputClass}
                placeholder="Ex: Teresina"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className={labelClass}>
              <span>Modalidade</span>
              <select
                className={inputClass}
                value={modalidade}
                onChange={(e) => setModalidade(e.target.value as Job['modalidade'])}
              >
                <option value="Remoto">Remoto</option>
                <option value="Presencial">Presencial</option>
                <option value="Híbrido">Híbrido</option>
              </select>
            </label>

            <label className={labelClass}>
              <span>Link da vaga</span>
              <input
                className={inputClass}
                placeholder="https://..."
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
              {vagaEditando ? 'Salvar alterações' : 'Cadastrar vaga'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
