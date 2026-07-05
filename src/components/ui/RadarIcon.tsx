import React from 'react';

interface RadarIconProps {
  className?: string;
}

/**
 * RadarIcon — assinatura visual do produto: arcos concêntricos (o "alcance"
 * de varredura), uma linha de varredura e um blip (ponto detectado = uma
 * vaga encontrada). Substitui qualquer ícone genérico (olho, lupa, etc.)
 * que não tenha relação com o conceito de "radar".
 */
const RadarIcon: React.FC<RadarIconProps> = ({ className = 'w-5 h-5' }) => {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Arcos concêntricos — alcance do radar */}
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="5.5" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.5" />
      {/* Linha de varredura */}
      <path d="M12 12L18.5 7.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      {/* Centro do radar */}
      <circle cx="12" cy="12" r="1.4" fill="currentColor" />
      {/* Blip — vaga detectada */}
      <circle cx="16" cy="9" r="1.3" fill="currentColor" />
    </svg>
  );
};

export default RadarIcon;
