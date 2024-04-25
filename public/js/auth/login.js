// Implement JS for login page

const inputEmail = document.getElementById('loginEmail');
const inputPassword = document.getElementById('loginPassword');
const btnSubmit = document.getElementById('login-btn');


inputEmail.addEventListener("keyup", validateForm);
inputPassword.addEventListener("keyup", validateForm);

function validateForm() {
  const emailOK = validateEmail(inputEmail);
  const passwordOK = validateRequired(inputPassword);
  
  if(emailOK && passwordOK) {
    btnSubmit.disabled = false;
  }
  else {
    btnSubmit.disabled = true;
  }
}

function validateEmail(input){
  // Define a regular expression for email validation
  const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const userEmail = input.value;
  if(userEmail.match(emailRegEx)) {
    // it's valid
    inputEmail.classList.add("is-valid");
    inputEmail.classList.remove("is-invalid");
    return true;
  }
  else {
    // it's invalid
    inputEmail.classList.remove("is-valid");
    inputEmail.classList.add("is-invalid");
    return false;
  }
}

function validatePassword(input){
  const passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
  const passwordUser = input.value;
  if(passwordUser.match(passwordRegEx)) {
    // it's valid
    inputPassword.classList.add("is-valid");
    inputPassword.classList.remove("is-invalid");
    return true;
  }
  else {
    // it's invalid
    inputPassword.classList.remove("is-valid");
    inputPassword.classList.add("is-invalid");
    return false;
  }
}


function validateRequired(input){
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

