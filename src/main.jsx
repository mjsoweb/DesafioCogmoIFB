import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider theme={{ token: {
      colorPrimary: '#6129ac',
      colorText: '#666666',
      colorTextHeading: '#1d165c',
      colorTextSecondary: '#666666',
      colorLink: '#6129ac',
    } }}>
      <App />
    </ConfigProvider>
  </React.StrictMode>
);
