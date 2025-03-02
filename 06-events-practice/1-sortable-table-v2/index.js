import SortableTableV1 from "../../05-dom-document-loading/2-sortable-table-v1/index.js";

export default class SortableTableV2 extends SortableTableV1 {
  lastTargetCellElement

  constructor(headersConfig, {
    data = [],
    sorted = {},
    isSortLocally = true,
  } = {}) {
    super(headersConfig, data);

    this.isSortLocally = isSortLocally;
    this.createListeners();
    this.sort(sorted.id, sorted.order);
  }

  handleHeaderCellClick(event) {
    const cellElement = event.target.closest('.sortable-table__cell');
    const sortable = cellElement.dataset.sortable;

    if (!cellElement) {
      return;
    }

    if (!sortable) {
      return;
    }

    const field = cellElement.dataset.id;
    const order = cellElement.dataset.order === 'desc' ? 'asc' : 'desc';

    cellElement.dataset.order = order;
    cellElement.append(this.arrowElement);

    this.lastTargetCellElement = cellElement;

    this.sort(field, order);
  }

  sort(field = 'title', order = 'asc') {
    if (this.isSortLocally) {
      this.sortOnClient(field, order);
    } else {
      this.sortOnServer(field, order);
    }
  }

  sortOnClient(field, order) {
    super.sort(field, order);
  }

  sortOnServer(field, order) {}

  createListeners() {
    this.handleHeaderCellClick = this.handleHeaderCellClick.bind(this);
    
    this.subElements.header.addEventListener('pointerdown', this.handleHeaderCellClick);
  }

  destroyListeners() {
    this.subElements.header.removeEventListener('pointerdown', this.handleHeaderCellClick);
  }

  destroy() {
    super.destroy();
    this.destroyListeners();
  }
}