const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost';

export const SERVICES = {
  AUTH: `${API_BASE_URL}:3002`,
  AGRI: `${API_BASE_URL}:3003`,
  MARKET: `${API_BASE_URL}:3004`,
  SERVICE: `${API_BASE_URL}:3005`,
  CIRCULAR: `${API_BASE_URL}:3006`,
};
