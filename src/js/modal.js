const form = document.querySelector('.search-form');
const modal = document.querySelector('.modal');
const closeModalBtn = document.getElementById('enhanced');
const volumeSlider = document.getElementById('volumeSlider');

volumeSlider.style.display = 'none';

volumeSlider.addEventListener('input', event => {
  const volume = event.target.value;
  player.setVolume(volume);
});

form.style.display = 'none';
document.getElementById('player').style.visibility = 'hidden';
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
  event.target.setVolume(30);
}

closeModalBtn.addEventListener('click', onClick);

function onClick(evt) {
  evt.preventDefault();
  volumeSlider.style.display = 'block';

  form.style.display = 'flex';
  modal.style.display = 'none';
  player.playVideo();
}
