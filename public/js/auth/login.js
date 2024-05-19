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
// const logoutBtn = document.getElementById('logout-btn');


inputEmail.addEventListener("keyup", function() {
  console.log("Email input keyup event triggered");
});
inputPassword.addEventListener("keyup", function() {
  console.log("Password input keyup event triggered");
});

function validateForm() {
  console.log("validateForm function called");
  const emailOK = validateEmail(inputEmail);
  const passwordOK = validateRequired(inputPassword);
  
  if(emailOK && passwordOK) {
    btnSubmit.disabled = false;
    console.log("Email and password are valid");
  }
  else {
    btnSubmit.disabled = true;
    console.log("Email and/or password are invalid");
  }
}

function validateEmail(input){
  console.log("validateEmail function called");
  const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const userEmail = sanitizeHTML(input.value);
  if(userEmail.match(emailRegEx)) {
    // it's valid
    console.log("Email is valid");
    inputEmail.classList.add("is-valid");
    inputEmail.classList.remove("is-invalid");
    return true;
  }
  else {
    // it's invalid
    console.log("Email is invalid");
    inputEmail.classList.remove("is-valid");
    inputEmail.classList.add("is-invalid");
    return false;
  }
}

function validatePassword(input){
  console.log("validatePassword function called");
  const passwordRegEx = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/;
  const passwordUser = sanitizeHTML(input.value);
  if(passwordUser.match(passwordRegEx)) {
    // it's valid
    console.log("Password is valid");
    inputPassword.classList.add("is-valid");
    inputPassword.classList.remove("is-invalid");
    return true;
  }
  else {
    // it's invalid
    console.log("Password is invalid");
    inputPassword.classList.remove("is-valid");
    inputPassword.classList.add("is-invalid");
    return false;
  }
}



function validateRequired(input){
  console.log("validateRequired function called");
  const userInput = sanitizeHTML(input.value);

  if(input.value != "") {
    // it's valid
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
    return true;
  }
  else {
    // it's invalid
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    return false;
  }
}

// ========= Simulate Login ==========

btnSubmit.addEventListener("click", checkCredentials);

function checkCredentials() {
  console.log("checkCredentials function called");
  // Log the values of inputEmail and inputPassword
  const sanitizedEmail = sanitizeHTML(inputEmail.value);
  const sanitizedPassword = sanitizeHTML(inputPassword.value);
  console.log("Email:", sanitizedEmail);
  console.log("Password:", sanitizedPassword);

  // Call validateEmail and validatePassword functions
  const emailValid = validateEmail(inputEmail);
  const passwordValid = validatePassword(inputPassword);

  if (!emailValid || !passwordValid) {
    console.log("Invalid email or password format");
    return; // Exit function if email or password is invalid
  }

  // Here we should call the API to check the credentials in the database
  // For now, we just simulate it

  if (sanitizedEmail === "test@mail.com" && sanitizedPassword === "Test1234!") {
    // Success
    alert("Login successful!");

    // Get the token from the API
    const token = "lkjsdngfljsqdnglkjsdbglkjqskjgkfjgbqslkfdgbskldfgdfgsdgf";
    console.log("Token received:", token);
    setToken(token);
    // Save the token in the cookie storage

    setCookie(roleCookieName, "admin", 7);

    // Redirect to dashboard
    window.location.replace("/");
  } else {
    // Error
    console.log("Invalid credentials!");
  }
}
