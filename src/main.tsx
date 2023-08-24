import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import 'react-virtualized/styles.css';
import './assets/css/app.css';
import './assets/css/fonts.css';
import './assets/css/scrollbar.css';
import './assets/css/select.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
