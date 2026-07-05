import { createBrowserRouter, Navigate } from 'react-router-dom';
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
        element: <Admin />,
      },
      {
        path: 'perfil',
        element: <Perfil />,
      },
      {
        path: 'favoritos',
        element: <Favoritos />,
      },
      {
        path: '*',
        element: <Navigate to="/vagas" replace />,
      },
    ],
  },
]);

export default router;