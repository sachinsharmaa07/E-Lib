// ============================================================================
// REACT APP ENTRY POINT - INITIALIZATION & CONTEXT SETUP
// ============================================================================
// CONCEPT: Root component rendering - sets up app structure and providers

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SearchProvider } from "./context/SearchContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";

// CONCEPT: Global Stylesheet
import "./styles/globals.css";

// CONCEPT: React App Rendering
// - Render root component into DOM at id="root"
// - StrictMode: Development tool to highlight potential issues
// - BrowserRouter: Enable React Router functionality for navigation
// - Context Providers: Wrap app with global state management (nested structure)
//   * AuthProvider: Manages user authentication state
//   * SearchProvider: Manages book search/filter state
//   * ToastProvider: Manages toast notifications
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
