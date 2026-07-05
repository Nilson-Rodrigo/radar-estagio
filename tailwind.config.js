/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Design System — Radar Estágio
      // Identidade: tela de radar/sonar. Fundo grafite quase-preto (não azul-marinho
      // genérico), acento único verde-fósforo (não roxo — evita o clichê visual de IA).
      colors: {
        // Verde-fósforo — cor primária: botões, links ativos, ícones de destaque,
        // e o "blip" (ponto detectado) do logo.
        radar: {
          50: '#EAFBF4',
          100: '#CDF3E1',
          200: '#9CE7C3',
          300: '#64D5A0',
          400: '#3ABF85',
          500: '#22D48A',
          600: '#17A86C',
          700: '#127F54',
          800: '#0D5C3D',
          900: '#083D29',
        },
        // Fundo/superfície — grafite com leve matiz esverdeado, no lugar do
        // slate/navy padrão de qualquer template de IA.
        ink: {
          900: '#0B0F0D', // fundo geral (header, footer, body)
          800: '#121712', // superfície de cards
          700: '#1B221C', // bordas/divisórias sutis
        },
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          600: '#059669',
          700: '#047857',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          600: '#dc2626',
          700: '#b91c1c',
        },
      },
      fontFamily: {
        // Corpo de texto: legibilidade.
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        // Títulos/logo: grotesca técnica, remete a painel/instrumento (radar),
        // usada com moderação — não em todo o texto.
        display: ['"Space Grotesk"', '"Inter"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '1rem',
        control: '0.75rem',
      },
      boxShadow: {
        card: '0 4px 6px -1px rgb(34 212 138 / 0.06), 0 2px 4px -2px rgb(34 212 138 / 0.06)',
        'card-hover': '0 10px 15px -3px rgb(34 212 138 / 0.12), 0 4px 6px -4px rgb(34 212 138 / 0.1)',
      },
    },
  },
  plugins: [],
}
