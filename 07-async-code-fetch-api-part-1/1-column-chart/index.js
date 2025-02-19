import fetchJson from './utils/fetch-json.js';
import ColumnChartV1 from '../../04-oop-basic-intro-to-dom/1-column-chart/index.js';

const BACKEND_URL = 'https://course-js.javascript.ru';
export default class ColumnChart extends ColumnChartV1 {
  constructor({
    url = '',
    range = {},
    label = '',
    link = '',
    formatHeading = (value) => value
  } = {}) {
    super({label, link, formatHeading});

    this.value = 0;
    this.url = url;

    const {from, to} = range;
    
    this.fetchData(from, to);
  }

  createUrl(from, to) {
    const url = new URL(this.url, BACKEND_URL);

    url.searchParams.append('from', from);
    url.searchParams.append('to', to);

    return url.toString();
  }

  fetchData(from, to) {
    fetch(this.createUrl(from, to))
      .then(response => response.json())
      .then(data => {
        data = Object.values(data);
        this.value = this.calcValue(data);
        super.update(data);
      })
      .catch(err => console.log(err));
  }

  async update(from, to) {
    try {
      const response = await fetchJson(this.createUrl(from, to));
      const data = response;
      const newData = Object.values(data);
      this.value = this.calcValue(newData);
      super.update(newData);
      return response;
    } catch (err) {
      console.log(err);
    }
  }

  calcValue(data) {
    return data.reduce((sum, current) => sum + current, 0);
  }
}

