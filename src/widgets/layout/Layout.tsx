import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../entities/session/model/useAuth';
import { authService } from '../../services/auth.service';
import Button from '../../shared/ui/Button';
import RadarIcon from '../../shared/ui/RadarIcon';

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading, isAuthenticated } = useAuth();
  const navLinks = [
    { path: '/vagas', label: 'Vagas', show: true },
    { path: '/favoritos', label: 'Favoritos', show: user?.role === 'estudante' },
    { path: '/perfil', label: 'Meu Perfil', show: user?.role === 'estudante' },
    { path: '/admin', label: 'Painel Admin', show: user?.role === 'admin' },
  ].filter((link) => link.show);

  const handleLogout = async () => {
    await authService.signOut();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-radar-500 rounded-xl flex items-center justify-center shadow-lg shadow-radar-500/25">
              <RadarIcon className="w-5 h-5 text-ink-900" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-slate-900">
              Radar<span className="text-radar-500">Est&aacute;gio</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-control text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-radar-500/10 text-radar-600'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {loading ? (
              <span className="text-sm text-slate-500">Carregando...</span>
            ) : isAuthenticated && user ? (
              <>
                <span className="hidden text-sm font-medium text-slate-600 sm:block">{user.nome}</span>
                <Button
                  variant="ghost"
                  size="md"
                  className="text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  onClick={handleLogout}
                >
                  Sair
                </Button>
              </>
            ) : (
              <>
                <NavLink to="/login">
                  <Button
                    variant="ghost"
                    size="md"
                    className="text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  >
                    Entrar
                  </Button>
                </NavLink>
                <NavLink to="/cadastro">
                  <Button variant="primary" size="md">Cadastrar</Button>
                </NavLink>
              </>
            )}
          </div>
        </div>
      </header>

      <nav className="border-b border-slate-200 bg-white md:hidden">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-control px-3 py-2 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-radar-500/10 text-radar-600'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} Radar Est&aacute;gio. Todos os direitos reservados.
          </div>
          <div className="flex gap-4 items-center">
            <span className="hover:text-slate-800 cursor-pointer transition-colors">Termos</span>
            <span className="hover:text-slate-800 cursor-pointer transition-colors">Privacidade</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

