const form = document.querySelector('.search-form');
const modal = document.querySelector('.modal');
const closeModalBtn = document.getElementById('enhanced');

form.style.display = 'none';

let player;
window.onYouTubeIframeAPIReady = function () {
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: '3rmWJAQ0Na4',
    playerVars: { autoplay: 0, controls: 1, origin: window.location.origin },
    events: {
      onReady: onPlayerReady,
    },
  });
};

function onPlayerReady(event) {
  // Once the player is ready, stop the video (so it does not autoplay)
  event.target.stopVideo();
}

closeModalBtn.addEventListener('click', onClick);

function onClick(evt) {
  evt.preventDefault();

  form.style.display = 'flex';
  modal.style.display = 'none';
  player.playVideo();
}
