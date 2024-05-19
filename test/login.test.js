const { setupLoginForm, sanitizeHTML } = require('../public/js/auth/login'); 

// Mocking the DOM elements
document.body.innerHTML = `
  <input type="email" id="loginEmail">
  <input type="password" id="loginPassword">
  <button id="login-btn">Connexion</button>
  <div id="loginEmailError"></div>
  <div id="loginPasswordError"></div>
`;

const { validateEmail, validatePassword } = setupLoginForm();

test('validateEmail - valid email', () => {
  const inputEmail = document.getElementById('loginEmail');
  inputEmail.value = 'test@mail.com';
  expect(validateEmail(inputEmail)).toBe(true);
});

test('validateEmail - invalid email', () => {
  const inputEmail = document.getElementById('loginEmail');
  inputEmail.value = 'invalid-email';
  expect(validateEmail(inputEmail)).toBe(false);
});

test('validatePassword - valid password', () => {
  const inputPassword = document.getElementById('loginPassword');
  inputPassword.value = 'Test1234!';
  expect(validatePassword(inputPassword)).toBe(true);
});

test('validatePassword - invalid password', () => {
  const inputPassword = document.getElementById('loginPassword');
  inputPassword.value = 'short';
  expect(validatePassword(inputPassword)).toBe(false);
});

test('sanitizeHTML', () => {
  expect(sanitizeHTML('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert("xss")&lt;/script&gt;');
});
