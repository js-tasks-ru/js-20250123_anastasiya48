import fetchJson from './utils/fetch-json.js';
import SortableTableV2 from "../../06-events-practice/1-sortable-table-v2/index.js";

const BACKEND_URL = 'https://course-js.javascript.ru';
export default class SortableTable extends SortableTableV2 {
  constructor(headersConfig, {
    url = '',
  } = {}) {
    super(headersConfig);
    this.url = url;
    this.isSortLocally = false;

    this.render(this.createUrl());
  }

  createUrl() {
    const url = new URL(this.url, BACKEND_URL);

    url.searchParams.append('_sort', this.sortField);
    url.searchParams.append('_order', this.sortOder);
    // url.searchParams.append('_start', this.sortOder);
    // url.searchParams.append('_end', this.sortOder);

    return url.toString();
  }

  // sort() {
  //   this.render(this.createUrl());
  // }

  async render(url) {
    try {
      const response = await fetchJson(url);
      const data = response;
      this.data = data;
      super.updateProductsList();
    } catch (err) {
      console.log(err);
    }
  }



  sortOnClient () {
    super.sort(this.sortField, this.sortOder);
  }

  sortOnServer () {
    this.render(this.createUrl());
  }
}
