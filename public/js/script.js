const tokenCookieName = "accesstoken";
const roleCookieName = "role";

const logoutBtn = document.getElementById('logout-btn');
const logoutBtnSmall = document.getElementById('logout-btn-mini');

function getRole() {
  return getCookie(roleCookieName);
}


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

// // =========== Confirm connection ===========

function isConnected(){
  if(getToken() == null || getToken == undefined){
      return false;
  }
  else{
      return true;
  }
}

if(isConnected()){
  console.log("Connected");
} 
else{
  console.log("Not connected");
}

// ================== Logout ==================
logoutBtn.addEventListener("click", logout);

function logout() {
  console.log("logout function called");
  eraseCookie(tokenCookieName);
  eraseCookie(roleCookieName);
  console.log("You have been logged out");
  window.location.reload();
}
// for small screen with hamburger menu
logoutBtnSmall.addEventListener("click", logout);

function logout() {
  console.log("logout function called");
  eraseCookie(tokenCookieName);
  console.log("You have been logged out");
  window.location.reload();
}


// We have 4 users
// 1. Disconnect user
// 2. Connected use (Admin or employee or vet)
//      3. Admin
//      4. Employee
//      5. Vet

function showAndHideElementsForRoles(){
  const userConnected = isConnected();
  const role = getRole();
  console.log("Role:", role);

  let allElementsToEdit = document.querySelectorAll("[data-show]");
  console.log("All elements to edit:", allElementsToEdit);

  // allElementsToEdit.forEach((element) => {
  //     const roles = element.getAttribute("data-show").split(" ");
  //     console.log("Roles:", roles);

  //     if(roles.includes(role) && userConnected){
  //         element.style.display = "block";
  //     }
  //     else{
  //         element.style.display = "none";
  //     }
  // });

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
      case "employee":
        if(!userConnected || role !== "employee"){
          element.classList.add("d-none");
        }
        break;
      case "vet":
        if(!userConnected || role !== "vet"){
          element.classList.add("d-none");
        }
        break;
    }
  })
};


// // Protection against XSS vulnerabilities
// function sanitizeHTML(text) {
//   const tempHTML = document.createElement('div');
//   tempHTML.textContent = text;
//   return tempHTML.innerHTML;
// }
// module.exports = sanitizeHTML;