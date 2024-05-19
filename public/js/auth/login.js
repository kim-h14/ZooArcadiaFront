// Function to sanitize HTML content
function sanitizeHTML(html) {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

// Implement JS for login page
//  ========= Form Validation ==========
const inputEmail = document.getElementById('loginEmail');
const inputPassword = document.getElementById('loginPassword');
const btnSubmit = document.getElementById('login-btn');
const loginEmailError = document.getElementById('loginEmailError');
const loginPasswordError = document.getElementById('loginPasswordError');

inputEmail.addEventListener("keyup", function() {
  console.log("Email input keyup event triggered");
  validateEmail(inputEmail); // Validate email on each keyup event
});
inputPassword.addEventListener("keyup", function() {
  console.log("Password input keyup event triggered");
  validatePassword(inputPassword); // Validate password on each keyup event
});

// Validate form on submit
btnSubmit.addEventListener("click", function(event) {
  event.preventDefault();
  validateForm();
});

async function validateForm() {
  console.log("validateForm function called");
  const emailValid = validateEmail(inputEmail);
  const passwordValid = validatePassword(inputPassword);

  if (emailValid && passwordValid) {
    try {
      const response = await login(); // Call login function to handle authentication
      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        const role = data.role;
        setToken(token); // Set token to cookie
        redirectToDashboard(role); // Redirect based on role
      } else {
        console.log("Invalid credentials!");
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  } else {
    console.log("Email and/or password are invalid");
  }
}

async function login() {
  console.log("login function called");
  const sanitizedEmail = sanitizeHTML(inputEmail.value);
  const sanitizedPassword = sanitizeHTML(inputPassword.value);
  console.log("Email:", sanitizedEmail);
  console.log("Password:", sanitizedPassword);

  return fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      Email: sanitizedEmail,
      Password: sanitizedPassword
    })
  });
}

// Helper function to redirect to the dashboard based on role
function redirectToDashboard(role) {
  switch (role) {
    case 'admin':
      window.location.replace("/admindashboard");
      break;
    case 'Employé':
      window.location.replace("/employeeDashboard");
      break;
    case 'Vétérinaire':
      window.location.replace("/vetDashboard");
      break;
    default:
      console.log("Unknown role received");
      break;
  }
}

// Validate email format
function validateEmail(input) {
  console.log("validateEmail function called");
  const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const userEmail = sanitizeHTML(input.value);
  const isValid = emailRegEx.test(userEmail);

  if (isValid) {
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
  } else {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
  }

  return isValid;
}

// Validate password format
function validatePassword(input) {
  console.log("validatePassword function called");
  const passwordRegEx = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/;
  const passwordUser = sanitizeHTML(input.value);
  const isValid = passwordRegEx.test(passwordUser);

  if (isValid) {
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
  } else {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
  }

  return isValid;
}
