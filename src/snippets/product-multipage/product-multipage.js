import { getUrlWithVariant } from '@shopify/theme-product-form';
import xor from 'lodash/xor';
// import Splide from '@splidejs/splide';
import intersection from 'lodash/intersection';
import * as Vue from '../../scripts/vendor/vue.esm-browser.prod';
import { GoogleAnalytics } from '../../scripts/analytics/index';
import {
  unlockPageScroll,
  lockPageScroll,
} from '../../scripts/utils/pageScroll';
import {
  makeOptionString,
  makeVariantsOptionsStringList,
  calculateProductImages,
} from '../../scripts/utils/productBaseHelpers';
import {
  CUSTOM_EVENTS,
  VARIANT_SEARCH_PARAM,
} from '../../scripts/utils/constants';

const PRODUCT_REFERENCE_KEY = 'productRef';
const SIZE_OPTION = 'Size';
const COLOR_OPTION = 'Color';
const PRICE_OPTION = 'Value';

const { relatedProductsConfig, innerWidth } = window;
const MOBILE_BREAKPOINT = 768;
const IS_MOBILE_DEVICE = innerWidth < MOBILE_BREAKPOINT;

const Product = {
  data() {
    const { title, products, activeProductId, productsMeta } =
      relatedProductsConfig;

    const availableVariants = Object.values(products).reduce((acc, product) => {
      (product.variants || []).forEach((variant) => {
        acc[variant.id] = variant;

        acc[variant.id][PRODUCT_REFERENCE_KEY] = new Proxy(product, {});
      });

      return acc;
    }, {});

    const urlParams = new URLSearchParams(window.location.search);
    const urlParamsVariantId = urlParams.get(VARIANT_SEARCH_PARAM);
    const productVariantFirstKey =
      products[activeProductId].variants[0].id ||
      Object.keys(availableVariants)[0];

    const activeVariant =
      availableVariants[urlParamsVariantId] ||
      availableVariants[productVariantFirstKey];

    const variantOptionsActive = activeVariant[
      PRODUCT_REFERENCE_KEY
    ].options.reduce(
      (res, option, index) => ({
        ...res,
        [option]: activeVariant.options[index],
      }),
      {}
    );

    // TODO:
    const seasonalProductsIds = Object.entries(productsMeta)
      .map(([id, meta]) => (meta.isSeasonal ? id : null))
      .filter(Boolean);

    const variantOptions = makeMultiVariantsOptionsConfig(availableVariants);

    // NOTE: unnecessary to be observable as data by vue engine
    this.variantOptions = variantOptions;
    this.variants = availableVariants;
    this.optionsKeyOrder = Object.keys(variantOptions);
    this.pageTitle = title;
    this.productsMeta = productsMeta;
    this.seasonalProductsIds = seasonalProductsIds;

    return {
      isOpenPopup: false,
      isSlidersInMove: false,
      activeVariantId: activeVariant.id,
      variantOptionsActive,
    };
  },
  mounted() {
    this.callAnalyticsEvent(GoogleAnalytics.EVENTS.VIEW_ITEM);

    const { sliderMain, sliderPopup } = initSliders();

    this.imagesSlider = sliderMain;

    if (this.imagesSlider) {
      sliderMain.on('moved', () => {
        this.isSlidersInMove = false;
      });

      sliderMain.on('move', () => {
        this.isSlidersInMove = true;
      });
    }

    this.popupSlider = sliderPopup;
  },
  computed: {
    activeVariant() {
      return this.variants[this.activeVariantId];
    },
    activeProduct() {
      return this.activeVariant[PRODUCT_REFERENCE_KEY];
    },
    priceOriginal() {
      return this.formatPrice(this.activeVariant.price / 100);
    },
    productDiscount() {
      return this.productsMeta[this.activeProduct.id]?.productDiscount;
    },
    priceDiscount() {
      const discountPrice = this.productDiscount.value
        ? this.activeVariant.price / 100 - this.productDiscount.value
        : 0;

      return discountPrice ? this.formatPrice(discountPrice) : 0;
    },
    textDiscount() {
      if (
        this.productDiscount.value &&
        this.productDiscount.percentage &&
        this.productDiscount.endDate
      ) {
        return `Save ${this.formatPrice(this.productDiscount.value)} (${
          this.productDiscount.percentage
        }%) through ${this.productDiscount.endDate}, while supplies last.`;
      }

      return '';
    },
    productImages() {
      return calculateProductImages(this.activeProduct.media);
    },
    variantImages() {
      const productFilter = (image) => String(image.alt).includes('PRODUCT');

      const mobileImages =
        this.productImages.mediaMobile.length > 0
          ? this.productImages.mediaMobile
          : this.productImages.mediaDesktop;

      const productImage = IS_MOBILE_DEVICE
        ? mobileImages
        : this.productImages.mediaDesktop;

      return [
        ...productImage.filter(this.isActiveVariantImage),
        ...productImage.filter(productFilter),
      ];
    },
    variantPopupImages() {
      return IS_MOBILE_DEVICE
        ? this.productImages.mediaMobilePopup.filter(this.isActiveVariantImage)
        : this.productImages.mediaDesktopPopup.filter(
            this.isActiveVariantImage
          );
    },
    variantPopupNormalizedImages() {
      // NOTE: need to fix popup slider on switch between variant with zoom and variant without
      return this.variantPopupImages.length > 0
        ? this.variantPopupImages
        : this.variantImages;
    },
    hasPopupImages() {
      return this.variantPopupImages.length > 0;
    },
  },
  methods: {
    formatPrice(priceValue) {
      const visiblePrice = String(priceValue).includes('.')
        ? priceValue.toFixed(2)
        : priceValue;

      return `$${visiblePrice.toLocaleString('en-US')}`;
    },
    isActiveVariantImage(image) {
      const activeOptionStringsList = Object.entries(
        this.variantOptionsActive
      ).map(([key, value]) => makeOptionString(key, value));

      return activeOptionStringsList.reduce((res, optionString) => {
        const lowerImageAlt = String(image.alt).toLowerCase();
        const lowerOptionString = String(optionString).toLowerCase();

        if (lowerImageAlt.includes(lowerOptionString)) {
          res.push(image);
        }

        return res;
      }, []).length;
    },
    formSubmit(e) {
      e.preventDefault();

      this.callAnalyticsEvent(GoogleAnalytics.EVENTS.ADD_TO_CARD);

      const { ShopifyAPI, ajaxCart } = window; // NOTE: Keep the order

      ShopifyAPI.addItemFromForm(e.target, () => {
        ajaxCart.load();
        ajaxCart.open();
      });
    },
    togglePopup(forceState) {
      if (this.isSlidersInMove) {
        return;
      }

      this.isOpenPopup = forceState ?? !this.isOpenPopup;

      if (this.isOpenPopup === false || forceState === false) {
        unlockPageScroll();

        if (this.imagesSlider) {
          this.imagesSlider.refresh();
        }
      } else {
        lockPageScroll();

        this.popupSlider.refresh();
      }
    },
    makeOptionsGroupValue(key, isSeasonalBlock = false) {
      if (
        key === COLOR_OPTION &&
        this.productsMeta[this.activeProduct.id].isSeasonal !== isSeasonalBlock
      ) {
        return '';
      }

      return this.variantOptionsActive[key];
    },
    calcPotentialVariant(key, value) {
      const potentialActiveOptions = {
        ...this.variantOptionsActive,
        [key]: value,
      };

      const optionValues = Object.values(potentialActiveOptions);

      return (
        Object.values(this.variants).find(
          ({ options }) => !xor(options, optionValues).length
        ) || null
      );
    },
    calcOptionColor(key, value) {
      const potentialProductId =
        this.calcPotentialVariant(key, value)?.[PRODUCT_REFERENCE_KEY].id ||
        null;

      return this.productsMeta?.[potentialProductId]?.color || '#eee';
    },
    isSeasonalColor(key, value) {
      const potentialVariant = this.calcPotentialVariant(key, value);

      return potentialVariant?.[PRODUCT_REFERENCE_KEY]?.isSeasonal;
    },
    changeOption(key, value) {
      if (this.isUnavailableOption(key, value)) {
        return null;
      }

      const potentialVariant = this.calcPotentialVariant(key, value);

      if (potentialVariant) {
        this.variantOptionsActive[key] = value;

        this.activeVariantId = potentialVariant.id;

        const currentVariantUrl = this.activeProduct.handle;
        const newVariantUrl = potentialVariant[PRODUCT_REFERENCE_KEY].handle;

        const resultUrl = getUrlWithVariant(
          String(window.location.href).replace(
            currentVariantUrl,
            newVariantUrl
          ),
          potentialVariant.id
        );

        window.history.replaceState({}, '', resultUrl);

        const customEvent = new CustomEvent(
          CUSTOM_EVENTS.BROWSER_HISTORY_REPLACE_STATE,
          {
            detail: { url: resultUrl },
          }
        );

        window.document.dispatchEvent(customEvent);
      } else {
        console.error('newVariant is not defined');
      }

      this.callAnalyticsEvent(GoogleAnalytics.EVENTS.VIEW_ITEM);

      const isUpdateSliderImage = !this.isSizeOptionsGroup(key);

      if (this.imagesSlider) {
        Vue.nextTick(() => {
          this.imagesSlider.refresh();

          if (isUpdateSliderImage) {
            this.imagesSlider.go(0);
          }
        });
      }

      return null;
    },
    isUnavailableOption(key, value) {
      return !this.calcPotentialVariant(key, value);
    },
    isSoldOutOption(key, value) {
      const potentialVariant = this.calcPotentialVariant(key, value);

      return !this.isAvailableVariant(potentialVariant);
    },
    isActiveOption(key, value) {
      return value === this.variantOptionsActive[key];
    },
    makeOptionTitle(key, value) {
      const isDisabled = this.isUnavailableOption(key, value);

      return `${key}: ${value} ${isDisabled ? 'is not available' : ''}`;
    },
    makeOptionDisplayValue(key, value) {
      if (key !== PRICE_OPTION) {
        return value;
      }

      const optionIndex = (this.activeProduct?.options || []).findIndex(
        (option) => option === key
      );

      const firstAvailableVariant = Object.values(this.variants).find(
        (variant) => (variant.options || [])[optionIndex] === value
      );

      const priceValue = firstAvailableVariant?.price
        ? firstAvailableVariant?.price / 100
        : value;

      return this.formatPrice(priceValue);
    },
    isColoredOptionsGroup(key) {
      return key === COLOR_OPTION;
    },
    isSizeOptionsGroup(key) {
      return key === SIZE_OPTION;
    },
    isRegularOptionsGroup(key) {
      return !this.isColoredOptionsGroup(key) && !this.isSizeOptionsGroup(key);
    },
    isVisibleSizeGuide(index) {
      return index === 0 && this.optionsKeyOrder.includes(SIZE_OPTION);
    },
    isAvailableVariant(variant) {
      if (!variant) {
        return true;
      }

      const variantOptionsStrings = makeVariantsOptionsStringList(
        variant.options,
        this.activeProduct.options
      );

      const isForceUnavailable =
        intersection(
          variantOptionsStrings,
          this.activeProduct?.forceSoldOutOptions
        ).length > 0;

      return !isForceUnavailable && variant.available;
    },
    isAvailableCurrentVariant() {
      return this.isAvailableVariant(this.activeVariant);
    },
    subscribeNotifyMeEvent() {
      const notifyMeFrame = document.querySelector('#klaviyo-bis-iframe');

      if (notifyMeFrame) {
        notifyMeFrame.onload = () => {
          const notifyMeForm =
            notifyMeFrame?.contentWindow?.document?.querySelector('form');

          const selectVariant = notifyMeForm.querySelector('select');

          let selectedVariant =
            selectVariant.options[selectVariant.selectedIndex].text;

          selectVariant.addEventListener('change', (e) => {
            selectedVariant = e.target[e.target.selectedIndex].text;
          });

          notifyMeForm.addEventListener('submit', () => {
            const emailValue =
              notifyMeForm.querySelector('[type="email"]').value;

            if (selectedVariant && emailValue !== '') {
              GoogleAnalytics.trackEvent(GoogleAnalytics.EVENTS.NOTIFY_ME, {
                product_name: this.activeProduct.title,
                variant: selectedVariant,
              });
            }
          });
        };
      }
    },

    callAnalyticsEvent(eventName) {
      const eventOptions = {
        ecommerce: {
          items: [
            {
              item_name: this.activeProduct.title,
              item_id: String(this.activeVariantId),
              currency: window.Shopify.currency.active,
              price: Number(this.activeVariant.price / 100)
                .toFixed(2)
                .toLocaleString('en-US'),
              item_category: this.activeProduct.type,
              quantity: '1',
              item_variant: this.activeVariant.public_title,
            },
          ],
        },
      };

      GoogleAnalytics.trackEvent(eventName, eventOptions);
    },
  },
};

