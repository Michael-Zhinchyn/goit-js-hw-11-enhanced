import './js/animation';
import './js/loader';
import './js/modal';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

Notiflix.Notify.init({
  width: '300px',
  position: 'right-top',
  distance: '45px',
  fontSize: '15px',
  fontAwesomeIconSize: '30px',
  warning: {
    textColor: 'black',
  },
});

import axios from 'axios';

export const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const target = document.querySelector('.js-guard');
const soundFx = document.querySelector('.soundFx');
soundFx.volume = 0.1;

const BASIC_URL = 'https://pixabay.com/api/';
const API_KEY = '37718597-f2a776258a6c278a1ed771723';

let searchQuery = '';
let lightbox;
let currentPage = 1;
let successMessageShown = false;
let soundPlayed = false;

form.addEventListener('submit', onSubmit);

async function onSubmit(evt) {
  evt.preventDefault();
  gallery.innerHTML = '';
  successMessageShown = false;
  soundPlayed = false;
  searchQuery = evt.target.elements.searchQuery.value.trim();

  if (searchQuery === '') {
    Notiflix.Notify.warning('Input field is empty');
    return;
  }

  const searchResult = await getImages();

  if (searchResult > 0) {
    if (!successMessageShown) {
      Notiflix.Notify.success(`Hooray! We found ${searchResult} images.`);
      successMessageShown = true;
    }

    if (!soundPlayed) {
      soundFx.play();
      soundPlayed = true;
    }
  }

  currentPage += 1;
  evt.target.elements.searchQuery.value = '';
}

// Функція HTTP запиту і отримання фото
async function getImages() {
  const param = new URLSearchParams({
    key: `${API_KEY}`,
    q: `${searchQuery}`,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: `${currentPage}`,
  });

  try {
    const response = await axios.get(`${BASIC_URL}?${param}`);
    const markUp = createMarkUp(response.data.hits);
    let searchResult = response.data.total;

    if (searchResult === 0) {
      Notiflix.Notify.failure('Nothing found by Your request...');
      return;
    }

    gallery.insertAdjacentHTML('beforeend', markUp);

    if (lightbox) {
      lightbox.refresh();
    } else {
      lightbox = new SimpleLightbox('.gallery a', {
        captionDelay: 200,
        captionsData: 'alt',
      });
    }

    const galleryElement = document.querySelector('.gallery');
    if (galleryElement && galleryElement.firstElementChild) {
      const { height: cardHeight } =
        galleryElement.firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }

    observer.observe(target);

    return searchResult;
  } catch (error) {
    console.error(error);
  }
}

// Функція створення розмітки
function createMarkUp(data) {
  return data
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        views,
        comments,
        downloads,
        likes,
      }) => `
      <div class="photo-card">
        <a href="${largeImageURL}">
          <img class="image" src="${webformatURL}" alt="${tags}" loading="lazy"/>
          <div class="info">
            <p class="info-item">
              <b>Likes: ${likes}</b>
            </p>
            <p class="info-item">
              <b>Views: ${views}</b>
            </p>
            <p class="info-item">
              <b>Comments: ${comments}</b>
            </p>
            <p class="info-item">
              <b>Downloads: ${downloads}</b>
            </p>
          </div>
        </a>
      </div>`
    )
    .join('');
}

let options = {
  root: null,
  rootMargin: '400px',
  threshold: 1.0,
};

let observer = new IntersectionObserver(onLoad, options);

function onLoad(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      observer.unobserve(entry.target);
      getImages();
      currentPage += 1;
    }
  });
}

window.onbeforeunload = function () {
  localStorage.setItem('previousPage', window.location.href);
};
