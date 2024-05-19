// Function to sanitize HTML content
function sanitizeHTML(html) {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

// Implement JS for contact page

const inputName = document.getElementById('nameContact');
const inputMessage = document.getElementById('messageContact');
const inputEmail = document.getElementById('messageContact');



inputName.addEventListener("keyup", validateForm);
inputMessage.addEventListener("keyup", validateForm);
inputEmail.addEventListener("keyup", validateForm);

function validateForm() {
  const nameOK = validateRequired(inputName);
  const messageOK = validateRequired(inputMessage);
  const emailOK = validateEmail(inputEmail);

  if(nameOK && messageOK && emailOK) {
    btnSubmit.disabled = false;
  }
  else {
    btnSubmit.disabled = true;
  }
}

function validateEmail(input){
  // Define a regular expression for email validation
  const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const userEmail = sanitizeHTML(input.value);
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

