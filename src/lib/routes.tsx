import { createBrowserRouter } from 'react-router-dom';
import Home from '../components/pages/home';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />
    }
]);

export default router;
