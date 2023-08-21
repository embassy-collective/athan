import React from 'react';
import Providers from './providers/providers';
import { RouterProvider } from 'react-router-dom';
import router from './lib/routes';

const App = () => {
    return <RouterProvider router={router} />;
};

export default App;
