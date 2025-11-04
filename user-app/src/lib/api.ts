export const API_BASE_URL = 'http://localhost:3333/api';

export const API_ENDPOINTS = {
  // UsersApp endpoints
  USERSAPP: {
    CREATE: `${API_BASE_URL}/usersapp`,
    LOGIN: `${API_BASE_URL}/usersapp/session`,
    PROFILE: `${API_BASE_URL}/usersapp/me`,
  },
  // Reservations endpoints
  RESERVATIONS: {
    CREATE: `${API_BASE_URL}/reservations`,
    LIST: `${API_BASE_URL}/reservations`,
    DELETE: (id: string) => `${API_BASE_URL}/reservations/${id}`,
  },
  // Products endpoints
  PRODUCTS: {
    LIST: `${API_BASE_URL}/products`,
    BY_CATEGORY: `${API_BASE_URL}/category/product`,
  },
  // Categories endpoints
  CATEGORIES: {
    LIST: `${API_BASE_URL}/categories`,
  },
} as const;
