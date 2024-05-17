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

  

// ========== Fetch reviews on loops from database ==========
function fetchAndInjectReviews() {
  $.get('/approved_reviews')
      .done(function(data) {
          const reviewSection = $('.review-para');
          
          // Clear existing content
          reviewSection.empty();
          
           // If there are reviews available
           if (data.length > 0) {
            let index = 0;

            function displayNextReview() {
              // Clear existing content
              reviewSection.empty();

              // Display the current review
              const review = data[index];
              const reviewParagraph = $('<p>').text(review.review_text);
              const reviewAuthor = $('<p>').addClass('review-author').text(`- ${review.client_name}, ${review.city}`);
              reviewSection.append(reviewParagraph, reviewAuthor);

              // Increment index to move to the next review
              index = (index + 1) % data.length;

              // Schedule display of next review after 30 seconds
              setTimeout(displayNextReview, 30000);
          }

          // Start displaying reviews
          displayNextReview();
      } else {
          // If no reviews are available, display a message
          const noReviewMessage = $('<p>').text('No reviews available.');
          reviewSection.empty().append(noReviewMessage);
      }
  })
  .fail(function(jqXHR, textStatus, errorThrown) {
      console.error('Error fetching and injecting reviews:', errorThrown);
  });
}

$(document).ready(fetchAndInjectReviews);
