const API_URL = import.meta.env.VITE_API_URL || '';

const REFRESH_BUFFER_MS = 60 * 1000; // Refresh 1 minute before actual JWT expiration

let refreshTimerId = null;
let refreshPromise = null;

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name, value, maxAgeSeconds) {
  const isHttps = window.location.protocol === 'https:';
  const secureFlag = isHttps ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Strict${secureFlag}`;
}

function clearAuthCookie() {
  document.cookie = 'jwt_token=; path=/; max-age=0; SameSite=Strict';
  document.cookie = 'refresh_token=; path=/; max-age=0; SameSite=Strict';
}

function clearRefreshTimer() {
  if (refreshTimerId) {
    clearTimeout(refreshTimerId);
    refreshTimerId = null;
  }
}

/**
 * Decodes the payload of a JWT without external libraries to read `exp` and `iat`.
 */
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Calculates remaining lifetime in seconds from a JWT's `exp` claim.
 */
function getTokenMaxAgeSeconds(token, fallbackSeconds) {
  const payload = parseJwt(token);
  if (payload?.exp) {
    const remaining = Math.floor(payload.exp - Date.now() / 1000);
    return Math.max(0, remaining);
  }
  return fallbackSeconds;
}

/**
 * Schedules the refresh based on the accessToken's actual `exp` timestamp.
 */
export function scheduleTokenRefresh(accessToken) {
  clearRefreshTimer();

  const payload = parseJwt(accessToken);
  if (!payload?.exp) return;

  const expiresAtMs = payload.exp * 1000;
  const delay = Math.max(0, expiresAtMs - REFRESH_BUFFER_MS - Date.now());

  refreshTimerId = setTimeout(() => {
    refreshToken();
  }, delay);
}

/**
 * Call this once on app startup (e.g., in main.jsx or App.jsx) to restore
 * the refresh schedule after a page reload.
 */
export function initAuthTimer() {
  const currentAccessToken = getJwtToken();
  const currentRefreshToken = getRefreshToken();

  if (!currentRefreshToken) return;

  if (currentAccessToken) {
    scheduleTokenRefresh(currentAccessToken);
  } else {
    // Access token cookie expired while tab was closed, but refresh token is still valid
    refreshToken();
  }
}

export function getJwtToken() {
  return getCookie('jwt_token');
}

export function getRefreshToken() {
  return getCookie('refresh_token');
}

function saveAuthTokens(accessToken, newRefreshToken) {
  const accessMaxAge = getTokenMaxAgeSeconds(accessToken, 7200);
  setCookie('jwt_token', accessToken, accessMaxAge);

  if (newRefreshToken) {
    const refreshMaxAge = getTokenMaxAgeSeconds(newRefreshToken, 86400);
    setCookie('refresh_token', newRefreshToken, refreshMaxAge);
  }

  scheduleTokenRefresh(accessToken);
}

export async function login(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Authentication failed');

  saveAuthTokens(data.accessToken, data.refreshToken);

  localStorage.setItem('user_session', JSON.stringify({
    id: data.user.id,
    name: data.user.name,
    email: data.user.email,
    loginTime: new Date().toISOString(),
  }));

  return { token: data.accessToken, user: data.user };
}

export async function register(name, email, password) {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Registration failed');

  return data;
}

export async function refreshToken() {
  // Deduplicate concurrent refresh calls
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const currentRefreshToken = getRefreshToken();
      if (!currentRefreshToken) {
        console.log('[refreshToken] No refresh token available, logging out...');
        logout();
        return null;
      }

    console.log('[refreshToken] Attempting to refresh token...');

    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${currentRefreshToken}`,
      },
      // If your backend expects the refresh token in the body instead of the header, uncomment below:
      // body: JSON.stringify({ refreshToken: currentRefreshToken }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.warn('[refreshToken] Refresh failed:', data.message);
      logout();
      return null;
    }

    console.log('[refreshToken] Token refreshed successfully');
    saveAuthTokens(data.accessToken, data.refreshToken);
      return data.accessToken;
    } catch (error) {
      console.error('[refreshToken] Error:', error.message);
      logout();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export function logout() {
  clearRefreshTimer();
  clearAuthCookie();
  localStorage.removeItem('user_session');
}
