/**
 * Frontend Token Auto-Refresh Implementation Guide
 * 
 * This guide shows how to implement automatic token refresh on the client side
 * to keep users logged in seamlessly without manual re-login after 15 minutes
 */

// ============================================
// 1. AXIOS INTERCEPTOR (React/Vue Project)
// ============================================

// File: src/api/axiosInstance.js (in your client folder)

/*
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  withCredentials: true, // Important: allows cookies to be sent
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(f => {
    if (error) {
      f.reject(error);
    } else {
      f.resolve(token);
    }
  });
  
  isRefreshing = false;
  failedQueue = [];
};

// Interceptor for requests
axiosInstance.interceptors.request.use(
  config => config,
  error => Promise.reject(error)
);

// Interceptor for responses
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    const originalRequest = error.config;

    // If error is 401 (Unauthorized) and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request if already refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => axiosInstance(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      // Call refresh endpoint
      return axiosInstance
        .post('/auth/refresh-token')
        .then(() => {
          processQueue(null);
          // Retry original request with new token
          return axiosInstance(originalRequest);
        })
        .catch(err => {
          processQueue(err);
          // If refresh fails, redirect to login
          window.location.href = '/login';
          return Promise.reject(err);
        });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
*/

// ============================================
// 2. TOKEN REFRESH SERVICE (Optional)
// ============================================

// File: src/services/tokenService.js

/*
class TokenService {
  constructor() {
    this.checkInterval = null;
    this.warningShown = false;
  }

  // Start monitoring token expiry
  startTokenMonitoring() {
    // Check every 1 minute if token needs refresh
    this.checkInterval = setInterval(() => {
      this.refreshIfNeeded();
    }, 60000); // 60 seconds
  }

  // Stop monitoring
  stopTokenMonitoring() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  // Refresh token if expiring soon
  async refreshIfNeeded() {
    try {
      // Call refresh endpoint to get new token
      const response = await fetch('/api/v1/auth/refresh-token', {
        method: 'POST',
        credentials: 'include', // Include cookies
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok && response.status === 401) {
        // Refresh token expired, redirect to login
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
  }

  // Decode JWT to get expiration
  getTokenExpiry(token) {
    if (!token) return null;
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      return decoded.exp * 1000; // Convert to milliseconds
    } catch {
      return null;
    }
  }

  // Show user warning 2 minutes before logout
  showInactivityWarning() {
    if (this.warningShown) return;
    this.warningShown = true;
    
    console.warn('⚠️ Your session will expire in 2 minutes due to inactivity');
    // You can show a toast/modal here
  }
}

export default new TokenService();
*/

// ============================================
// 3. REACT HOOK FOR AUTO-REFRESH
// ============================================

// File: src/hooks/useAutoRefreshToken.js

/*
import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';

export const useAutoRefreshToken = () => {
  const dispatch = useDispatch();
  const refreshTokenTimerRef = React.useRef(null);

  const scheduleTokenRefresh = useCallback(() => {
    // Refresh token 1 minute before it expires
    // Access token expires in 15 minutes, so refresh at 14 minutes
    const refreshTime = 14 * 60 * 1000; // 14 minutes in ms

    if (refreshTokenTimerRef.current) {
      clearTimeout(refreshTokenTimerRef.current);
    }

    refreshTokenTimerRef.current = setTimeout(async () => {
      try {
        const response = await fetch('/api/v1/auth/refresh-token', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          console.log('✅ Token refreshed automatically');
          // Schedule next refresh
          scheduleTokenRefresh();
        } else if (response.status === 401) {
          // Redirect to login if refresh fails
          dispatch({ type: 'LOGOUT' });
          window.location.href = '/login';
        }
      } catch (error) {
        console.error('Token refresh error:', error);
      }
    }, refreshTime);
  }, [dispatch]);

  useEffect(() => {
    scheduleTokenRefresh();

    return () => {
      if (refreshTokenTimerRef.current) {
        clearTimeout(refreshTokenTimerRef.current);
      }
    };
  }, [scheduleTokenRefresh]);
};

// Usage in component:
// function App() {
//   useAutoRefreshToken();
//   return <YourApp />;
// }
*/

// ============================================
// 4. NEXT.JS MIDDLEWARE APPROACH
// ============================================

