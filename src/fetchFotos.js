import axios from 'axios';

const API_KEY = 'key=35143991-d0922efd298f1f4b6c593d4ee';
const BASE_URL = 'https://pixabay.com/api/';
const OTHER_PARAMS = 'image_type=photo&orientation=horizontal&safesearch=true';

export class FotoApi {
  constructor() {
    this.inputFild = '';
    this.page = 1;
    this.per_page = 40;
  }

  async fetchFotos() {
    try {
      const url = `${BASE_URL}?${API_KEY}&q=${this.inputFild}&per_page=${this.per_page}&page=${this.page}&${OTHER_PARAMS}`;

      return await axios.get(url).then(({ data: { hits, totalHits } }) => {
        this.page += 1;
        return { hits, totalHits };
      });
    } catch (respons) {
      console.log('Error!!!');
    }
  }

  resetPage() {
    this.page = 1;
  }

  get value() {
    return this.inputFild;
  }

  set value(newValue) {
    this.inputFild = newValue;
  }
}
