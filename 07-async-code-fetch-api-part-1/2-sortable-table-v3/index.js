import fetchJson from './utils/fetch-json.js';
import SortableTableV2 from "../../06-events-practice/1-sortable-table-v2/index.js";

const BACKEND_URL = 'https://course-js.javascript.ru';
export default class SortableTable extends SortableTableV2 {
  startLoading = 0
  endLoading = 30
  stepLoading = 10

  isLoading = false
  shouldLoad = true
  isSorting = false

  constructor(headersConfig, {
    url = '',
  } = {}) {
    super(headersConfig);
    this.url = url;
    this.isSortLocally = false;
    this.createLoadingElement();

    this.render(this.createUrl(this.startLoading, this.endLoading));
  }

  createLoadingElement() {
    let loadingElement = document.createElement('div');
    loadingElement.innerHTML = `<div data-element="loading" class="loading-line sortable-table__loading-line"></div>`;

    let field = this.element.querySelector('.sortable-table');
    field.append(loadingElement.firstElementChild);
  }

  createUrl(start, end) {
    const url = new URL(this.url, BACKEND_URL);

    url.searchParams.append('_embed', 'subcategory.category');
    url.searchParams.append('_sort', this.sortField);
    url.searchParams.append('_order', this.sortOder);
    url.searchParams.append('_start', start);
    url.searchParams.append('_end', end);

    return url.toString();
  }

  async render(url) {
    if (this.isLoading) {
      return;
    }

    if (!this.shouldLoad) {
      return;
    }
    
    try {
      this.isLoading = true;
      this.shouldLoad = true;
      
      const response = await fetchJson(url);

      if (response.length === 0) {
        alert("По заданному критерию запроса данные отсутствуют");
        this.shouldLoad = false;
      }

      if (!this.isSorting) {
        this.data = [...this.data, ...response];
      } else {
        this.data = response;
        this.isSorting = false;
      }

      super.updateProductsList();

      this.isLoading = false;

    } catch (err) {
      console.log(err);
    }
  }

  async handleWindowScroll() {
    const documentHeight = document.body.clientHeight;
    const windowHeight = window.innerHeight;
    const scrolled = window.scrollY;

    const shouldFetch = scrolled + windowHeight >= documentHeight - 200;

    if (shouldFetch) {
      this.startLoading += this.stepLoading;
      this.endLoading += this.stepLoading;

      await this.render(this.createUrl(this.startLoading, this.endLoading));
    }
  }

  async sortOnServer () {
    this.isSorting = true;

    this.startLoading = 0;
    this.endLoading = this.stepLoading;

    await this.render(this.createUrl(this.startLoading, this.endLoading));
  }

  sortOnClient() {
    super.sort(this.sortField, this.sortOder);
  }

  createListeners() {
    super.createListeners();

    this.handleWindowScroll = this.handleWindowScroll.bind(this);

    window.addEventListener('scroll', this.handleWindowScroll);
  }

  destroyListeners() {
    super.destroyListeners();
    window.removeEventListener('scroll', this.handleWindowScroll);
  }
}
