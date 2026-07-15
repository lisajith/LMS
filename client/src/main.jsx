import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./styles/global.css";
import App from "./App.jsx";

import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter } from "react-router-dom";

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

import { ThemeProvider } from "./context/ThemeContext";
import "./styles/global.css";
import "./styles/theme.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <App />
          <ToastContainer
            position="top-right"
            autoClose={2000}
            theme="colored"
          />
        </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
