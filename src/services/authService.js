const API_URL = import.meta.env.VITE_API_URL || '';
const AUTH_LIFETIME_MS = 15 * 60 * 1000;
const AUTH_EXPIRY_KEY = 'auth_expires_at';

let authTimerId = null;

function getCookie(name) {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name, value, maxAgeSeconds) {
  const secureFlag = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Strict${secureFlag}`;
}

function clearAuthCookies() {
  document.cookie = 'jwt_token=; path=/; max-age=0; SameSite=Strict';
  document.cookie = 'refresh_token=; path=/; max-age=0; SameSite=Strict';
}

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((character) => `%${(`00${character.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function clearAuthTimer() {
  if (authTimerId !== null) {
    clearTimeout(authTimerId);
    authTimerId = null;
  }
}

function scheduleAuthExpiration(expiresAt) {
  clearAuthTimer();
  authTimerId = setTimeout(() => logout(), Math.max(0, expiresAt - Date.now()));
}

function saveAuthToken(accessToken) {
  if (!accessToken) {
    throw new Error('Login response did not include an access token');
  }

  const now = Date.now();
  const tokenExp = parseJwt(accessToken)?.exp;
  const tokenExpiresAt = Number.isFinite(tokenExp) ? tokenExp * 1000 : Infinity;
  const expiresAt = Math.min(now + AUTH_LIFETIME_MS, tokenExpiresAt);

  if (expiresAt <= now) {
    throw new Error('Login returned an expired access token');
  }

  const maxAgeSeconds = Math.ceil((expiresAt - now) / 1000);
  setCookie('jwt_token', accessToken, maxAgeSeconds);
  document.cookie = 'refresh_token=; path=/; max-age=0; SameSite=Strict';
  localStorage.setItem(AUTH_EXPIRY_KEY, String(expiresAt));
  scheduleAuthExpiration(expiresAt);
}

export function getJwtToken() {
  const token = getCookie('jwt_token');
  const expiresAt = Number(localStorage.getItem(AUTH_EXPIRY_KEY));

  if (token && Number.isFinite(expiresAt) && expiresAt > 0 && Date.now() >= expiresAt) {
    logout(false);
    return null;
  }

  return token;
}

export function initAuthTimer() {
  const accessToken = getCookie('jwt_token');
  if (!accessToken) {
    logout(false);
    return null;
  }

  const now = Date.now();
  const storedExpiry = Number(localStorage.getItem(AUTH_EXPIRY_KEY));
  const tokenExp = parseJwt(accessToken)?.exp;
  const tokenExpiresAt = Number.isFinite(tokenExp) ? tokenExp * 1000 : Infinity;
  const sessionExpiresAt = Number.isFinite(storedExpiry) && storedExpiry > 0
    ? storedExpiry
    : now + AUTH_LIFETIME_MS;
  const expiresAt = Math.min(sessionExpiresAt, tokenExpiresAt);

  if (expiresAt <= now) {
    logout(false);
    return null;
  }

  localStorage.setItem(AUTH_EXPIRY_KEY, String(expiresAt));
  setCookie('jwt_token', accessToken, Math.ceil((expiresAt - now) / 1000));
  scheduleAuthExpiration(expiresAt);
  return accessToken;
}

export async function login(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Authentication failed');

  saveAuthToken(data.accessToken);

  localStorage.setItem('user_session', JSON.stringify({
    createdAt: new Date().toISOString(),
    email: data.user.email,
    id: data.user.id,
    name: data.user.name,
    updatedAt: new Date().toISOString(),
  }));

  return { token: data.accessToken, user: data.user };
}

export async function register(name, email, password) {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Registration failed');

  return data;
}

export function logout(redirect = true) {
  clearAuthTimer();
  clearAuthCookies();
  localStorage.removeItem(AUTH_EXPIRY_KEY);
  localStorage.removeItem('user_session');

  if (redirect && window.location.pathname !== '/components/signin') {
    window.location.href = '/components/signin';
  }
}
