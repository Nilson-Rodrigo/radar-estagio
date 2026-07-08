import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../entities/session/model/useAuth';

interface ProtectedRouteProps {
  allowedRoles?: Array<'estudante' | 'admin'>;
  redirectTo?: string;
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles = ['estudante', 'admin'],
  redirectTo = '/login',
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-500">
        Verificando acesso...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/vagas" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
