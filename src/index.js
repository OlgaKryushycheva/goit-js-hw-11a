import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './css/styles.css';
import { FotoApi } from './fetchFotos';

const searchFormEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const loadMorBtnEl = document.querySelector('.load-more');

searchFormEl.addEventListener('submit', onSearchSubmit);
loadMorBtnEl.addEventListener('click', onLoadMorBtn);

const fotoApi = new FotoApi();

const per_page = fotoApi.per_page;

function onSearchSubmit(e) {
  e.preventDefault();
  fotoApi.value = e.target.elements.searchQuery.value.trim();
  loadMorBtnDisable();

  if (fotoApi.value === '') {
    return;
  }
  fotoApi.resetPage();
  clearMarkup();
  fotoApi.fetchFotos().then(({ hits, totalHits }) => {
    if (hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    randerMarkup(hits);
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

    if (totalHits < per_page) {
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      return;
    }
    gallery.refresh();
    loadMorBtnEnable();
  });
}

function onLoadMorBtn() {
  loadMorBtnDisable();
  fotoApi.fetchFotos().then(card => {
    randerMarkup(card.hits);

    loadMorBtnEnable();
    if (card.hits.length < per_page) {
      loadMorBtnDisable();
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
    gallery.refresh();
  });
}

function randerMarkup(data) {
  const markUp = createMarkup(data);
  galleryEl.insertAdjacentHTML('beforeend', markUp);
}

function clearMarkup() {
  galleryEl.innerHTML = '';
}

function createMarkup(array) {
  return array
    .map(foto => {
      const {
        tags,
        webformatURL,
        likes,
        views,
        comments,
        downloads,
        largeImageURL,
      } = foto;
      return `<div class="photo-card">
       <a href="${largeImageURL}">
       <img class="gallery__image"
       src="${webformatURL}" 
       alt="${tags}" 
       loading="lazy" />
       </a>
     <div class="info">
         <p class="info-item">
           <b>Likes <br />${likes}</b>
         </p>
         <p class="info-item">
           <b>Views <br />${views}</b>
         </p>
         <p class="info-item">
           <b>Comments <br />${comments}</b>
         </p>
         <p class="info-item">
           <b>Downloads <br />${downloads}</b>
         </p>
       </div>
     </div>`;
    })
    .join('');
}

function loadMorBtnDisable() {
  loadMorBtnEl.classList.add('hidden');
}

function loadMorBtnEnable() {
  loadMorBtnEl.classList.remove('hidden');
}

const gallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
});
