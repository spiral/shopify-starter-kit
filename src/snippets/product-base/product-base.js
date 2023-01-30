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
  parseOptionString,
  normalizeProductConfig,
  makeVariantsOptionsConfig,
  makeVariantsOptionsStringList,
  calculateProductImages,
} from '../../scripts/utils/productBaseHelpers';
import {
  CUSTOM_EVENTS,
  VARIANT_SEARCH_PARAM,
} from '../../scripts/utils/constants';

const SIZE_OPTION = 'Size';
const PRICE_OPTION = 'Value';

const COLORED_OPTIONS_LIST = ['Color', 'Design'];

const { productConfig, productDiscount, innerWidth } = window;
const MOBILE_BREAKPOINT = 768;
const IS_MOBILE_DEVICE = innerWidth < MOBILE_BREAKPOINT;

const Product = {
  data() {
    const normalizedConfig = normalizeProductConfig(productConfig);

    const urlParams = new URLSearchParams(window.location.search);
    const productVariantFirstKey = Object.keys(normalizedConfig.variants)[0];
    const urlParamsVariantId = urlParams.get(VARIANT_SEARCH_PARAM);

    const activeVariant =
      normalizedConfig?.variants[urlParamsVariantId] ||
      normalizedConfig?.variants[productVariantFirstKey];

    const customOptionsConfig =
      normalizedConfig?.metafields?.customOptionsConfig || {};

    const variantOptions = makeVariantsOptionsConfig(productConfig);

    const variantOptionsActive = normalizedConfig.options.reduce(
      (res, option, index) => ({
        ...res,
        [option]: activeVariant.options[index],
      }),
      {}
    );

    // NOTE: unnecessary to be observable as data by vue engine
    this.variantOptions = variantOptions;
    this.productConfig = normalizedConfig;
    this.optionsKeyOrder = normalizedConfig.optionsKeyOrder;
    this.variants = normalizedConfig.variants;
    this.customOptionsConfig = customOptionsConfig;
    this.productDiscount = productDiscount;

    return {
      isOpenPopup: false,
      isSlidersInMove: false,
      activeVariant,
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
    priceOriginal() {
      return this.formatPrice(this.activeVariant.price / 100);
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
      return calculateProductImages(this.productConfig.media);
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
    calcPotentialVariant(optionKey, optionValue) {
      const potentialActiveOptions = {
        ...this.variantOptionsActive,
        [optionKey]: optionValue,
      };

      const optionValues = Object.values(potentialActiveOptions);

      return (
        Object.values(this.variants).find(
          ({ options }) => !xor(options, optionValues).length
        ) || null
      );
    },
    calcOptionColor(colorValue) {
      return (
        this.productConfig?.metafields?.optionsValuesMap?.[colorValue] || '#eee'
      );
    },
    changeOption(key, value) {
      if (this.isUnavailableOption(key, value)) {
        return null;
      }

      const normalizedKey = this.normalizeKey(key);
      const potentialVariant = this.calcPotentialVariant(normalizedKey, value);

      if (potentialVariant) {
        this.variantOptionsActive[normalizedKey] = value;

        this.activeVariant = potentialVariant;

        const activeVariantUrl = getUrlWithVariant(
          window.location.href,
          potentialVariant.id
        );

        window.history.replaceState({}, '', activeVariantUrl);

        const customEvent = new CustomEvent(
          CUSTOM_EVENTS.BROWSER_HISTORY_REPLACE_STATE,
          {
            detail: { url: activeVariantUrl },
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
      const normalizedKey = this.normalizeKey(key);

      return !this.calcPotentialVariant(normalizedKey, value);
    },
    isSoldOutOption(key, value) {
      const normalizedKey = this.normalizeKey(key);
      const potentialVariant = this.calcPotentialVariant(normalizedKey, value);

      return !this.isAvailableVariant(potentialVariant);
    },
    makeOptionTitle(key, value) {
      const isDisabled = this.isUnavailableOption(key, value);

      return `${key}: ${value} ${isDisabled ? 'is not available' : ''}`;
    },
    makeOptionDisplayValue(key, value) {
      if (key !== PRICE_OPTION) {
        return value;
      }

      const optionIndex = (this.productConfig?.options || []).findIndex(
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
    makeOptionsGroupValue(key) {
      const optionKey = this.normalizeKey(key);
      const optionValue = this.variantOptionsActive[optionKey];
      const activeOptionString = makeOptionString(optionKey, optionValue);

      const isHiddenCustomTitle =
        this.isCustomOptionsGroup(key) &&
        !this.customOptionsConfig[key].includes(activeOptionString);

      const isCustomActiveOption = Object.values(this.customOptionsConfig)
        .flat()
        .includes(activeOptionString);

      const isHiddenStandardTitle =
        !this.isCustomOptionsGroup(key) && isCustomActiveOption;

      if (isHiddenCustomTitle || isHiddenStandardTitle) {
        return '';
      }

      return optionValue;
    },
    isColoredOptionsGroup(key) {
      return [
        ...COLORED_OPTIONS_LIST,
        ...Object.keys(this.customOptionsConfig),
      ].includes(key);
    },
    isSizeOptionsGroup(key) {
      const normalizedKey = this.normalizeKey(key);

      return normalizedKey === SIZE_OPTION;
    },
    isCustomOptionsGroup(key) {
      return Object.keys(this.customOptionsConfig).includes(key);
    },
    isCustomOption(key, value) {
      return Object.values(this.customOptionsConfig)
        .flat()
        .includes(makeOptionString(this.normalizeKey(key), value));
    },
    normalizeKey(key) {
      if (!this.isCustomOptionsGroup(key)) {
        return key;
      }

      const [optionKey = ''] = parseOptionString(
        this.customOptionsConfig[key]?.[0]
      );

      return optionKey;
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
        this.productConfig.options
      );

      const isForceUnavailable =
        intersection(
          variantOptionsStrings,
          this.productConfig?.forceSoldOutOptions
        ).length > 0;

      return !isForceUnavailable && variant.available;
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
                product_name: this.productConfig.title,
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
              item_name: this.productConfig.title,
              item_id: String(this.activeVariant.id),
              currency: window.Shopify.currency.active,
              price: Number(this.activeVariant.price / 100)
                .toFixed(2)
                .toLocaleString('en-US'),
              item_category: this.productConfig.type,
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
  if (!document.querySelector('[data-product-base-slider]')) {
    return {
      sliderMain: null,
      sliderPopup: null,
    };
  }
  // NOTE: used 3.6.12 version Splider because 4 version has flashlights bugs on Safari (MacBooks), but all versions (3 and 4 still have bugs with slider when we try to scroll with touchpad)
  // const sliderMain = new Splide('[data-product-base-slider]', {
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
  //     arrows: 'splide__arrows product-base__slider-arrows',
  //     arrow: 'splide__arrow product-base__slider-arrow',
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
  // const sliderPopup = new Splide('[data-product-base-popup]', {
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
  //     pagination: 'splide__pagination product-base__modal-slider-pagination',
  //     page: 'splide__pagination__page product-base__modal-slider-pagination-item',
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

export const runProductBase = () => {
  if (document.querySelector('.product-base')) {
    Vue.createApp(Product).mount('.product-base');
  }
};
