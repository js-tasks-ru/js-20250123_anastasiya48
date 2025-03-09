import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';
const BACKEND_URL_IMG = 'https://api.imgur.com/3/image';

export default class ProductForm {
  static categories = [];
  static products = [];
  subElements = {}
  element;

  constructor (productId = null) {
    this.productId = productId;

    this.url = '/api/rest/';
    this.image = 'image';
    this.categories = 'categories';
    this.products = 'products';
  }

  selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(element => {
      this.subElements[element.dataset.element] = element;
    });
  }

  async render () {
    await this.getInformationFromServer();

    this.element = this.createElement(this.createTemplate());

    if (this.productId) {
      this.addInfoAboutProductFromServer();
    }

    this.createListeners();
    this.selectSubElements();

    return this.element;
  }

  async getInformationFromServer() {
    try {
      const categoriesUrl = this.createGetUrl(this.categories);
      ProductForm.categories = await fetchJson(categoriesUrl);

      if (this.productId) {
        const productUrl = this.createGetUrl(this.products);
        ProductForm.products = await fetchJson(productUrl);
      }

    } catch (err) {
      console.log(err);
    }
  }

  createGetUrl(object) {
    const path = this.url + object;
    const url = new URL(path, BACKEND_URL);

    if (object === this.categories) {
      url.searchParams.append('_sort', 'weight');
      url.searchParams.append('_refs', 'subcategory');
    }

    if (object === this.products) {
      url.searchParams.append('id', this.productId);
    }

    return url.toString();
  }

  createElement(template) {
    const containerElement = document.createElement('div');
    containerElement.innerHTML = template;

    return containerElement.firstElementChild;
  }

  createTemplate() {
    return `
      <div class="product-form">
          <form data-element="productForm" class="form-grid">
            <div class="form-group form-group__half_left">
              <fieldset>
                <label class="form-label">Название товара</label>
                <input required="" type="text" name="title" class="form-control" id="title" placeholder="Название товара">
              </fieldset>
            </div>
            <div class="form-group form-group__wide">
              <label class="form-label">Описание</label>
              <textarea required="" class="form-control" id="description" name="description" data-element="productDescription" placeholder="Описание товара"></textarea>
            </div>
            <div class="form-group form-group__wide" data-element="sortable-list-container">
              <label class="form-label">Фото</label>
              <div data-element="imageListContainer">
                <ul class="sortable-list">
                  ${this.createImageElement()}
                </ul>
              </div>
              <button type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
            </div>    
            <div class="form-group form-group__half_left">
              <label class="form-label">Категория</label>
              <select class="form-control" name="subcategory" id="subcategory">
                ${this.createSubcategoryList()}
              </select>
            </div>
            <div class="form-group form-group__half_left form-group__two-col">
              <fieldset>
                <label class="form-label">Цена ($)</label>
                <input required="" type="number" name="price" class="form-control" id="price" placeholder="100">
              </fieldset>
              <fieldset>
                <label class="form-label">Скидка ($)</label>
                <input required="" type="number" name="discount" class="form-control" id="discount" placeholder="0">
              </fieldset>
            </div>
            <div class="form-group form-group__part-half">
              <label class="form-label">Количество</label>
              <input required="" type="number" class="form-control" name="quantity" id="quantity" placeholder="1">
            </div>
            <div class="form-group form-group__part-half">
              <label class="form-label">Статус</label>
              <select class="form-control" name="status" id="status">
                <option value="1">Активен</option>
                <option value="0">Неактивен</option>
              </select>
            </div>
            <div class="form-buttons">
              <button type="submit" name="save" class="button-primary-outline">
                Сохранить товар
              </button>
            </div>
          </form>
        </div>
    `;
  }

  createImageElement() {
    const element = [];

    if (this.productId) {
      const images = ProductForm.products[0].images;

      images.forEach((imag) => {
        element.push(
          `<li class="products-edit__imagelist-item sortable-list__item" style="">
            <input type="hidden" name="url" value="${escapeHtml(imag.url)}">
            <input type="hidden" name="source" value="${escapeHtml(imag.source)}">
            <span>
              <img src="icon-grab.svg" data-grab-handle="" alt="grab">
              <img class="sortable-table__cell-img" alt="Image" src="${escapeHtml(imag.url)}">
              <span>${escapeHtml(imag.source)}</span>
            </span>
            <button type="button">
              <img src="icon-trash.svg" data-delete-handle="" alt="delete">
            </button>
          </li>`
        );
      });
    }
    
    return element.join('');
  }

  createSubcategoryList() {
    const element = [];

    for (let i = 0; i < ProductForm.categories.length; i += 1) {
      const category = ProductForm.categories[i];
      category.subcategories.forEach((subcategory) => {
        element.push(`<option value="${subcategory.id}">${escapeHtml(category.title)} &gt; ${escapeHtml(subcategory.title)}</option>`);
      });
    }

    return element.join('');
  }

  addInfoAboutProductFromServer() {
    const product = ProductForm.products[0];

    const defaultFormData = {
      title: '',
      description: '',
      quantity: 0,
      subcategory: '',
      status: 0,
      price: 0,
      discount: 0
    };

    const fields = Object.keys(defaultFormData);

    for (const field of fields) {
      // 3 тест не проходит c escapeHtml()
      // this.element.querySelector(`#${field}`).value = escapeHtml(product[field].toString());
      this.element.querySelector(`#${field}`).value = product[field];
    }
  }

  // async save() {

  // }

  // onSaveBtnClick() {
  //   console.log('click');
  // }

  async upload(file) {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const url = new URL(BACKEND_URL_IMG);

      // ошибка CORS 
      const response = await fetchJson(url, {
        method: 'POST',
        headers: {
          'Authentication': `Client-ID ${IMGUR_CLIENT_ID}`
        },
        body: formData,
      });

      const result = await response.json();
      console.log("Успех:", JSON.stringify(result));

      elem.dispatchEvent("product-saved");

    } catch (error) {
      console.log("Ошибка:", error);
    }
  }

  onUploadBtnClick() {
    const inputElement = document.createElement('input');
    inputElement.type = "file";
    inputElement.accept = "image/*";
    inputElement.style = "display:none";

    document.body.append(inputElement);

    inputElement.addEventListener("change", () => {
      this.upload(inputElement.files[0]);
    }, { once: true });

    inputElement.click();

    console.log('click');
  }

  createListeners() {
    const uploadBtn = this.element.querySelector('button[name="uploadImage"]');
    const saveBtn = this.element.querySelector('button[name="save"]');

    this.onUploadBtnClick = this.onUploadBtnClick.bind(this);

    uploadBtn.addEventListener('click', this.onUploadBtnClick);
    saveBtn.addEventListener('click', this.onSaveBtnClick);
  }

  destroyListeners() {
    uploadBtn.removeEventListener('click', this.onUploadBtnClick);
    saveBtn.removeEventListener('click', this.onSaveBtnClick);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
