import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import Layout from '../widgets/layout/Layout';
import Login from '../pages/Login';
import Cadastro from '../pages/Cadastro';
import Vagas from '../pages/Vagas';
import Admin from '../pages/Admin';
import Perfil from '../pages/Perfil';
import Favoritos from '../pages/Favoritos';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <Navigate to="/vagas" replace />,
      },
      {
        path: 'vagas',
        element: <Vagas />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'cadastro',
        element: <Cadastro />,
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute allowedRoles={['admin']} redirectTo="/login">
            <Admin />
          </ProtectedRoute>
        ),
      },
      {
        path: 'perfil',
        element: (
          <ProtectedRoute allowedRoles={['estudante', 'admin']} redirectTo="/login">
            <Perfil />
          </ProtectedRoute>
        ),
      },
      {
        path: 'favoritos',
        element: (
          <ProtectedRoute allowedRoles={['estudante', 'admin']} redirectTo="/login">
            <Favoritos />
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: <Navigate to="/vagas" replace />,
      },
    ],
  },
]);

export default router;