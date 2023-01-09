import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "react-auth-kit"
console.log(process.env.REACT_APP_BASE_URL);
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <AuthProvider
    authType="cookie"
    authName="_auth"
    cookieDomain={window.location.hostname}
    cookieSecure={window.location.protocol === "https:"}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>
);