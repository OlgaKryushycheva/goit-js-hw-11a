import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { FotoApi } from './fetchFotos';

const gallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const fotoApi = new FotoApi();

const searchFormEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const loadMorBtnEl = document.querySelector('.load-more');

searchFormEl.addEventListener('submit', onSearchFormSubmit);
loadMorBtnEl.addEventListener('click', onLoadMorBtn);

const per_page = fotoApi.per_page;

function onSearchFormSubmit(e) {
  e.preventDefault();
  fotoApi.value = e.target.elements.searchQuery.value.trim();
  loadMorBtnDisable();

  if (fotoApi.value === '') {
    Notiflix.Notify.warning('Please enter, what exactly you want to find?');
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

    const { height: cardHeight } =
      galleryEl.firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    loadMorBtnEnable();
    if (card.hits.length < per_page) {
      loadMorButtonDisable();
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
       <a href="${largeImageURL}" class="gallery__item">
       <img src="${webformatURL}" 
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
