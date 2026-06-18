const API_URL = import.meta.env.VITE_API_URL || '';

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function setJwtCookie(token) {
  document.cookie = `jwt_token=${encodeURIComponent(token)}; path=/; max-age=86400; SameSite=Strict`;
}

function clearJwtCookie() {
  document.cookie = 'jwt_token=; path=/; max-age=0; SameSite=Strict';
}

export function getJwtToken() {
  return getCookie('jwt_token');
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

  setJwtCookie(data.accessToken);

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
  try {
    const currentToken = getJwtToken();
    if (!currentToken) {
      console.log('[refreshToken] No token to refresh');
      return null;
    }

    console.log('[refreshToken] Attempting to refresh token...');

    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${currentToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.warn('[refreshToken] Refresh failed:', data.message);
      clearJwtCookie();
      localStorage.removeItem('user_session');
      return null;
    }

    console.log('[refreshToken] Token refreshed successfully');
    setJwtCookie(data.accessToken);
    return data.accessToken;
  } catch (error) {
    console.error('[refreshToken] Error:', error.message);
    clearJwtCookie();
    localStorage.removeItem('user_session');
    return null;
  }
}

export function logout() {
  clearJwtCookie();
  localStorage.removeItem('user_session');
}
