import './js/animation';
import './js/modal';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

Notiflix.Notify.init({
  width: '310px',
  position: 'right-top', // або будь-яке інше положення, яке ви хочете
  distance: '30px',
  fontSize: '16px',
  fontAwesomeIconSize: '30px',
  // додаткові параметри
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

form.addEventListener('submit', onSubmit);

function onSubmit(evt) {
  evt.preventDefault();
  searchQuery = evt.target.elements.searchQuery.value;

  if (searchQuery === '') {
    Notiflix.Notify.warning('Input field is empty');
    return;
  }

  getImages();
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
    let totalReceivedImages;

    totalReceivedImages += response.data.hits.length;

    if (searchResult === 0) {
      Notiflix.Notify.failure('Nothing found by Your request...');
    } else {
      soundFx.play();
      Notiflix.Notify.success(`Hooray! We found ${searchResult} images.`);
    }

    if (totalReceivedImages >= searchResult) {
      Notiflix.Notify.info('No more images left to fetch');
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

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    observer.observe(target);
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
  rootMargin: '200px',
  threshold: 1.0,
};

let observer = new IntersectionObserver(onLoad, options);

function onLoad(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      observer.unobserve(entry.target);
      getImages();
      currentPage += 1;
      observer.observe(target);
    }
  });
}

// При виході зі сторінки
window.onbeforeunload = function () {
  // Зберігаємо URL сторінки в localStorage перед виходом зі сторінки
  localStorage.setItem('previousPage', window.location.href);
};
