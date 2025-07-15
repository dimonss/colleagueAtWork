// API Configuration
const isDevelopment = import.meta.env.DEV;

// Get domain from environment variables or use default
const PRODUCTION_DOMAIN = import.meta.env.VITE_PRODUCTION_DOMAIN || 'https://chalysh.tech';

export const API_BASE_URL = isDevelopment
  ? 'http://localhost:3001/api'
  : `${PRODUCTION_DOMAIN}/colleagues/api`;
