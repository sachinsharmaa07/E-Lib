import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SearchProvider } from "./context/SearchContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";

// 👇 make sure this file exists: src/styles/globals.css
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SearchProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </SearchProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
