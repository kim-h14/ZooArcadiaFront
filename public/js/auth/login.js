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
  const userEmail = input.value;
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
  const passwordUser = input.value;
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
  console.log("Email:", inputEmail.value);
  console.log("Password:", inputPassword.value);

  // Call validateEmail and validatePassword functions
  const emailValid = validateEmail(inputEmail);
  const passwordValid = validatePassword(inputPassword);

  if (!emailValid || !passwordValid) {
    console.log("Invalid email or password format");
    return; // Exit function if email or password is invalid
  }

  // Here we should call the API to check the credentials in the database
  // For now, we just simulate it

  if(inputEmail.value === "test@mail.com" && inputPassword.value === "Test1234!") {
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

