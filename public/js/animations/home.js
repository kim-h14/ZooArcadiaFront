// $(document).ready(function() {
//   let scrollPosition = 0;
//   const cardWidth = $('.carousel-item').outerWidth();
//   const carouselWidth = $('.carousel-inner').outerWidth();
//   const numCards = $('.carousel-item').length;

//   $('.carousel-control-next').on("click", function(){
//       if (scrollPosition < (carouselWidth - cardWidth)){
//           scrollPosition += cardWidth;
//       } else {
//           scrollPosition = 0; // Reset scroll position to start
//       }
//       $(".carousel-inner").animate({scrollLeft: scrollPosition}, 600);
//   });

//   $('.carousel-control-prev').on("click", function(){
//       if (scrollPosition > 0){
//           scrollPosition -= cardWidth;
//       } else {
//           scrollPosition = (numCards - 1) * cardWidth; // Scroll to the last card
//       }
//       $(".carousel-inner").animate({scrollLeft: scrollPosition}, 600);
//   });
// });

$(document).ready(function() {
  let scrollPosition = 0;
  const cardWidth = $('.carousel-item').outerWidth();
  const carouselWidth = $('.carousel-inner').outerWidth();
  const numCards = $('.carousel-item').length;

  $('.carousel-control-next').on("click", function(){
      if (scrollPosition < (carouselWidth - cardWidth)){
          scrollPosition += cardWidth;
          if (scrollPosition >= carouselWidth - cardWidth) {
              // If at the last card, scroll back to the first card
              scrollPosition = 0;
          }
      }
      $(".carousel-inner").animate({scrollLeft: scrollPosition}, 600);
  });

  $('.carousel-control-prev').on("click", function(){
      if (scrollPosition === 0){
          scrollPosition = (numCards - 1) * cardWidth; // Scroll to the last card
      } else {
          scrollPosition -= cardWidth;
      }
      $(".carousel-inner").animate({scrollLeft: scrollPosition}, 600);
  });
});

  

