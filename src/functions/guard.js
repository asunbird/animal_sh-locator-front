function checkAuthentication() {
  const session = localStorage.getItem('user_session');
  const hasToken = document.cookie.split(';').some((item) => item.trim().startsWith('jwt_token='));

  if (!session || !hasToken) {
    // Clear any partial data remnants
    localStorage.removeItem('user_session');
    // Redirect to login page
    window.location.href = '/index.html';
  } else {
    return JSON.parse(session);
  }
}


function signout() {
  // Clear LocalStorage
  localStorage.removeItem('user_session');
  // Clear Cookie by expiring it
  document.cookie = "jwt_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; SameSite=Strict";
  // Redirect
  window.location.href = '/index.html';
}