import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, useLocation } from "react-router-dom";

import "./styles/global.css";
import "./styles/theme.css";

import App from "./App.jsx";

import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Toaster } from "react-hot-toast";

import Lenis from "lenis";

/* ===================================
   LENIS ONLY FOR NON-ADMIN PAGES
=================================== */

function SmoothScrollProvider({ children }) {
  const location = useLocation();

  useEffect(() => {
    // Disable Lenis for admin pages
    if (location.pathname.startsWith("/admin")) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.1,
      infinite: false,
    });

    let rafId;

    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [location.pathname]);

  return children;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <SmoothScrollProvider>
            <App />
          </SmoothScrollProvider>

          <ToastContainer
            position="top-right"
            autoClose={2000}
            theme="colored"
          />

          <Toaster position="top-center" />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);