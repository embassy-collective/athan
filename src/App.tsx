import { RouterProvider } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import router from './lib/routes';

import './i18n/i18n'
const App = () => {
  const { i18n } = useTranslation();
  document.body.dir = i18n.dir();
  return <RouterProvider router={router} />;
};

export default App;