function initSliders() {
  if (!document.querySelector('[data-product-multipage-slider]')) {
    return {
      sliderMain: null,
      sliderPopup: null,
    };
  }
  // NOTE: used 3.6.12 version Splider because 4 version has flashlights bugs on Safari (MacBooks), but all versions (3 and 4 still have bugs with slider when we try to scroll with touchpad)
  // const sliderMain = new Splide('[data-product-multipage-slider]', {
  //   type: 'loop',
  //   updateOnMove: true,
  //   arrows: true,
  //   autoHeight: true,
  //   gap: 0.3, // NOTE: fix for 1px visible area of the next slide
  //   breakpoints: {
  //     768: {
  //       // MOBILE_BREAKPOINT
  //       arrows: false,
  //       pagination: true,
  //       gap: false,
  //     },
  //   },
  //   classes: {
  //     arrows: 'splide__arrows product-multipage__slider-arrows',
  //     arrow: 'splide__arrow product-multipage__slider-arrow',
  //   },
  //   arrowPath:
  //     'm20 40-2.642-2.641 15.491-15.491H0v-3.736h32.849L17.358 2.642 20 0l20 20z',
  //   pagination: false,
  //   wheelSleep: 600,
  //   perMove: 1,
  //   speed: 600,
  //   wheel: true,
  //   easing: 'linear',
  //   easingFunc: 0.25,
  //   drag: true,
  //   dragMinThreshold: 50,
  // });
  //
  // const sliderPopup = new Splide('[data-product-multipage-popup]', {
  //   type: 'loop',
  //   updateOnMove: true,
  //   arrows: false,
  //   breakpoints: {
  //     768: {
  //       // MOBILE_BREAKPOINT
  //       direction: 'ltr',
  //       height: '100vh',
  //       gap: 5,
  //       speed: 600,
  //       pagination: true,
  //       type: 'loop',
  //     },
  //   },
  //   classes: {
  //     pagination:
  //       'splide__pagination product-multipage__modal-slider-pagination',
  //     page: 'splide__pagination__page product-multipage__modal-slider-pagination-item',
  //   },
  //   direction: 'ttb',
  //   gap: 8,
  //   height: '80vh',
  //   pagination: true,
  //   perMove: 1,
  //   wheel: true,
  //   wheelSleep: 600,
  //   speed: 600,
  //   easing: 'linear',
  //   easingFunc: 0.25,
  //   drag: true,
  //   dragMinThreshold: 10,
  // });

  const makeSlideCountByIndex = (index) =>
    index < 10 ? `0${index + 1}` : `${index + 1}`;

  // sliderPopup.on('pagination:mounted', (data) => {
  //   data.items.forEach((item, index) => {
  //     // eslint-disable-next-line no-param-reassign
  //     item.button.textContent = makeSlideCountByIndex(index);
  //   });
  // });
  //
  // sliderMain.sync(sliderPopup);
  // sliderMain.mount();
  // sliderPopup.mount();

  return {
    sliderMain: null,
    sliderPopup: null,
  };
}

function makeMultiVariantsOptionsConfig(multiVariants) {
  const filteredVariantOption = {};

  Object.values(multiVariants).forEach((variant) => {
    (variant?.options || []).forEach((value, index) => {
      const key = variant[PRODUCT_REFERENCE_KEY].options[index];

      if (!filteredVariantOption[key]) {
        filteredVariantOption[key] = [value];
      } else if (!filteredVariantOption[key].includes(value)) {
        filteredVariantOption[key].push(value);
      }
    });
  });

  return filteredVariantOption;
}

export const runProductMultipage = () => {
  if (document.querySelector('.product-multipage')) {
    Vue.createApp(Product).mount('.product-multipage');
  }
};
