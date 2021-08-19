/**
 * Product Template Script
 * -----------------------------------
 * A file that contains scripts highly
 * couple code to the Product template.
 *
 * @namespace product
 */

import { getUrlWithVariant, ProductForm } from '@shopify/theme-product-form';
import { formatMoney } from '@shopify/theme-currency';
import { register } from '@shopify/theme-sections';
import { forceFocus } from '@shopify/theme-a11y';

const KEYBOARD_KEY_CODES = {
  ENTER: 13,
};

const CLASS_HIDE = 'hide';

const SUBMIT_BUTTON_SELECTOR = '[data-submit-button]';
const SUBMIT_BUTTON_TEXT_SELECTOR = '[data-submit-button-text]';
const COMPARE_PRICE_SELECTOR = '[data-compare-price]';
const COMPARE_TEXT_SELECTOR = '[data-compare-text]';
const PRICE_WRAPPER_SELECTOR = '[data-price-wrapper]';
const PRODUCT_IMAGE_WRAPPER_SELECTOR = '[data-product-image-wrapper]';
const PRODUCT_VISIBLE_IMAGE_WRAPPER_SELECTOR = `[data-product-image-wrapper]:not(.${CLASS_HIDE})`; // eslint-disable-line max-len
const PRODUCT_FORM_SELECTOR = `[data-product-form]`;
const PRODUCT_PRICE_SELECTOR = `[data-product-price]`;
const PRODUCT_THUMBNAIL_SELECTOR = `[data-product-single-thumbnail]`;
const PRODUCT_ACTIVE_THUMBNAIL_SELECTOR = `[data-product-single-thumbnail][aria-current]`; // eslint-disable-line max-len

const calcImageWrapperSelectorById = (id) =>
  `${PRODUCT_IMAGE_WRAPPER_SELECTOR}[data-image-id='${id}']`;
const calcThumbnailSelectorById = (id) => `[data-thumbnail-id='${id}']`;

register('product', {
  async onLoad() {
    const productFormElement = document.querySelector(PRODUCT_FORM_SELECTOR);

    this.product = await this.getProductJson(
      productFormElement.dataset.productHandle
    );
    this.productForm = new ProductForm(productFormElement, this.product, {
      onOptionChange: this.onFormOptionChange.bind(this),
    });

    this.onThumbnailClick = this.onThumbnailClick.bind(this);
    this.onThumbnailKeyup = this.onThumbnailKeyup.bind(this);

    this.container.addEventListener('click', this.onThumbnailClick);
    this.container.addEventListener('keyup', this.onThumbnailKeyup);
  },

  onUnload() {
    this.productForm.destroy();
    this.removeEventListener('click', this.onThumbnailClick);
    this.removeEventListener('keyup', this.onThumbnailKeyup);
  },

  getProductJson(handle) {
    return fetch(`/products/${handle}.js`).then((response) => response.json());
  },

  onFormOptionChange(event) {
    const { variant } = event.dataset;

    this.renderImages(variant);
    this.renderPrice(variant);
    this.renderComparePrice(variant);
    this.renderSubmitButton(variant);

    this.updateBrowserHistory(variant);
  },

  onThumbnailClick(event) {
    const thumbnail = event.target.closest(PRODUCT_THUMBNAIL_SELECTOR);

    if (!thumbnail) {
      return;
    }

    event.preventDefault();

    this.renderFeaturedImage(thumbnail.dataset.thumbnailId);
    this.renderActiveThumbnail(thumbnail.dataset.thumbnailId);
  },

  onThumbnailKeyup(event) {
    if (
      event.keyCode !== KEYBOARD_KEY_CODES.ENTER ||
      !event.target.closest(PRODUCT_THUMBNAIL_SELECTOR)
    ) {
      return;
    }

    const visibleFeaturedImageWrapper = this.container.querySelector(
      PRODUCT_VISIBLE_IMAGE_WRAPPER_SELECTOR
    );

    forceFocus(visibleFeaturedImageWrapper);
  },

  renderSubmitButton(variant) {
    const submitButton = this.container.querySelector(SUBMIT_BUTTON_SELECTOR);
    const submitButtonText = this.container.querySelector(
      SUBMIT_BUTTON_TEXT_SELECTOR
    );

    if (!variant) {
      submitButton.disabled = true;
      submitButtonText.innerText = window.theme.strings.unavailable;
    } else if (variant.available) {
      submitButton.disabled = false;
      submitButtonText.innerText = window.theme.strings.addToCart;
    } else {
      submitButton.disabled = true;
      submitButtonText.innerText = window.theme.strings.soldOut;
    }
  },

  renderImages(variant) {
    if (!variant || variant.featured_image === null) {
      return;
    }

    this.renderFeaturedImage(variant.featured_image.id);
    this.renderActiveThumbnail(variant.featured_image.id);
  },

  renderPrice(variant) {
    const priceElement = this.container.querySelector(PRODUCT_PRICE_SELECTOR);
    const priceWrapperElement = this.container.querySelector(
      PRICE_WRAPPER_SELECTOR
    );

    priceWrapperElement.classList.toggle(CLASS_HIDE, !variant);

    if (variant) {
      priceElement.innerText = formatMoney(
        variant.price,
        window.theme.moneyFormat
      );
    }
  },

  renderComparePrice(variant) {
    if (!variant) {
      return;
    }

    const comparePriceElement = this.container.querySelector(
      COMPARE_PRICE_SELECTOR
    );
    const compareTextElement = this.container.querySelector(
      COMPARE_TEXT_SELECTOR
    );

    if (!comparePriceElement || !compareTextElement) {
      return;
    }

    if (variant.compare_at_price > variant.price) {
      comparePriceElement.innerText = formatMoney(
        variant.compare_at_price,
        window.theme.moneyFormat
      );
      compareTextElement.classList.remove(CLASS_HIDE);
      comparePriceElement.classList.remove(CLASS_HIDE);
    } else {
      comparePriceElement.innerText = '';
      compareTextElement.classList.add(CLASS_HIDE);
      comparePriceElement.classList.add(CLASS_HIDE);
    }
  },

  renderActiveThumbnail(id) {
    const activeThumbnail = this.container.querySelector(
      calcThumbnailSelectorById(id)
    );
    const inactiveThumbnail = this.container.querySelector(
      PRODUCT_ACTIVE_THUMBNAIL_SELECTOR
    );

    if (activeThumbnail === inactiveThumbnail) {
      return;
    }

    inactiveThumbnail.removeAttribute('aria-current');
    activeThumbnail.setAttribute('aria-current', true);
  },

  renderFeaturedImage(id) {
    const activeImage = this.container.querySelector(
      PRODUCT_IMAGE_WRAPPER_SELECTOR
    );
    const inactiveImage = this.container.querySelector(
      calcImageWrapperSelectorById(id)
    );

    activeImage.classList.add(CLASS_HIDE);
    inactiveImage.classList.remove(CLASS_HIDE);
  },

  updateBrowserHistory(variant) {
    const { enableHistoryState } = this.productForm.element.dataset;

    if (!variant || enableHistoryState !== 'true') {
      return;
    }

    const url = getUrlWithVariant(window.location.href, variant.id);

    window.history.replaceState({ path: url }, '', url);
  },
});
