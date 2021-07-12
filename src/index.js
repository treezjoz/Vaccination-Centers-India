import React from 'react';
import { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './css/loader.css'
const App = React.lazy(() => import('./App'));

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={
      <div class="around">
        <div class="spinner"></div>
      </div>
      }>
      <App />
    </Suspense>
  </React.StrictMode>,
  document.getElementById('root')
);
