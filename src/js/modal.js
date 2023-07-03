const form = document.querySelector('.search-form');
const modal = document.querySelector('.modal');
const closeModalBtn = document.getElementById('enhanced');
const volumeSlider = document.getElementById('volumeSlider');
const toTopBtn = document.querySelector('.to-top-btn');
const toBackBtn = document.querySelector('.back-link');

toTopBtn.style.display = 'none';
toBackBtn.style.display = 'none';
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
  event.target.stopVideo();
  event.target.setVolume(30);
}

closeModalBtn.addEventListener('click', onClick);

function onClick(evt) {
  evt.preventDefault();
  volumeSlider.style.display = 'block';
  form.style.display = 'flex';
  modal.style.display = 'none';
  toTopBtn.style.display = 'block';
  toBackBtn.style.display = 'inline-block';
  player.playVideo();
}

toTopBtn.addEventListener('click', onBtnClick);

function onBtnClick() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
