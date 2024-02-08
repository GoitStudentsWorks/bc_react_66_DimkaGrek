import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { persistor, store } from 'my-redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { App, ModalProvider } from 'components';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ModalProvider>
          <BrowserRouter basename="/ReactAvengers">
            <App />
          </BrowserRouter>
        </ModalProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
