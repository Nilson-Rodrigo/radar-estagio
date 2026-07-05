export interface Job {
  id: string;
  titulo: string;
  empresa: string;
  descricao: string;
  cidade: string;
  modalidade: 'Remoto' | 'Híbrido' | 'Presencial';
  area_atuacao: string;
  link: string;
}