import Route from "./Route.js";

// Define paths here
export const allRoutes = [
  new Route("/", "Acceuil", "/pages/home.html"),
  new Route("/habitats", "Nos habitats", "/pages/habitats.html"),
  new Route("/services", "Nos services", "/pages/services.html"),
  new Route("/reviews", "Avis", "/pages/reviews.html", "/js/auth/reviews.js"),
  new Route("/animals", "Nos animaux", "/pages/animals.html"),
  new Route("/contact", "Contactez nous", "/pages/contact.html", "/js/auth/contact.js"),
  new Route("/login", "Connexion", "/pages/login.html", "/js/auth/login.js"),
  new Route("/ethics", "Notre éthique", "/pages/ethics.html"),
];

  // The title is the title of the page that will be displayed in the browser tab
  export const websiteName = "Zoo Arcadia";