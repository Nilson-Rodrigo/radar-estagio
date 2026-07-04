import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-550 dark:bg-slate-900 text-slate-800 dark:text-slate-200 flex flex-col font-sans">
      {/* Premium Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/35">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
              Radar Estágio
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { path: '/vagas', label: 'Vagas' },
              { path: '/favoritos', label: 'Favoritos' },
              { path: '/perfil', label: 'Meu Perfil' },
              { path: '/admin', label: 'Painel Admin' },
            ].map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-250 ${
                    isActive
                      ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Auth Actions */}
          <div className="flex items-center gap-2">
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-250 ${
                  isActive
                    ? 'text-purple-600 dark:text-purple-400 bg-slate-100 dark:bg-slate-800'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
              }
            >
              Entrar
            </NavLink>
            <NavLink
              to="/cadastro"
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-250"
            >
              Cadastrar
            </NavLink>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Elegant Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-6 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} Radar Estágio. Todos os direitos reservados.
          </div>
          <div className="flex gap-4">
            <span className="hover:text-slate-800 dark:hover:text-white cursor-pointer transition-colors">Termos</span>
            <span className="hover:text-slate-800 dark:hover:text-white cursor-pointer transition-colors">Privacidade</span>
            <span className="text-purple-500 dark:text-purple-400 font-semibold bg-purple-500/5 px-2.5 py-0.5 rounded-full text-xs">Base Architecture</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
