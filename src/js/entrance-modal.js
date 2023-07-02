const form = document.querySelector('.search-form');
const modal = document.querySelector('.modal');
const closeModalBtn = document.getElementById('enhanced');

form.style.display = 'none';

closeModalBtn.addEventListener('click', onClick);

function onClick(evt) {
  evt.preventDefault();

  form.style.display = 'flex';
  modal.style.display = 'none';
}
