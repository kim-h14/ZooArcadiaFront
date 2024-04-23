import Route from "./Route.js";
import { allRoutes, websiteName } from "./allRoutes.js";

// Page 404's route creation
const page404 = new Route("/404", "Page introuvable", "/pages/404.html");

// Function to get the route from the URL
const getRouteByUrl = (url) => {
  let currentRoute = null;
  // browse all routes
  allRoutes.forEach((element) => {
    if (element.url == url) {
      currentRoute = element;
    }
  });
  // if the route is not found, return the 404 page
  if (currentRoute != null) {
    return currentRoute;
  } else {
    return page404;
  }
};

// Function to load page content
const loadPageContent = async () => {
  const path = window.location.pathname;
  // get the route from the URL
  const actualRoute = getRouteByUrl(path);
  // load the HTML content of the page
  const html = await fetch(actualRoute.pathHtml).then((data) => data.text());
  // load html content to the element with the id "main-page"
  document.getElementById("main-page").innerHTML = html;

  // Load JS content
  if (actualRoute.pathJS != "") {
  //  create a script element
  const scriptTag = document.createElement("script");
  scriptTag.setAttribute("type", "text/javascript");
  scriptTag.setAttribute("src", actualRoute.pathJS);

  // add the script element to the body
  document.querySelector("body").appendChild(scriptTag);
  }

  // set the title of the page
  document.title = actualRoute.title + " - " + websiteName;
};

// Function to handle the navigation (link click)
const routeEvent = (event) => {
  event = event || window.event;
  event.preventDefault();
  // URL update into the browser
  window.history.pushState({}, "", event.target.href);
  // load the page content
  loadPageContent();
};

// Function to handle the back and forward buttons
window.onpopstate = loadPageContent;
// Assign the routeEvent function to the window's route property
window.route = routeEvent;
loadPageContent();