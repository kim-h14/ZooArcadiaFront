import Route from "./Route.js";

// Define paths here
export const allRoutes = [
  new Route("/", "Acceuil", "/pages/home.html", [], "/js/animations/home.js"),
  new Route("/habitats", "Nos habitats", "/pages/habitats.html", [["disconnected"], ["connected", "administrator"], ["connected", "vet"]], "/js/animations/habitats.js"),
  new Route("/services", "Nos services", "/pages/services.html", [["disconnected"], ["connected", "administrator"], ["connected", "employee"]]),
  new Route("/reviews", "Avis", "/pages/reviews.html", [["disconnected"], ["connected", ["employee"]]], "/js/auth/reviews.js"),
  new Route("/animals", "Nos animaux", "/pages/animals.html", [["disconnected"], ["connected", "administrator"], ["connected", "employee"], ["connected", "vet"]], "js/animations/animals.js"),
  new Route("/contact", "Contactez nous", "/pages/contact.html", [], "/js/auth/contact.js"),
  new Route("/login", "Connexion", "/pages/login.html", [], "/js/auth/login.js"),
  new Route("/ethics", "Notre éthique", "/pages/ethics.html", []),
];

  // The title is the title of the page that will be displayed in the browser tab
  export const websiteName = "Zoo Arcadia";