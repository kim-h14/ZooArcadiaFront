export default class Route {
  constructor(url, title, pathHtml, authorize, pathJS = "") {
    this.url = url;
    this.title = title;
    this.pathHtml = pathHtml;
    this.pathJS = pathJS;
    this.authorize = authorize
  } 
}

/* Authentification table
["disconnected"] - Reserved for pages that are accessible to all disconnected users 
["connected"] - Reserved for pages that are accessible to all connected users
["connected", "admin"] - Reserved for users with admin rights/roles
["connected", "employee"] - Reserved for users with employee rights/roles
["connected", "vet"] - Reserved for users with vet rights/roles
*/ 