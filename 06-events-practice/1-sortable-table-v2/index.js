import SortableTableV1 from "../../05-dom-document-loading/2-sortable-table-v1/index.js";

export default class SortableTable extends SortableTableV1 {
  isSortLocally = true

  constructor(headersConfig, {
    data = [],
    sorted = {}
  } = {}) {
    
    super(headersConfig, data);

    this.sortField = sorted.id;
    this.sortOder = sorted.order ?? 'asc';

    this.createListeners();
    super.sort(this.sortField, this.sortOder);
    this.arrowElement = super.createSortArrowElement();
  }

  handleHeaderCellClick = (e) => {
    const cellElement = e.target.closest('.sortable-table__cell');
    const sortable = cellElement.dataset.sortable;

    if (!cellElement) {
      return;
    }

    if (!sortable) {
      return;
    }

    cellElement.append(this.arrowElement);

    this.sortField = cellElement.dataset.id;
    this.sortOder = this.sortOder === 'asc' ? 'desc' : 'asc';

    this.sort(this.sortField, this.sortOder);
  }

  sort (sortField, sortOder) {
    if (this.isSortLocally) {
      super.sort(sortField, sortOder);
    } else {
      this.sortOnServer();
    }
  }

  createListeners() {
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