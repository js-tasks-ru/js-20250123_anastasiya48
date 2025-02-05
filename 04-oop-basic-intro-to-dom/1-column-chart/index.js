export default class ColumnChart {
  constructor({    
    data = [],
    label = '',
    value = 0,
    link = '',
    formatHeading = (value) => value
  } = {}) {
    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;
    this.formatHeading = formatHeading;

    this.chartHeight = 50;
    this.element = this.getDivElement();
  }

  getDivElement() {
    const div = document.createElement('div');

    div.innerHTML = `      
      <div class="column-chart ${this.checkData()}" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          ${this.label}
          ${this.checkLink()}
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">${this.formatHeading(this.value)}</div>
          <div data-element="body" class="column-chart__chart">
            ${this.createBodyElements()}
          </div>
        </div>
      </div>
    `;

    return div.firstElementChild;
  }

  checkData() {
    if (!this.data.length) {
      return 'column-chart_loading';
    }
  }

  checkLink() {
    if (this.link) {
      return `<a href="${this.link}" class="column-chart__link">View all</a>`;
    }
  }

  createBodyElements() {
    let body = '';

    this.getColumnProps(this.data).forEach((el) => body += `<div style="--value: ${el.value}" data-tooltip="${el.percent}"></div>`);

    return body;
  }

  update(newData) {
    this.data = newData;
    document.querySelector('div[data-element="body"]').innerHTML = this.createBodyElements();
  }

  remove() {
    this.element = null;
  }

  getColumnProps(data) {
    const maxValue = Math.max(...data);
    const scale = 50 / maxValue;
  
    return data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });
  }

  destroy() {}
}
