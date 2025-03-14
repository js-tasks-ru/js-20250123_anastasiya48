Date.prototype.dateString = function() {
  const dd = this.getDate().toString();
  const mm = (this.getMonth() + 1).toString();

  return [
    dd.length === 2 ? dd : '0' + dd,
    mm.length === 2 ? mm : '0' + mm,
    this.getFullYear()
  ].join('.');
};

export default class RangePicker {
  subElements = {}

  constructor ({from, to}) {
    this.from = from;
    this.to = to;

    this.leftMonth = this.from.getMonth() + 1; 
    this.leftYear = this.from.getFullYear();

    this.isPeriod = false;
    this.weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

    this.arrow = `       
      <div class="rangepicker__selector-arrow"></div>
      <div class="rangepicker__selector-control-left"></div>
      <div class="rangepicker__selector-control-right"></div>
    `;

    this.element = this.createInputElement();
    this.selectSubElements();
    this.createListeners();
  }

  selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(element => {
      this.subElements[element.dataset.element] = element;
    });
  }

  createInputElement() {
    const containerElement = document.createElement('div');

    containerElement.innerHTML =  
      `<div class="rangepicker">
        <div class="rangepicker__input" data-element="input">
          <span data-element="from">${this.from.dateString()}</span> -
          <span data-element="to">${this.to.dateString()}</span>
        </div>
        <div class="rangepicker__selector" data-element="selector"></div>
      </div>
    `;

    return containerElement.firstElementChild;
  }

  createCalendarElement() {
    let rightMonth = this.leftMonth + 1;
    let rightYear = this.leftYear;

    if (rightMonth > 12) {
      rightMonth = 1;
      rightYear += 1;
    }

    return `
      ${this.createCalendarPart(this.leftMonth, this.leftYear)}
      ${this.createCalendarPart(rightMonth, rightYear)}
    `;
  }

  createCalendarPart(month, year) {
    const day = new Date(year, month - 1, 1);
    const monthsName = day.toLocaleString('default', { month: 'long' });
    const weekDay = [7, 1, 2, 3, 4, 5, 6][day.getDay()]; 
    const daysCount = new Date(year, month, 0).getDate();

    const oldCalendar = this.element.querySelector(`time[datetime=${monthsName}]`);

    if (oldCalendar) {
      const oldGrid = oldCalendar.parentElement.parentElement;
      oldGrid.children.namedItem('date-grid').innerHTML = this.createCalendarButton(daysCount, month, year, weekDay);
      return oldGrid.outerHTML;
    }

    return `        
      <div class="rangepicker__calendar">
        <div class="rangepicker__month-indicator">
          <time datetime="${monthsName}">${monthsName}</time>          
        </div>
        <div class="rangepicker__day-of-week">
          ${this.createCalendarWeek()}
        </div>
        <div class="rangepicker__date-grid" name="date-grid">
          ${this.createCalendarButton(daysCount, month, year, weekDay)}
        </div>
      </div>
    `;
  }

  createCalendarButton(daysCount, month, year, weekDay) {
    const result = [];

    for (let i = 1; i <= daysCount; i += 1) {
      let specialClass = '';
      let firstDayStyle = '';
      
      const currentDay = new Date(year, month - 1, i);
      const current = currentDay.getTime();
      const startPeriod = this.from.getTime();
      const endPeriod = this.to.getTime();

      if (i === 1) {
        firstDayStyle = `style="--start-from: ${weekDay}"`;
      }

      if (startPeriod < current && current < endPeriod) {
        specialClass = ' rangepicker__selected-between';
      }

      if (startPeriod === current) {
        specialClass = ' rangepicker__selected-from';
      }

      if (endPeriod === current) {
        specialClass = ' rangepicker__selected-to';
      }

      result.push(`<button type="button" class="rangepicker__cell${specialClass}" ${firstDayStyle} data-value="${currentDay}">${i}</button>`);
    }

    return result.join('');
  }

  createCalendarWeek() {
    return this.weekDays.map((day) => `<div>${day}</div>`).join('');
  }

  onInputElementClick() {
    this.element.classList.toggle('rangepicker_open');
  }

  updateElement() {
    const event = new Event('date-select');
    this.element.dispatchEvent(event);

    this.subElements.from.innerHTML = this.from.dateString();
    this.subElements.to.innerHTML = this.to.dateString();

    if (this.subElements.selector.lastElementChild) {
      this.subElements.selector.lastElementChild.remove();
      this.subElements.selector.lastElementChild.remove();
    }
    this.subElements.selector.innerHTML += this.createCalendarElement();
  }

  changePeriod(clickDay) {
    if (!this.isPeriod) {
      const setPeriodDays = this.element.querySelectorAll('.rangepicker__selected-between, .rangepicker__selected-from, .rangepicker__selected-to');
      setPeriodDays.forEach((day) => day.classList.remove('rangepicker__selected-between', 'rangepicker__selected-from', 'rangepicker__selected-to'));

      clickDay.classList.add('rangepicker__selected-from');

      this.from = new Date(clickDay.dataset.value);
      this.to = this.from;

      this.isPeriod = true;
    } else {
      clickDay.classList.add('rangepicker__selected-to');
      
      if (this.from > new Date(clickDay.dataset.value)) {
        this.to = this.from;
        this.from = new Date(clickDay.dataset.value);
      } else {
        this.to = new Date(clickDay.dataset.value);
      }

      this.isPeriod = false;
      this.updateElement();
    }
  }

  onClick(event) {
    if (event.target.classList[0] === 'rangepicker__cell') {
      this.changePeriod(event.target);
    } 

    else if (event.target.classList[0] === 'rangepicker__selector-control-left') {
      this.leftMonth = this.leftMonth - 1;

      if (this.leftMonth === 0) {
        this.leftMonth = 12;
        this.leftYear = this.leftYear - 1;
      }

      if (this.subElements.selector.lastElementChild) {
        this.subElements.selector.lastElementChild.remove();
        this.subElements.selector.lastElementChild.remove();
      }
      this.subElements.selector.innerHTML += this.createCalendarElement();
    } 

    else if (event.target.classList[0] === 'rangepicker__selector-control-right') {
      this.leftMonth = this.leftMonth + 1; 

      if (this.leftMonth > 12) {
        this.leftMonth = 1;
        this.leftYear = this.leftYear + 1;
      }

      if (this.subElements.selector.lastElementChild) {
        this.subElements.selector.lastElementChild.remove();
        this.subElements.selector.lastElementChild.remove();
      }
      this.subElements.selector.innerHTML += this.createCalendarElement();
    } 

    else if (event.target.classList[0] === 'rangepicker__input') {
      this.onInputElementClick();
    } 

    else {
      this.onInputElementClick();
    }

  }

  createListeners() {
    const inputElement = this.element.querySelector('.rangepicker__input');

    this.onInputElementClick = this.onInputElementClick.bind(this);
    this.onClick = this.onClick.bind(this);
    
    inputElement.addEventListener('click', () => {
      this.subElements.selector.innerHTML = this.arrow + this.createCalendarElement();
    }, { once: true });

    window.addEventListener('click', this.onClick);
  }

  destroyListeners() {
    window.removeEventListener('click', this.onClick);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}