export default class SortableTable {
  subElements = {}

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.order = '';
    this.field = '';

    this.element = this.createElement(this.createTamplate());
    this.selectSubElements();
  }

  selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(element => {
      this.subElements[element.dataset.element] = element;
    });
  }

  createElement(template) {
    const containerElement = document.createElement('div');
    containerElement.innerHTML = template;

    return containerElement.firstElementChild;
  }

  createTamplate() {
    return `
    <div data-element="productsContainer" class="products-list__container">
      <div class="sortable-table">

        <div data-element="header" class="sortable-table__header sortable-table__row">
          ${this.createHeaders()}
        </div>

        <div data-element="body" class="sortable-table__body">
          ${this.createProductsList()}
        </div>
      </div>
    </div>
    `;
  }

  createHeaders() {
    return this.headerConfig.map((el) => (`
      <div class="sortable-table__cell" data-id="${el.id}" data-sortable="${el.sortable}" data-order="${this.order}">
        <span>${el.title}</span>
      </div>
    `)).join('');
  }

  createProductsList() {
    return this.data.map((item) => (`
      <a href="/products/${item.id}" class="sortable-table__row">
        ${this.createTableRowTemplate(item)}
      </a>
      `)).join('');
  }

  createTableRowTemplate(data) {
    let html = '';

    this.headerConfig.forEach((columnConfig) => {
      if (columnConfig.template) {
        html += columnConfig.template(data[columnConfig.id]);
      } else if (columnConfig.id in data && columnConfig.id !== 'id') {
        html += `<div class="sortable-table__cell">${data[columnConfig.id]}</div>`;
      }
    });

    return html;
  }

  sort(fieldValue, orderValue) {
    this.field = fieldValue;
    this.order = orderValue;

    let sortType = this.headerConfig.find(item => item.id === fieldValue)?.sortType;

    if (sortType === 'string') {
      this.sortStrings(fieldValue, orderValue);
      this.updateProductsList();
    }

    if (sortType === 'number') {
      this.sortNumbers(fieldValue, orderValue);
      this.updateProductsList();
    }
  }

  sortStrings(field, orde) {  
    if (orde == 'asc') {
      return this.data.sort((a, b) => a[field].localeCompare(b[field], ['ru', 'en'], {caseFirst: 'upper'}));
    } 
    
    if (orde == 'desc') {
      return this.data.sort((a, b) => b[field].localeCompare(a[field], ['ru', 'en'], {caseFirst: 'lower'}));
    }
  }

  sortNumbers(field, orde) {
    if (orde == 'asc') {
      return this.data.sort((a, b) => a[field] - b[field]);
    } 
    
    if (orde == 'desc') {
      return this.data.sort((a, b) => b[field] - a[field]);
    }
  }

  createSortArrowElement() {
    const header = this.headerConfig.map(el => el.id);

    let arrowElement = document.createElement('div');
    arrowElement.innerHTML = `       
      <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>
    `;

    let field = this.subElements.header.children.item(header.indexOf(this.field));
    field.append(arrowElement.firstElementChild);

    return field.children[1];
  }

  updateProductsList() {
    this.subElements.body.innerHTML = this.createProductsList();
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}