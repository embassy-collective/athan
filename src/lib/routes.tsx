import Calendar from '@/pages/calendar';
import Settings from '@/pages/settings';
import Tasbih from '@/pages/tasbih';
import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/home';

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
    path: '/calendar',
    element: <Calendar />
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
