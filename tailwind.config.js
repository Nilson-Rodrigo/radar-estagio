/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Design System — Radar Estágio
      // Única paleta de marca usada em TODAS as páginas (não misturar com
      // purple/emerald/blue/amber soltos do Tailwind — sempre usar "brand" e "accent").
      colors: {
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed', // cor primária: botões, links ativos, ícones de destaque
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        // Cores semânticas — uso restrito a um significado específico,
        // nunca como "cor da página" (isso é o que causava a inconsistência).
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          600: '#059669', // vaga favoritada, confirmação de cadastro
          700: '#047857',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          600: '#dc2626', // erro de validação, exclusão de vaga
          700: '#b91c1c',
        },
      },
      fontFamily: {
        // Fonte única do projeto (aplicada globalmente via index.css)
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '1rem',     // 16px — padrão para Card
        control: '0.75rem', // 12px — padrão para Button/Input
      },
      boxShadow: {
        card: '0 4px 6px -1px rgb(124 58 237 / 0.05), 0 2px 4px -2px rgb(124 58 237 / 0.05)',
        'card-hover': '0 10px 15px -3px rgb(124 58 237 / 0.1), 0 4px 6px -4px rgb(124 58 237 / 0.1)',
      },
    },
  },
  plugins: [],
}
