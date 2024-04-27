// ======= Video animation =======
// Get reference to the video element
const video = document.getElementById('video-bg');

const videoSources = [
  "/assets/videos/elephantVideo.mp4",
  "/assets/videos/giraffeVideo.mp4",
  "/assets/videos/lemurVideo.mp4",
  "/assets/videos/ostrichVideo.mp4",
  "/assets/videos/otterVideo.mp4",
  "/assets/videos/tigerVideo.mp4",
];

// Index of current video source
var currentSourceIndex = 0;

  video.addEventListener('ended', function() {
    console.log('Video ended');
    currentSourceIndex++;
    if (currentSourceIndex >= videoSources.length) {
      currentSourceIndex = 0;
    }
    console.log('Loading video: ' + videoSources[currentSourceIndex]);
    video.src = videoSources[currentSourceIndex];
    video.load();
  });


// ======= Carousel animation =======
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

  

