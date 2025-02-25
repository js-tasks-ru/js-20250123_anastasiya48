import fetchJson from './utils/fetch-json.js';
import SortableTableV2 from "../../06-events-practice/1-sortable-table-v2/index.js";

const BACKEND_URL = 'https://course-js.javascript.ru';
export default class SortableTable extends SortableTableV2 {
  startLoading = 0
  endLoading = 30
  stepLoading = 10
  isLoading = false

  constructor(headersConfig, {
    url = '',
  } = {}) {
    super(headersConfig);
    this.url = url;
    this.isSortLocally = false;

    this.render(this.createUrl(this.startLoading, this.endLoading));
  }

  createUrl(start, end) {
    const url = new URL(this.url, BACKEND_URL);

    url.searchParams.append('_sort', this.sortField);
    url.searchParams.append('_order', this.sortOder);
    url.searchParams.append('_start', start);
    url.searchParams.append('_end', end);

    return url.toString();
  }

  async render(url) {
    try {
      const response = await fetchJson(url);

      if (this.isLoading) {
        this.data = [...this.data, ...response];
      } else {
        this.data = response;
      }

      super.updateProductsList();

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
      this.isLoading = true;

      this.startLoading += this.stepLoading;
      this.endLoading += this.stepLoading;

      await this.render(this.createUrl(this.startLoading, this.endLoading))
    }
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

  async sortOnServer () {
    this.isLoading = false;

    this.startLoading = 0;
    this.endLoading = this.stepLoading;

    await this.render(this.createUrl(this.startLoading, this.endLoading));
  }

  sortOnClientrt() {
    super.sort(this.sortField, this.sortOder);
  }
}
