export default class SortableTable {
  subElements = {}
  sortElements = []
  static lastArrowElement;

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
    const data = this.sortElements.length ? this.sortElements : this.data;

    return data.map((item) => (`
      <a href="/products/${item.id}" class="sortable-table__row">
        ${this.createList(item)}
      </a>
      `)).join('');
  }

  createList(element) {
    let html = '';

    this.headerConfig.forEach((el) => {
      if (el.id === 'images') {
        html += `
          <div class="sortable-table__cell">
            <img class="sortable-table-image" alt="Image" src="${el.id?.[0].url ?? 'https://via.placeholder.com/32'}">
          </div>
        `;
      } else if (el.id in element && el.id !== 'id') {
        html += `<div class="sortable-table__cell">${element[el.id]}</div>`
      }
    });

    return html;
  }

  sort(fieldValue, orderValue) {
    this.field = fieldValue;
    this.order = orderValue;

    this.createSortArrowElement();

    let sortType = this.headerConfig.find(item => item.id === fieldValue).sortType;

    if (sortType === 'string') {
      this.sortElements = this.sortStrings(fieldValue, orderValue);
      this.updateProductsList();
    }

    if (sortType === 'number') {
      this.sortElements = this.sortNumbers(fieldValue, orderValue);
      this.updateProductsList();
    }
  }

  sortStrings(field, orde) {  
    const data = [...this.data];

    if (orde == 'asc') {
      return data.sort((a, b) => a[field].localeCompare(b[field], ['ru', 'en'], {caseFirst: 'upper'}));
    } 
    
    if (orde == 'desc') {
      return data.sort((a, b) => b[field].localeCompare(a[field], ['ru', 'en'], {caseFirst: 'lower'}));
    }
  }

  sortNumbers(field, orde) {
    const data = [...this.data];

    if (orde == 'asc') {
      return data.sort((a, b) => a[field] - b[field]);
    } 
    
    if (orde == 'desc') {
      return data.sort((a, b) => b[field] - a[field]);
    }
  }

  createSortArrowElement() {
    if (SortableTable.lastArrowElement) {
      SortableTable.lastArrowElement.remove();
    }

    let arrowElement = document.createElement('div');
    arrowElement.innerHTML = '<span data-element="arrow" class="sortable-table__sort-arrow"><span class="sort-arrow"></span></span>';

    let field = this.subElements.header.children.item("this.field")
    field.append(arrowElement);

    SortableTable.lastArrowElement = arrowElement.firstElementChild;
  }

  updateProductsList() {
    this.subElements.body.innerHTML = this.createProductsList();

    Object.entries(this.subElements).forEach(([key, value]) => {
      this.element.querySelectorAll(`[data-element="${key}"]`).innerHTML = value;
    });
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}