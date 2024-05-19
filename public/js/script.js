const tokenCookieName = "accesstoken";
const roleCookieName = "role";

const logoutBtn = document.getElementById('logout-btn');
const logoutBtnSmall = document.getElementById('logout-btn-mini');

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

// ================== Logout ==================
logoutBtn.addEventListener("click", logout);
logoutBtnSmall.addEventListener("click", logout);

function logout() {
  console.log("logout function called");
  eraseCookie(tokenCookieName);
  eraseCookie(roleCookieName);
  console.log("You have been logged out");
  window.location.href = "/";
}

// ================== Authentication Status ==================
function isConnected(){
  return getToken() !== null;
}

// ================== Role-Based Access Control ==================
function getRole() {
  return getCookie(roleCookieName);
}

function showAndHideElementsForRoles(){
  const userConnected = isConnected();
  const role = getRole();

  let allElementsToEdit = document.querySelectorAll("[data-show]");

  allElementsToEdit.forEach(element =>{
    switch(element.dataset.show){
      case "disconnected":
        if(userConnected){
          element.classList.add("d-none");
        }
        break;
      case "connected":
        if(!userConnected){
          element.classList.add("d-none");
        }
        break;
      case "admin":
        if(!userConnected || role !== "admin"){
          element.classList.add("d-none");
        }
        break;
      case "Employé":
        if(!userConnected || role !== "Employé"){
          element.classList.add("d-none");
        }
        break;
      case "Vétérinaire":
        if(!userConnected || role !== "Vétérinaire"){
          element.classList.add("d-none");
        }
        break;
    }
  })
};

// Execute on page load
window.onload = function() {
  showAndHideElementsForRoles();
};
