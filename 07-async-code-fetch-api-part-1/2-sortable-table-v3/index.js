import fetchJson from './utils/fetch-json.js';
import SortableTableV2 from "../../06-events-practice/1-sortable-table-v2/index.js";

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTableV3 extends SortableTableV2 {
  startLoading = 0
  endLoading = 30
  stepLoading = 10

  isLoading = false
  isSorting = false

  constructor(headersConfig, {
    url = '',
    data,
    sorted,
    isSortLocally = false
  } = {}) {
    super(headersConfig, { data, sorted, isSortLocally });
    this.url = url;
    this.createLoadingElement();
  }

  createLoadingElement() {
    let loadingElement = document.createElement('div');
    loadingElement.innerHTML = `<div data-element="loading" class="loading-line sortable-table__loading-line"></div>`;

    let field = this.element.querySelector('.sortable-table');
    field.append(loadingElement.firstElementChild);
  }

  createUrl() {
    const url = new URL(this.url, BACKEND_URL);

    url.searchParams.append('_embed', 'subcategory.category');
    url.searchParams.append('_sort', this.field);
    url.searchParams.append('_order', this.order);
    url.searchParams.append('_start', this.startLoading);
    url.searchParams.append('_end', this.endLoading);

    return url.toString();
  }

  async render() {
    if (this.isLoading) {
      return;
    }

    try {
      this.isLoading = true;
      
      const url = this.createUrl();
      const response = await fetchJson(url);

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

      await this.render();
    }
  }

  async sortOnServer(field, order) {
    this.field = field;
    this.order = order;

    this.isSorting = true;

    this.startLoading = 0;
    this.endLoading = this.stepLoading;

    await this.render();
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
