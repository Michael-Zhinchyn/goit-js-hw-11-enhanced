import './js/animation';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix';
import { Report } from 'notiflix/build/notiflix-report-aio';
import axios from 'axios';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const target = document.querySelector('.js-guard');

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
    Notify.warning('Input field is empty');
    return;
  }

  getImages();

  currentPage += 1;
  observer.observe(target);
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
  } catch (error) {
    Notify.failure('Something went wrong...');
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