// File: middleware.ts (for Next.js 13+)

/*
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;

  // If no token but trying to access protected route
  if (!token && request.nextUrl.pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If token exists, add it to headers for API calls
  if (token) {
    request.headers.set('authorization', `Bearer ${token}`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/api/:path*'],
};
*/

// ============================================
// 5. SIMPLE FETCH WRAPPER
// ============================================

/*
async function authenticatedFetch(url, options = {}) {
  try {
    let response = await fetch(url, {
      ...options,
      credentials: 'include', // Include cookies
    });

    // If 401, try to refresh token
    if (response.status === 401) {
      const refreshResponse = await fetch('/api/v1/auth/refresh-token', {
        method: 'POST',
        credentials: 'include',
      });

      if (refreshResponse.ok) {
        // Retry original request with new token
        response = await fetch(url, {
          ...options,
          credentials: 'include',
        });
      } else {
        // Redirect to login
        window.location.href = '/login';
      }
    }

    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

// Usage:
// const data = await authenticatedFetch('/api/v1/user/profile')
//   .then(r => r.json());
*/

// ============================================
// 6. REDUX MIDDLEWARE (Optional)
// ============================================

// File: src/redux/middlewares/tokenRefreshMiddleware.js

/*
let tokenRefreshTimer = null;

export const tokenRefreshMiddleware = store => next => action => {
  // On LOGIN success
  if (action.type === 'LOGIN_SUCCESS') {
    scheduleTokenRefresh(store);
  }

  // On LOGOUT
  if (action.type === 'LOGOUT') {
    if (tokenRefreshTimer) {
      clearTimeout(tokenRefreshTimer);
    }
  }

  return next(action);
};

function scheduleTokenRefresh(store) {
  // Refresh after 14 minutes
  if (tokenRefreshTimer) clearTimeout(tokenRefreshTimer);

  tokenRefreshTimer = setTimeout(async () => {
    try {
      const response = await fetch('/api/v1/auth/refresh-token', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        console.log('✅ Token auto-refreshed');
        scheduleTokenRefresh(store); // Schedule next refresh
      } else {
        // Logout if refresh fails
        store.dispatch({ type: 'LOGOUT' });
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      store.dispatch({ type: 'LOGOUT' });
    }
  }, 14 * 60 * 1000); // 14 minutes
}
*/

// ============================================
// 7. IMPORTANT NOTES
// ============================================

/*
✅ DO:
- Set withCredentials: true in axios/fetch (for cookies)
- Refresh token 1 minute before expiry
- Handle 401 responses gracefully
- Queue requests during token refresh
- Store refresh token securely (httpOnly cookie)

❌ DON'T:
- Store tokens in localStorage (security risk)
- Refresh on every request (unnecessary)
- Forget credentials in fetch options
- Show raw errors to users

🔒 SECURITY:
- Refresh token stored in httpOnly cookie (not accessible to JS)
- Access token stored in memory or secure cookie
- CSRF protection enabled
- Rate limiting on backend
*/

// ============================================
// 8. ROUTE PROTECTION EXAMPLE (React Router)
// ============================================

/*
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const refreshToken = document.cookie.includes('refreshToken');

  // Check if user has valid refresh token
  if (!isAuthenticated && !refreshToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Usage:
// <ProtectedRoute>
//   <Dashboard />
// </ProtectedRoute>
*/

export const tokenRefreshGuide = `
AUTO-REFRESH IMPLEMENTATION SUMMARY:

Timeline:
├─ 0 min: User logs in
├─ Access Token: 15 min validity
├─ Refresh Token: 365 days validity
│
├─ 14 min: ✅ Auto-refresh happens
│  └─ New access token generated
│  └─ User doesn't notice anything
│
├─ 28 min: ✅ Auto-refresh happens again
│  
├─ 365 days: ❌ Refresh token expires
│  └─ Must login again
│  └─ OR send them to login page

Key Implementations:
1. Axios Interceptor ← Easiest & Most Popular
2. React Hook ← For custom control
3. Fetch Wrapper ← Vanilla JS approach
4. Redux Middleware ← For state management
5. Next.js Middleware ← For Next.js apps

Choose based on your stack!
`;
