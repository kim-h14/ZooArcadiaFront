// document.addEventListener('DOMContentLoaded', function() {
//   const btn = document.querySelectorAll('.card__animal__btn');
//   buttons.forEach (button => {
//     button.addEventListener('click', function(event) {
//       event.preventDefault();
//       const card = this.closest('.card__data');
//       const details = card.querySelector('.card__details')
//       details.classList.toggle('expanded');
//     });
//   });
// });

// $(document).ready(function() {
//   $('.card__animal__btn').click(function() {
//       $(this).siblings('.card__details').toggle();
//   });
// });

// $(document).ready(function() {
//   $('.card__animal__btn').click(function() {
//       var card = $(this).closest('.card__article');
//       card.toggleClass('expanded');
//   });
// });


$(document).ready(function() {
  $('.card__animal__btn').click(function() {
      // Toggle the display of the card details
      $(this).siblings('.card__details').toggle();

      // Toggle the 'expanded' class on the card article
      var card = $(this).closest('.card__article');
      card.toggleClass('expanded');
  });
});
