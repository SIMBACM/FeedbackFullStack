/**
 * Dynamic URL Configuration Utility for Backend
 * Automatically determines URLs based on environment
 */

/**
 * Get the frontend URL dynamically based on environment
 * @returns {string} Frontend URL
 */
function getFrontendUrl() {
  // 1. Check if explicitly set in environment
  if (process.env.FRONTEND_URL) {
    return process.env.FRONTEND_URL;
  }

  // 2. Determine based on NODE_ENV and RENDER environment
  const nodeEnv = process.env.NODE_ENV || 'development';
  
  // Production/Render deployment
  if (nodeEnv === 'production') {
    // If on Render, use the Render URL
    if (process.env.RENDER) {
      const serviceName = process.env.RENDER_SERVICE_NAME || 'whatsapp-feedback-fullstack';
      return `https://${serviceName}.onrender.com`;
    }
    
    // If RENDER_EXTERNAL_URL is available (Render provides this)
    if (process.env.RENDER_EXTERNAL_URL) {
      return process.env.RENDER_EXTERNAL_URL;
    }
    
    // Default production URL (same as backend in combined deployment)
    return `https://whatsapp-feedback-fullstack.onrender.com`;
  }
  
  // Development environment
  return 'http://localhost:5173';
}

/**
 * Get the backend URL (for internal use or logging)
 * @returns {string} Backend URL
 */
function getBackendUrl() {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const port = process.env.PORT || 8080;
  const host = process.env.HOST || 'localhost';
  
  if (nodeEnv === 'production') {
    // If on Render
    if (process.env.RENDER_EXTERNAL_URL) {
      return process.env.RENDER_EXTERNAL_URL;
    }
    
    const serviceName = process.env.RENDER_SERVICE_NAME || 'whatsapp-feedback-fullstack';
    return `https://${serviceName}.onrender.com`;
  }
  
  // Development
  return `http://${host}:${port}`;
}

/**
 * Get CORS origins dynamically
 * @returns {Array} Array of allowed origins
 */
function getCorsOrigins() {
  const frontendUrl = getFrontendUrl();
  const nodeEnv = process.env.NODE_ENV || 'development';
  
  const origins = [
    frontendUrl,
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'http://localhost:5175',
    // Allow all localhost ports for development
    /^http:\/\/localhost:\d+$/,
    // Allow Render deployments
    /^https:\/\/.*\.onrender\.com$/,
    // Allow Railway/Vercel/Netlify deployments
    /^https:\/\/.*\.railway\.app$/,
    /^https:\/\/.*\.vercel\.app$/,
    /^https:\/\/.*\.netlify\.app$/,
  ];
  
  // In development, allow all origins
  if (nodeEnv === 'development') {
    origins.push('*');
  }
  
  return origins.filter(Boolean);
}

/**
 * Log configuration on startup
 */
function logConfiguration() {
  console.log('\n🔧 URL Configuration:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Backend URL: ${getBackendUrl()}`);
  console.log(`🎨 Frontend URL: ${getFrontendUrl()}`);
  console.log(`🔒 CORS Origins: ${getCorsOrigins().length} configured`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

module.exports = {
  getFrontendUrl,
  getBackendUrl,
  getCorsOrigins,
  logConfiguration
};
