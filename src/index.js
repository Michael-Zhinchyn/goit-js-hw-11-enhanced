// Імпорт необхідних залежностей
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix';
import axios from 'axios';

// Отримання доступу до необхідних елементів DOM
const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const target = document.querySelector('.js-guard'); // ціль для Intersection Observer

const BASIC_URL = 'https://pixabay.com/api/';
const API_KEY = 'Ваш API ключ тут';

let searchQuery = '';
let lightbox;
let currentPage = 1;

// Встановлення обробника подій для форми пошуку
form.addEventListener('submit', onSubmit);

// Функція обробника подій при натиску кнопки SEARCH
function onSubmit(evt) {
  evt.preventDefault(); // запобігання перезавантаження сторінки
  searchQuery = evt.target.elements.searchQuery.value; // отримання значення пошукового запиту

  // Якщо поле введення порожнє, вивести повідомлення
  if (searchQuery === '') {
    Notify.warning('Input field is empty');
    return;
  }

  // Завантаження зображень
  getImages();

  // Збільшення номера сторінки та спостереження за ціллю
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
    const markUp = createMarkUp(response.data.hits); // створення розмітки

    gallery.insertAdjacentHTML('beforeend', markUp); // додавання розмітки до галереї

    lightbox = new SimpleLightbox('.gallery a', {
      // ініціалізація lightbox
      captionDelay: 200,
      captionsData: 'alt',
    });

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2, // прокрутка сторінки вниз
      behavior: 'smooth',
    });
  } catch (error) {
    console.error(error);
  }
}

// Функція створення розмітки
function createMarkUp(data) {
  // код для створення розмітки
}

let options = {
  root: null, // відносна область перетину - в даному випадку весь viewport
  rootMargin: '200px', // відступи від області перетину
  threshold: 1.0, // частина цілі, що має бути в області перетину, щоб викликати подію перетину
};

let observer = new IntersectionObserver(onLoad, options);

// Функція, що викликається при перетині цілі з областю перетину
function onLoad(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // якщо ціль перетинається з областю перетину
      observer.unobserve(entry.target); // припинення спостереження за ціллю
      getImages(); // завантаження додаткових зображень
      currentPage += 1; // збільшення номера сторінки
      observer.observe(target); // повторне спостереження за ціллю
    }
  });
}
