// ======= ANIMATIONS =======

window.onload = function() {
  console.log("Page fully loaded");

  const heartIcon = document.querySelector(".heart");
  console.log(heartIcon); // Check if the heart icon is correctly selected

  const likeCounter = document.querySelector(".like-counter");
  console.log(likeCounter); // Check if the like counter is correctly selected

  const animalName = document.querySelector(".card__animal__title").textContent.trim(); // Assuming the animal name is used as the identifier

  // Fetch initial like count
  fetch(`/animal-consultations/${animalName}/like-count`)
    .then(response => response.json())
    .then(data => {
      if (data.count !== undefined) {
        likeCounter.textContent = data.count;
      }
    })
    .catch(error => console.error('Error fetching like count:', error));

  let likeCount = parseInt(likeCounter.textContent, 10) || 0;

  heartIcon.addEventListener("click", function(event) {
      console.log("Heart icon clicked"); // Check if the heart icon click event is triggered

      event.preventDefault(); // Prevent default behavior of the anchor tag
      likeCount++;
      likeCounter.textContent = likeCount;
      likeCounter.style.display = "inline";

      // Update the like count on the server
      fetch(`/animal-consultations/${animalName}/like-count`, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
          if (data.count !== undefined) {
            likeCounter.textContent = data.count;
          }
        })
        .catch(error => console.error('Error updating like count:', error));

      // Create flying heart emoji
      const flyingHeart = document.createElement("span");
      flyingHeart.textContent = "❤️";
      flyingHeart.classList.add("flying-heart");
      document.body.appendChild(flyingHeart);

      // Remove flying heart emoji after animation ends
      flyingHeart.addEventListener("animationend", function() {
          console.log("Flying heart animation ended"); // Check if the flying heart animation ends
          flyingHeart.remove();
      });
  });
};



// ++++++++ "En savoir plus" button animation ++++++++
$(document).ready(function() {
  $('.card__animal__btn').click(function() {
      // Toggle the display of the card details
      $(this).siblings('.card__details').toggle();

      // Toggle the 'expanded' class on the card article
      var card = $(this).closest('.card__article');
      card.toggleClass('expanded');
  });
});


// ============= Consultation of animal cards =============
// Define a function to send consultation registration request
function registerConsultation(animalName) {
  fetch('/animal-consultations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      animal: animalName
    })
  })
  .then(response => {
    if (response.ok) {
      // Update like counter on successful registration
      const likeCounter = document.querySelector(`#${animalName} .like-counter`);
      const currentCount = parseInt(likeCounter.textContent);
      likeCounter.textContent = currentCount + 1;
    } else {
      console.error('Failed to register consultation');
    }
  })
  .catch(error => console.error('Error:', error));
}


// 