import './GlobalPolyfill'; // Must be first import
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from "./contexts/AuthProvider";
import App from "./App";
import 'virtual:windi.css'; // Import Windi CSS
import "./index.css"; // Import custom styles

console.log('AWS Config:', {
  userPoolId: import.meta.env.VITE_USER_POOL_ID,
  region: import.meta.env.VITE_REGION
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
