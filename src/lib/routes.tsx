import Calendar from '@/pages/calendar';
import Settings from '@/pages/settings';
import Tasbih from '@/pages/tasbih';
import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/home';
import { ThemeProvider } from '@/providers/theme-provider';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/settings',
    /* Problem: I'm still unsure why, but not reapplying the themeProvider here
    results in using initial values instead of the updated ones. Could there be a conflict? */
    element: (
      <ThemeProvider>
        <Settings />
      </ThemeProvider>
    )
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
