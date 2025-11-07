# Dynamic URL Configuration System

## 📋 Overview

This project now uses a **dynamic URL configuration system** that automatically determines the correct URLs based on the environment, eliminating the need for hardcoded URLs in `.env` files.

## 🎯 Benefits

✅ **No Hardcoded URLs** - URLs are determined automatically
✅ **Environment Aware** - Works in development, staging, and production
✅ **Platform Agnostic** - Works on Render, Railway, Vercel, Netlify, etc.
✅ **Easy Deployment** - No URL configuration needed for most deployments
✅ **Flexible** - Can still override with environment variables if needed

## 🏗️ Architecture

### Backend (`Backend/utils/urlConfig.js`)
- `getFrontendUrl()` - Returns the frontend URL for CORS
- `getBackendUrl()` - Returns the backend URL
- `getCorsOrigins()` - Returns array of allowed CORS origins
- `logConfiguration()` - Logs configuration on startup

### Frontend (`frontend/src/config/urlConfig.ts`)
- `getApiBaseUrl()` - Returns the backend API base URL
- `getBackendBaseUrl()` - Returns backend URL without /api
- `getApiUrl(endpoint)` - Returns full URL for specific endpoint
- `getSseUrl()` - Returns Server-Sent Events URL
- `logConfiguration()` - Logs configuration in development

## 🔧 How It Works

### Development Environment

**Backend:**
- Automatically uses `http://localhost:8080`
- CORS allows all localhost ports
- Frontend URL defaults to `http://localhost:5173`

**Frontend:**
- Automatically uses `http://localhost:8080/api`
- Can be overridden with `VITE_BACKEND_PORT` env var

### Production Environment (Render)

**Backend:**
- Automatically detects Render environment
- Uses `RENDER_EXTERNAL_URL` if available
- Falls back to service name: `https://[service-name].onrender.com`
- CORS automatically includes Render domains

**Frontend:**
- Detects if served from same domain (combined deployment)
- Uses relative URL `/api` for same-domain deployments
- Automatically detects Render, Railway, Vercel, Netlify domains
- Falls back to `VITE_API_BASE_URL` if set

## 📝 Environment Variables

### Backend (.env)

```bash
# Server Configuration
PORT=8080
NODE_ENV=development
HOST=localhost

# Frontend URL (Optional - auto-detected if not set)
# FRONTEND_URL=http://localhost:5173
```

### Frontend (.env.local)

```bash
# Backend API URL (Optional - auto-detected if not set)
# VITE_API_BASE_URL=https://your-backend.onrender.com/api

# Backend Port for development (Optional)
# VITE_BACKEND_PORT=8080
```

## 🚀 Usage Examples

### Backend

```javascript
const { getFrontendUrl, getCorsOrigins } = require('./utils/urlConfig');

// Get frontend URL
const frontendUrl = getFrontendUrl();
console.log(frontendUrl); // Auto-detected based on environment

// Get CORS origins
const corsOptions = {
  origin: getCorsOrigins(),
  credentials: true
};
```

### Frontend

```typescript
import { getApiBaseUrl, getApiUrl, getSseUrl } from './config/urlConfig';

// Get API base URL
const apiUrl = getApiBaseUrl();
console.log(apiUrl); // Auto-detected based on environment

// Get specific endpoint URL
const feedbackUrl = getApiUrl('/feedback');
console.log(feedbackUrl); // http://localhost:8080/api/feedback (dev)

// Get SSE URL
const sseUrl = getSseUrl();
const eventSource = new EventSource(sseUrl);
```

## 🌍 Environment Detection

### Backend Detection Logic

1. Check `FRONTEND_URL` environment variable
2. If production:
   - Check `RENDER_EXTERNAL_URL` (Render provides this)
   - Check `RENDER` environment variable
   - Use service name from `RENDER_SERVICE_NAME`
   - Default to `https://whatsapp-feedback-fullstack.onrender.com`
3. If development:
   - Use `http://localhost:5173`

### Frontend Detection Logic

