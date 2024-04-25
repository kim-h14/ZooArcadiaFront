// Implement JS for reviews page

const inputName = document.getElementById('firstName__reviews');
const inputCity = document.getElementById('city__reviews');
const inputEmail = document.getElementById('email__reviews');
const inputMessage = document.getElementById('message__reviews');
const btnSubmit = document.getElementById('reviews__button');


inputName.addEventListener("keyup", validateForm);
inputCity.addEventListener("keyup", validateForm);
inputEmail.addEventListener("keyup", validateForm);
inputMessage.addEventListener("keyup", validateForm);

function validateForm() {
  const nameOK = alidateRequired(inputName);
  const cityOK = validateRequired(inputCity);
  const messageOK = validateRequired(inputMessage);
  const emailOK = validateEmail(inputEmail);
  
  if(nameOK && cityOK && messageOK && emailOK) {
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

