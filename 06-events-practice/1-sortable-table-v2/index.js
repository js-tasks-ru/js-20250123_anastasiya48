import SortableTableV1 from "../../05-dom-document-loading/2-sortable-table-v1/index.js";

export default class SortableTable extends SortableTableV1 {
  isSortLocally = true
  lastTargetCellElement

  constructor(headersConfig, {
    data = [],
    sorted = {}
  } = {}) {
    
    super(headersConfig, data);

    this.sortField = sorted.id ?? 'title';
    this.sortOder = sorted.order ?? 'asc';

    this.createListeners();
    super.sort(this.sortField, this.sortOder);
    this.arrowElement = super.createSortArrowElement();
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

    this.sortField = cellElement.dataset.id;
    this.sortOder = this.sortOder === 'asc' ? 'desc' : 'asc';

    cellElement.dataset.order = this.sortOder;
    cellElement.append(this.arrowElement);

    this.lastTargetCellElement = cellElement;

    this.sort();
  }

  sort() {
    if (this.isSortLocally) {
      this.sortOnClient();
    } else {
      this.sortOnServer();
    }
  }

  sortOnClient() {
    super.sort(this.sortField, this.sortOder);
  }

  sortOnServer() {}

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