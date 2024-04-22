const carouselWidth = $('.carousel-inner')[0].scrollWidth;
const cardWidth = $('.carousel-item').width();

const scrollPosition = 0;

$('.carousel-control-next').on("click", function(){
  if (scrollPosition < (carouselWidth - (cardWidth * 4))){
    let scrollPosition = scrollPosition + cardWidth;
    $(".carousel-inner").animate({scrollLeft: scrollPosition}, 600);
  }
});

$('.carousel-control-prev').on("click", function(){
  if (scrollPosition > 0){
    let scrollPosition = scrollPosition - cardWidth;
    $(".carousel-inner").animate({scrollLeft: scrollPosition}, 600);
  }
});