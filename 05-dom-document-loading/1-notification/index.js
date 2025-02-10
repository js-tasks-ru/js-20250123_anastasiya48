export default class NotificationMessage {
  static lastShownComponent;
  timerId;

  constructor(message = '', {duration = 0, type = ''} = {}) {
    this.message = message;
    this.duration = duration;
    this.type = type;

    this.element = this.createElement(this.createTamplate());
  }

  createElement(outerHTML, targetElement) {
    if (targetElement) {
      targetElement.innerHTML = outerHTML;
      return targetElement;
    }

    const containerElement = document.createElement('div');
    containerElement.innerHTML = outerHTML;

    return containerElement.firstElementChild;
  }

  createTamplate() {
    return `
      <div class="notification ${this.type}" style="--value: ${this.millisToSeconds(this.duration)}">
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">${this.type}</div>
          <div class="notification-body">
            ${this.message}
          </div>
        </div>
      </div>
    `;
  }

  millisToSeconds(msec) {
    const sec = (msec / 1000);

    return sec + 's';
  }

  show(targetElement) {
    this.element = this.createElement(this.createTamplate(), targetElement);

    if (NotificationMessage.lastShownComponent) {
      NotificationMessage.lastShownComponent.hide();
    }

    document.body.append(this.element);
    NotificationMessage.lastShownComponent = this;

    if (this.duration > 0) {
      this.timerId = setTimeout(() => this.remove(), this.duration);
    }
  }

  hide() {
    clearTimeout(this.timerId);
    this.element.remove();
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

}