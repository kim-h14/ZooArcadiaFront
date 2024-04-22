import Route from "./Route.js";

// Define paths here
export const allRoutes = [
  new Route("/", "Acceuil", "/pages/home.html"),
  new Route("/habitat", "Nos habitats", "/pages/habitat.html"),
  new Route("/services", "Nos services", "/pages/services.html"),
  new Route("/reviews", "Avis", "/pages/reviews.html"),
];

  // The title is the title of the page that will be displayed in the browser tab
  export const websiteName = "Zoo Arcadia";