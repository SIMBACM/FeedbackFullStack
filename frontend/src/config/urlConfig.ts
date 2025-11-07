/**
 * Dynamic URL Configuration Utility for Frontend
 * Automatically determines API URLs based on environment
 */

/**
 * Get the backend API base URL dynamically
 * @returns {string} Backend API base URL
 */
export function getApiBaseUrl(): string {
  // 1. Check if explicitly set in environment variables
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // 2. Check if we're in a combined deployment (frontend + backend same domain)
  // In production, if frontend is served from backend, use relative URL
  if (import.meta.env.PROD) {
    // Check if we're on Render or similar platform
    const currentHost = window.location.host;
    
    // If on Render (*.onrender.com)
    if (currentHost.includes('onrender.com')) {
      return `https://${currentHost}/api`;
    }
    
    // If on Railway (*.railway.app)
    if (currentHost.includes('railway.app')) {
      return `https://${currentHost}/api`;
    }
    
    // If on Vercel (*.vercel.app)
    if (currentHost.includes('vercel.app')) {
      return `https://${currentHost}/api`;
    }
    
    // Default: use relative URL (same domain)
    return '/api';
  }

  // 3. Development environment
  // Check if backend is running on a different port
  const devBackendPort = import.meta.env.VITE_BACKEND_PORT || '8080';
  return `http://localhost:${devBackendPort}/api`;
}

/**
 * Get the backend base URL (without /api)
 * Useful for SSE connections and other non-API endpoints
 * @returns {string} Backend base URL
 */
export function getBackendBaseUrl(): string {
  const apiUrl = getApiBaseUrl();
  // Remove /api suffix if present
  return apiUrl.replace(/\/api$/, '');
}

/**
 * Get the full URL for a specific API endpoint
 * @param {string} endpoint - API endpoint path (e.g., '/feedback', '/whatsapp')
 * @returns {string} Full API URL
 */
export function getApiUrl(endpoint: string): string {
  const baseUrl = getApiBaseUrl();
  // Ensure endpoint starts with /
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
}

/**
 * Get the SSE (Server-Sent Events) URL
 * @returns {string} SSE endpoint URL
 */
export function getSseUrl(): string {
  return getApiUrl('/events');
}

/**
 * Check if we're in development mode
 * @returns {boolean} True if in development
 */
export function isDevelopment(): boolean {
  return import.meta.env.DEV;
}

/**
 * Check if we're in production mode
 * @returns {boolean} True if in production
 */
export function isProduction(): boolean {
  return import.meta.env.PROD;
}

/**
 * Log configuration (for debugging)
 */
export function logConfiguration(): void {
  if (isDevelopment()) {
    console.log('\n🔧 Frontend URL Configuration:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📍 Environment: ${import.meta.env.MODE}`);
    console.log(`🌐 API Base URL: ${getApiBaseUrl()}`);
    console.log(`🔌 Backend Base URL: ${getBackendBaseUrl()}`);
    console.log(`📡 SSE URL: ${getSseUrl()}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  }
}

// Export configuration object for convenience
export const urlConfig = {
  getApiBaseUrl,
  getBackendBaseUrl,
  getApiUrl,
  getSseUrl,
  isDevelopment,
  isProduction,
  logConfiguration
};

export default urlConfig;
