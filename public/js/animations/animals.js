$(document).ready(function() {
  $('.card__animal__btn').click(function() {
      // Toggle the display of the card details
      $(this).siblings('.card__details').toggle();

      // Toggle the 'expanded' class on the card article
      var card = $(this).closest('.card__article');
      card.toggleClass('expanded');
  });
});
