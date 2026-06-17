document.addEventListener('DOMContentLoaded', () => {
  const signinForm = document.getElementById('signinForm');
  const formMessage = document.getElementById('formMessage');

  signinForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    resetMessages();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Basic frontend validation
    if (!validateEmail(email) || !password) {
      displayMessage('Please fill in all fields correctly.', 'error');
      return;
    }

    try {
      // Toggle loading state
      setLoading(true);

      // API Call sending data to the server
      const response = await fetch('https://yourdomain.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      // Successful login handling
      handleAuthSuccess(data);

    } catch (error) {
      displayMessage(error.message, 'error');
    } finally {
      setLoading(false);
    }
  });
});

/**
 * Handles saving session and token data upon successful authentication
 * @param {Object} authResponse - The backend API response data
 */
function handleAuthSuccess(authResponse) {
  const { token, user } = authResponse;

  // 1. Save sensitive JWT Token in Cookies
  // Secure flags: SameSite=Strict prevents CSRF; Secure ensures HTTPS transmission
  // Note: For maximum security against XSS, the backend should set this cookie directly via 'Set-Cookie' header as HttpOnly.
  document.cookie = `jwt_token=${token}; path=/; max-age=86400; Secure; SameSite=Strict`;

  // 2. Save non-sensitive User Session data in LocalStorage
  const sessionData = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    loginTime: Date.now()
  };
  localStorage.setItem('user_session', JSON.stringify(sessionData));

  // 3. UI Redirect or success state
  displayMessage('Login successful! Redirecting...', 'success');
  setTimeout(() => {
    window.location.href = '/dashboard.html';
  }, 1500);
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function resetMessages() {
  const formMessage = document.getElementById('formMessage');
  formMessage.textContent = '';
  formMessage.className = 'form-message';
}

function displayMessage(text, type) {
  const formMessage = document.getElementById('formMessage');
  formMessage.textContent = text;
  formMessage.className = `form-message ${type}`;
}

function setLoading(isLoading) {
  const btn = document.getElementById('submitBtn');
  btn.disabled = isLoading;
  btn.textContent = isLoading ? 'Signing In...' : 'Sign In';
}