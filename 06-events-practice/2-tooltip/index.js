class Tooltip {
  static instance;
  isShown = false;
  element;

  constructor () {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }

    Tooltip.instance = this;
  }

  initialize () {
    this.createListeners();
  }

  render(text) {
    const tooltip = `<div class="tooltip">${text}</div>`;

    const containerElement = document.createElement('div');
    containerElement.innerHTML = tooltip;

    this.element = containerElement.firstElementChild;
    document.body.append(containerElement.firstElementChild);
  }

  handleDocumentPointerOver = (ev) => {
    const tooltip = ev.target.dataset?.tooltip;

    if (tooltip) {
      this.render(tooltip);
    }
  }

  onMouseMove = (ev) => {
    const tooltip = ev.target.dataset?.tooltip;

    if (tooltip) {
      this.setPositionTooltip(ev.clientX, ev.clientY);
    }
  }

  setPositionTooltip(x, y) {
    const tooltip = document.querySelector('[class="tooltip"]');

    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
  }

  handleDocumentPointerOut = (ev) => {
    const hasTooltip = ev.target.dataset?.tooltip;

    if (hasTooltip) {
      this.remove();
    }
  }

  createListeners() {
    document.addEventListener('pointerover', this.handleDocumentPointerOver);
    document.addEventListener('pointerout', this.handleDocumentPointerOut);
    document.addEventListener('mousemove', this.onMouseMove);
  }

  destroyListeners() {
    document.removeEventListener('pointerover', this.handleDocumentPointerOver);
    document.removeEventListener('pointerout', this.handleDocumentPointerOut);
    document.removeEventListener('mousemove', this.onMouseMove);
  }

  remove () {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.destroyListeners();
  }
}

export default Tooltip;