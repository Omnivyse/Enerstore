// API Configuration
// Prefer environment variable so we can point to the actual deployed backend URL.
// Normalize to avoid trailing slashes which cause `//api/...` 404s.
const rawBaseUrl = process.env.REACT_APP_API_BASE_URL || 'https://enerstore-production.up.railway.app';
const RAILWAY_URL = rawBaseUrl.replace(/\/+$/, '');
const API_BASE_URL = RAILWAY_URL;
const SOCKET_URL = RAILWAY_URL;

// Always use Railway API
export const getApiBaseUrl = async () => {
  console.log('🌐 Using Railway backend:', RAILWAY_URL);
  return RAILWAY_URL;
};

export const API_ENDPOINTS = {
  // Products
  PRODUCTS: `${API_BASE_URL}/api/products`,
  PRODUCT_SEARCH: `${API_BASE_URL}/api/products/search`,
  
  // Categories
  CATEGORIES: `${API_BASE_URL}/api/categories`,
  
  // Brands
  BRANDS: `${API_BASE_URL}/api/brands`,
  
  // Companies
  COMPANIES: `${API_BASE_URL}/api/companies`,
  COMPANY_LOGIN: `${API_BASE_URL}/api/companies/login`,
  
  // Users
  CUSTOMER_USERS: `${API_BASE_URL}/api/customer-users`,
  CUSTOMER_LOGIN: `${API_BASE_URL}/api/customer-users/login`,
  
  // Admin
  ADMIN: `${API_BASE_URL}/api/admin`,
  ADMIN_LOGIN: `${API_BASE_URL}/api/admin/login`,
  
  
  // Carousel
  CAROUSEL: `${API_BASE_URL}/api/carousel`,
  
  // Orders
  ORDERS: `${API_BASE_URL}/api/orders`,
};

// Dynamic API endpoints - always use Railway
export const getDynamicApiEndpoints = async () => {
  const baseUrl = await getApiBaseUrl();
  return {
    PRODUCTS: `${baseUrl}/api/products`,
    PRODUCT_SEARCH: `${baseUrl}/api/products/search`,
    CATEGORIES: `${baseUrl}/api/categories`,
    BRANDS: `${baseUrl}/api/brands`,
    COMPANIES: `${baseUrl}/api/companies`,
    COMPANY_LOGIN: `${baseUrl}/api/companies/login`,
    CUSTOMER_USERS: `${baseUrl}/api/customer-users`,
    CUSTOMER_LOGIN: `${baseUrl}/api/customer-users/login`,
    ADMIN: `${baseUrl}/api/admin`,
    ADMIN_LOGIN: `${baseUrl}/api/admin/login`,
    CAROUSEL: `${baseUrl}/api/carousel`,
    ORDERS: `${baseUrl}/api/orders`,
  };
};

export const SOCKET_CONFIG = {
  url: SOCKET_URL,
  options: {
    transports: ['polling', 'websocket'], // Try polling first, then websocket
    autoConnect: false, // Don't auto-connect
    reconnection: false, // Disable reconnection to prevent infinite loops
    timeout: 5000, // Shorter timeout
    forceNew: true,
    upgrade: true,
    rememberUpgrade: false,
    maxReconnectionAttempts: 0, // No reconnection attempts
    reconnectionDelay: 0
  }
};

export default {
  API_BASE_URL,
  SOCKET_URL,
  API_ENDPOINTS,
  SOCKET_CONFIG,
}; 