1. Check `VITE_API_BASE_URL` environment variable
2. If production:
   - Check if on Render (*.onrender.com)
   - Check if on Railway (*.railway.app)
   - Check if on Vercel (*.vercel.app)
   - Use relative URL `/api` (same domain)
3. If development:
   - Use `http://localhost:${VITE_BACKEND_PORT || 8080}/api`

## 📊 Deployment Scenarios

### Scenario 1: Combined Deployment (Recommended)
**Frontend + Backend in same container**

- Backend serves frontend static files
- Frontend uses relative URL: `/api`
- No URL configuration needed
- Works automatically on Render

**Environment Variables:**
- None required! Auto-detected

### Scenario 2: Separate Deployments
**Frontend and Backend as separate services**

**Backend:**
```bash
FRONTEND_URL=https://your-frontend.onrender.com
```

**Frontend:**
```bash
VITE_API_BASE_URL=https://your-backend.onrender.com/api
```

### Scenario 3: Local Development

**Backend:**
```bash
# No configuration needed
# Auto-uses http://localhost:8080
```

**Frontend:**
```bash
# No configuration needed
# Auto-uses http://localhost:8080/api

# Or customize backend port:
VITE_BACKEND_PORT=3001
```

## 🔍 Debugging

### Backend Logs

On startup, you'll see:
```
🔧 URL Configuration:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Environment: development
🌐 Backend URL: http://localhost:8080
🎨 Frontend URL: http://localhost:5173
🔒 CORS Origins: 10 configured
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Frontend Logs (Development Only)

In browser console:
```
🔧 Frontend URL Configuration:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Environment: development
🌐 API Base URL: http://localhost:8080/api
🔌 Backend Base URL: http://localhost:8080
📡 SSE URL: http://localhost:8080/api/events
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 🛠️ Customization

### Override URLs

**Backend:**
```bash
# Set explicit frontend URL
FRONTEND_URL=https://custom-domain.com
```

**Frontend:**
```bash
# Set explicit backend URL
VITE_API_BASE_URL=https://custom-backend.com/api
```

### Add Custom Platform Detection

**Backend (`utils/urlConfig.js`):**
```javascript
// Add custom platform detection
if (process.env.MY_PLATFORM) {
  return process.env.MY_PLATFORM_URL;
}
```

**Frontend (`config/urlConfig.ts`):**
```typescript
// Add custom platform detection
if (currentHost.includes('myplatform.com')) {
  return `https://${currentHost}/api`;
}
```

## ✅ Migration Checklist

- [x] Created `Backend/utils/urlConfig.js`
- [x] Created `frontend/src/config/urlConfig.ts`
- [x] Updated `Backend/server.js` to use dynamic CORS
- [x] Updated `frontend/src/Components/AdminDashboard.tsx`
- [x] Updated `frontend/src/Components/View.tsx`
- [x] Updated `frontend/src/main.tsx` to log configuration
- [x] Updated `Backend/.env` with comments
- [x] Updated `Backend/.env.example`
- [x] Created `frontend/.env.example`
- [x] Removed hardcoded URLs from code

## 🎉 Result

Your application now:
- ✅ Works in any environment without URL configuration
- ✅ Automatically detects Render, Railway, Vercel, Netlify
- ✅ Supports combined and separate deployments
- ✅ Provides clear debugging information
- ✅ Allows manual overrides when needed
- ✅ Follows best practices for environment configuration

## 📚 Files Modified

**Backend:**
- `Backend/utils/urlConfig.js` (NEW)
- `Backend/server.js` (UPDATED)
- `Backend/.env` (UPDATED)
- `Backend/.env.example` (UPDATED)

**Frontend:**
- `frontend/src/config/urlConfig.ts` (NEW)
- `frontend/src/Components/AdminDashboard.tsx` (UPDATED)
- `frontend/src/Components/View.tsx` (UPDATED)
- `frontend/src/main.tsx` (UPDATED)
- `frontend/.env.example` (NEW)

---

**Status**: ✅ Complete
**Date**: January 2025
**Version**: 1.0.0