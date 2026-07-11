import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import Layout from '../widgets/layout/Layout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import AdminLogin from '../pages/AdminLogin';
import Cadastro from '../pages/Cadastro';
import Vagas from '../pages/Vagas';
import VagaDetalhes from '../pages/VagaDetalhes';
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
        element: <Home />,
      },
      {
        path: 'vagas',
        element: <Vagas />,
      },
      {
        path: 'vagas/:id',
        element: <VagaDetalhes />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'admin-login',
        element: <AdminLogin />,
      },
      {
        path: 'cadastro',
        element: <Cadastro />,
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute allowedRoles={['admin']} redirectTo="/admin-login">
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
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

export default router;