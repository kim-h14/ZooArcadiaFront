// Implement JS for login page

//  ========= Form Validation ==========
const inputEmail = document.getElementById('loginEmail');
const inputPassword = document.getElementById('loginPassword');
const btnSubmit = document.getElementById('login-btn');
const loginEmailError = document.getElementById('loginEmailError');
const loginPasswordError = document.getElementById('loginPasswordError');


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
  // Define a regular expression for email validation
  const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const userEmail = input.value;
  if(userEmail.match(emailRegEx)) {
    // it's valid
    inputEmail.classList.add("is-valid");
    inputEmail.classList.remove("is-invalid");
    // loginEmailError.style.display = 'none';

    return true;
  }
  else {
    // it's invalid
    inputEmail.classList.remove("is-valid");
    inputEmail.classList.add("is-invalid");
    // loginEmailError.style.display = 'block';
    return false;
  }
}

function validatePassword(input){
  console.log("validatePassword function called");
  const passwordRegEx = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/;
  const passwordUser = input.value;
  if(passwordUser.match(passwordRegEx)) {
    // it's valid
    inputPassword.classList.add("is-valid");
    inputPassword.classList.remove("is-invalid");
    // loginPasswordError.style.display = 'none';
    return true;
  }
  else {
    // it's invalid
    inputPassword.classList.remove("is-valid");
    inputPassword.classList.add("is-invalid");
    // loginPasswordError.style.display = 'block';
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
  // Here we should call the API to check the credentials in the database
  // For now we just simulate it

  if(inputEmail.value == "test@mail.com" && inputPassword.value == "Test1234!") {
    // Success
    console.log("Login successful!");

    // Get the token from the API
    const token = "lkjsdngfljsqdnglkjsdbglkjqskjgkfjgbqslkfdgbskldfgdfgsdgf";
    console.log("Token received:", token);
    setToken(token);
    // Save the token in the cookie storage

    // Redirect to dashboard
    window.location.replace("/");
  }
  else {
    // Error
    console.log("Invalid credentials!"); 
  }
};


const tokenCookieName = "accesstoken";

// Set token to cookie
function setToken(token) {
  setCookie(tokenCookieName, token, 1);
}

function getToken() {
  return getCookie(tokenCookieName);
}

function setCookie(name,value,days) {
  var expires = "";
  if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days*24*60*60*1000));
      expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

function eraseCookie(name) {   
  document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

