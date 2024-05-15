// ======= ANIMATIONS =======

// ++++++++ <3 button animation and counter ++++++++
// Check if the page is fully loaded
window.onload = function() {
  console.log("Page fully loaded");

  const heartIcon = document.querySelector(".heart");
  console.log(heartIcon); // Check if the heart icon is correctly selected

  const likeCounter = document.querySelector(".like-counter");
  console.log(likeCounter); // Check if the like counter is correctly selected

  let likeCount = 0;

  heartIcon.addEventListener("click", function(event) {
      console.log("Heart icon clicked"); // Check if the heart icon click event is triggered

      event.preventDefault(); // Prevent default behavior of the anchor tag
      likeCount++;
      likeCounter.textContent = likeCount;
      likeCounter.style.display = "inline";

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
document.querySelectorAll('.card__article').forEach(article => {
  article.addEventListener('click', function() {
    const animalName = this.id; // Get the animal name from the id attribute
    fetch('/animal/click', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ animal: animalName })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update consultation count');
      }
      return response.json();
    })
    .then(data => {
      // Update the like counter or perform any other action as needed
      const likeCounter = this.querySelector('.like-counter');
      likeCounter.textContent = parseInt(likeCounter.textContent) + 1;
    })
    .catch(error => {
      console.error('Error updating consultation count:', error);
    });
  });
});
