// ============================================================================
// API SERVICE - AXIOS HTTP CLIENT CONFIGURATION
// ============================================================================
// CONCEPT: Centralized HTTP client for API communication
// - Axios: Promise-based HTTP library for making requests

import axios from "axios";

// CONCEPT: Axios Instance Creation
// - axios.create: Create configured instance with default settings
// - baseURL: Sets base URL for all API requests
// - All API calls will be prefixed with "http://localhost:4000/api"
// - Example: api.get("/books") → calls "http://localhost:4000/api/books"
const api = axios.create({
  baseURL: "http://localhost:4000/api"
});

// CONCEPT: Export API Instance
// - Import this in components to make API calls
// - Usage: import api from "./services/api.js"
// - Then use: api.post("/auth/login", { email, password })
export default api;
