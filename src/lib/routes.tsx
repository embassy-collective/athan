import Settings from '@/components/pages/settings';
import Tasbih from '@/components/pages/tasbih';
import { createBrowserRouter } from 'react-router-dom';
import Home from '../components/pages/home';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/settings',
    element: <Settings />
  },
  {
    path: '/tasbih',
    element: <Tasbih />
  },
  {
    path: '*',
    element: <h1>404</h1>
  }
]);

export default router;
