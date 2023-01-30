/* eslint-disable */

window.slate = window.slate || {};
window.theme = window.theme || {};

/*= =============== Slate ================ */
/**
 * A11y Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help make your theme more accessible
 * to users with visual impairments.
 *
 *
 * @namespace a11y
 */

slate.a11y = {
  /**
   * For use when focus shifts to a container rather than a link
   * eg for In-page links, after scroll, focus shifts to content area so that
   * next `tab` is where user expects if focusing a link, just $link.focus();
   *
   * @param {JQuery} $element - The element to be acted upon
   */
  pageLinkFocus($element) {
    const focusClass = 'js-focus-hidden';

    $element.first()
      .attr('tabIndex', '-1')
      .focus()
      .addClass(focusClass)
      .one('blur', callback);

    function callback() {
      $element.first()
        .removeClass(focusClass)
        .removeAttr('tabindex');
    }
  },
};

/**
 * Cart Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Cart template.
 *
 * @namespace cart
 */

slate.cart = {
  
  /**
   * Browser cookies are required to use the cart. This function checks if
   * cookies are enabled in the browser.
   */
  cookiesEnabled() {
    let {cookieEnabled} = navigator;

    if (!cookieEnabled){
      document.cookie = 'testcookie';
      cookieEnabled = (document.cookie.indexOf('testcookie') !== -1);
    }
    return cookieEnabled;
  }
};

/**
 * Utility helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions for dealing with arrays and objects
 *
 * @namespace utils
 */

slate.utils = {

  /**
   * Return an object from an array of objects that matches the provided key and value
   *
   * @param {array} array - Array of objects
   * @param {string} key - Key to match the value against
   * @param {string} value - Value to get match of
   */
  findInstance(array, key, value) {
    for (let i = 0; i < array.length; i++) {
      if (array[i][key] === value) {
        return array[i];
      }
    }
  },

  /**
   * Remove an object from an array of objects by matching the provided key and value
   *
   * @param {array} array - Array of objects
   * @param {string} key - Key to match the value against
   * @param {string} value - Value to get match of
   */
  removeInstance(array, key, value) {
    let i = array.length;

    while(i--) {
      if (array[i][key] === value) {
        array.splice(i, 1);
        break;
      }
    }

    return array;
  },

  /**
   * _.compact from lodash
   * Remove empty/false items from array
   * Source: https://github.com/lodash/lodash/blob/master/compact.js
   *
   * @param {array} array
   */
  compact(array) {
    let index = -1;
    const length = array == null ? 0 : array.length;
    let resIndex = 0;
    const result = [];

    while (++index < length) {
      const value = array[index];

      if (value) {
        result[resIndex++] = value;
      }
    }
    return result;
  },

  /**
   * _.defaultTo from lodash
   * Checks `value` to determine whether a default value should be returned in
   * its place. The `defaultValue` is returned if `value` is `NaN`, `null`,
   * or `undefined`.
   * Source: https://github.com/lodash/lodash/blob/master/defaultTo.js
   *
   * @param {*} value - Value to check
   * @param {*} defaultValue - Default value
   * @returns {*} - Returns the resolved value
   */
  defaultTo(value, defaultValue) {
    return (value == null || value !== value) ? defaultValue : value
  }
};

/**
 * Rich Text Editor
 * -----------------------------------------------------------------------------
 * Wrap iframes and tables in div tags to force responsive/scrollable layout.
 *
 * @namespace rte
 */

slate.rte = {
  /**
   * Wrap tables in a container div to make them scrollable when needed
   *
   * @param {object} options - Options to be used
   * @param {jquery} options.$tables - jquery object(s) of the table(s) to wrap
   * @param {string} options.tableWrapperClass - table wrapper class name
   */
  wrapTable(options) {
    const tableWrapperClass = typeof options.tableWrapperClass === "undefined" ? '' : options.tableWrapperClass;

    options.$tables.wrap(`<div class="${  tableWrapperClass  }"></div>`);
  },

  /**
   * Wrap iframes in a container div to make them responsive
   *
   * @param {object} options - Options to be used
   * @param {jquery} options.$iframes - jquery object(s) of the iframe(s) to wrap
   * @param {string} options.iframeWrapperClass - class name used on the wrapping div
   */
  wrapIframe(options) {
    const iframeWrapperClass = typeof options.iframeWrapperClass === "undefined" ? '' : options.iframeWrapperClass;

    options.$iframes.each(function() {
      // Add wrapper to make video responsive
      $(this).wrap(`<div class="${  iframeWrapperClass  }"></div>`);
      
      // Re-set the src attribute on each iframe after page load
      // for Chrome's "incorrect iFrame content on 'back'" bug.
      // https://code.google.com/p/chromium/issues/detail?id=395791
      // Need to specifically target video and admin bar
      this.src = this.src;
    });
  }
};

slate.Sections = function Sections() {
  this.constructors = {};
  this.instances = [];

  $(document)
    .on('shopify:section:load', this._onSectionLoad.bind(this))
    .on('shopify:section:unload', this._onSectionUnload.bind(this))
    .on('shopify:section:select', this._onSelect.bind(this))
    .on('shopify:section:deselect', this._onDeselect.bind(this))
    .on('shopify:section:reorder', this._onReorder.bind(this))
    .on('shopify:block:select', this._onBlockSelect.bind(this))
    .on('shopify:block:deselect', this._onBlockDeselect.bind(this));
};

slate.Sections.prototype = $.extend({}, slate.Sections.prototype, {
  _createInstance(container, constructor) {
    const $container = $(container);
    const id = $container.attr('data-section-id');
    const type = $container.attr('data-section-type');

    constructor = constructor || this.constructors[type];

    if (typeof constructor === 'undefined') {
      return;
    }

    const instance = $.extend(new constructor(container), {
      id,
      type,
      container
    });

    this.instances.push(instance);
  },

  _onSectionLoad(evt) {
    const container = $('[data-section-id]', evt.target)[0];

    if (container) {
      this._createInstance(container);
    }
  },

  _onSectionUnload(evt) {
    const instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (!instance) {
      return;
    }

    if (typeof instance.onUnload === 'function') {
      instance.onUnload(evt);
    }

    this.instances = slate.utils.removeInstance(this.instances, 'id', evt.detail.sectionId);
  },

  _onSelect(evt) {
    const instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onSelect === 'function') {
      instance.onSelect(evt);
    }
  },

  _onDeselect(evt) {
    const instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onDeselect === 'function') {
      instance.onDeselect(evt);
    }
  },

  _onReorder(evt) {
    const instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onReorder === 'function') {
      instance.onReorder(evt);
    }
  },

  _onBlockSelect(evt) {
    const instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onBlockSelect === 'function') {
      instance.onBlockSelect(evt);
    }
  },

  _onBlockDeselect(evt) {
    const instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onBlockDeselect === 'function') {
      instance.onBlockDeselect(evt);
    }
  },

  register(type, constructor) {
    this.constructors[type] = constructor;

    $(`[data-section-type=${  type  }]`).each((index, container) => {
      this._createInstance(container, constructor);
    });
  }
});

/**
 * Currency Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help with currency formatting
 *
 * Current contents
 * - formatMoney - Takes an amount in cents and returns it as a formatted dollar value.
 *
 */

slate.Currency = (function() {
  const moneyFormat = window.theme.moneyFormat || '${{amount}}';

  /**
   * Format money values based on your shop currency settings
   * @param  {Number|string} cents - value in cents or dollar amount e.g. 300 cents
   * or 3.00 dollars
   * @param  {String} format - shop money_format setting
   * @return {String} value - formatted value
   */
  function formatMoney(cents, format) {
    if (typeof cents === 'string') {
      cents = cents.replace('.', '');
    }
    let value = '';
    const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    const formatString = (format || moneyFormat);

    function formatWithDelimiters(number, precision, thousands, decimal) {
      precision = slate.utils.defaultTo(precision, 2);
      thousands = slate.utils.defaultTo(thousands, ',');
      decimal = slate.utils.defaultTo(decimal, '.');

      if (isNaN(number) || number == null) {
        return 0;
      }

      number = (number / 100.0).toFixed(precision);

      const parts = number.split('.');
      const dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, `$1${  thousands}`);
      const centsAmount = parts[1] ? (decimal + parts[1]) : '';

      return dollarsAmount + centsAmount;
    }

    switch (formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_space_separator':
        value = formatWithDelimiters(cents, 2, ' ', '.');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, ',', '.');
        break;
      case 'amount_no_decimals_with_space_separator':
        value = formatWithDelimiters(cents, 0, ' ');
        break;
    }

    return formatString.replace(placeholderRegex, value);
  }

  return {
    formatMoney
  };
})();

/**
 * Image Helper Functions
 * -----------------------------------------------------------------------------
 * A collection of functions that help with basic image operations.
 *
 */

slate.Image = (function() {

  /**
   * Preloads an image in memory and uses the browsers cache to store it until needed.
   *
   * @param {Array} images - A list of image urls
   * @param {String} size - A shopify image size attribute
   */

  function preload(images, size) {
    if (typeof images === 'string') {
      images = [images];
    }

    for (let i = 0; i < images.length; i++) {
      const image = images[i];

      this.loadImage(this.getSizedImageUrl(image, size));
    }
  }

  /**
   * Loads and caches an image in the browsers cache.
   * @param {string} path - An image url
   */
  function loadImage(path) {
    new Image().src = path;
  }

  /**
   * Find the Shopify image attribute size
   *
   * @param {string} src
   * @returns {null}
   */
  function imageSize(src) {
    const match = src.match(/.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\.@]/);

    if (match) {
      return match[1];
    }
      return null;
    
  }

  /**
   * Adds a Shopify size attribute to a URL
   *
   * @param src
   * @param size
   * @returns {*}
   */
  function getSizedImageUrl(src, size) {
    if (size === null) {
      return src;
    }

    if (size === 'master') {
      return this.removeProtocol(src);
    }

    const match = src.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);

    if (match) {
      const prefix = src.split(match[0]);
      const suffix = match[0];

      return this.removeProtocol(`${prefix[0]  }_${  size  }${suffix}`);
    }
      return null;
    
  }

  function removeProtocol(path) {
    return path.replace(/http(s)?:/, '');
  }

  return {
    preload,
    loadImage,
    imageSize,
    getSizedImageUrl,
    removeProtocol
  };
})();

/*= =============== Global ================ */
/**
 * Global Configurations
 * ------------------------------------------------------------------------------
 */
theme.config = {
  // Media queries & breakpoints based on src/styles/tools/variables.scss.liquid
  mediaQueries: {
    xs: 'screen and (max-width: 29.99em)',
    smallDown: 'screen and (max-width: 47.99em)',
    small: 'screen and (min-width: 30em) and (max-width: 47.99em)',
    smallUp: 'screen and (min-width: 30em)',
    mediumDown: 'screen and (max-width: 64em)',
    medium: 'screen and (min-width: 48em) and (max-width: 64em)',
    mediumUp: 'screen and (min-width: 48em)',
    largeDown: 'screen and (max-width: 79.99em)',
    large: 'screen and (min-width: 64.01em) and (max-width: 79.99em)',
    largeUp: 'screen and (min-width: 64.01em)',
    widescreen: 'screen and (min-width: 80em)'
  },
  breakpoints: {
    small: 480,
    medium: 768,
    large: 1024,
    widescreen: 1280
  }
};
if ((typeof ShopifyAPI) === 'undefined') {
  ShopifyAPI = {};
}

/*= ===========================================================================
  API Helper Functions
============================================================================== */
function attributeToString(attribute) {
  if ((typeof attribute) !== 'string') {
    attribute += '';
    if (attribute === 'undefined') {
      attribute = '';
    }
  }
  return jQuery.trim(attribute);
};

/*= ===========================================================================
  API Functions
============================================================================== */
ShopifyAPI.onCartUpdate = function(cart) {
  // alert('There are now ' + cart.item_count + ' items in the cart.');
};

ShopifyAPI.updateCartNote = function(note, callback) {
  const $body = $(document.body);
    const params = {
      type: 'POST',
      url: '/cart/update.js',
      data: `note=${  attributeToString(note)}`,
      dataType: 'json',
      beforeSend() {
        $body.trigger('beforeUpdateCartNote.ajaxCart', note);
      },
      success(cart) {
        if ((typeof callback) === 'function') {
          callback(cart);
        } else {
          ShopifyAPI.onCartUpdate(cart);
        }
        $body.trigger('afterUpdateCartNote.ajaxCart', [note, cart]);
      },
      error(XMLHttpRequest, textStatus) {
        $body.trigger('errorUpdateCartNote.ajaxCart', [XMLHttpRequest, textStatus]);
        ShopifyAPI.onError(XMLHttpRequest, textStatus);
      },
      complete(jqxhr, text) {
        $body.trigger('completeUpdateCartNote.ajaxCart', [this, jqxhr, text]);
      }
    };

  jQuery.ajax(params);
};

ShopifyAPI.onError = function(XMLHttpRequest, textStatus) {
  const data = eval(`(${  XMLHttpRequest.responseText  })`);

  if (data.message) {
    alert(`${data.message  }(${  data.status  }): ${  data.description}`);
  }
};

/*= ===========================================================================
  POST to cart/add.js returns the JSON of the cart
    - Allow use of form element instead of just id
    - Allow custom error callback
============================================================================== */
ShopifyAPI.addItemFromForm = function(form, callback, errorCallback) {
  const $body = $(document.body);
    const params = {
      type: 'POST',
      url: '/cart/add.js',
      data: jQuery(form).serialize(),
      dataType: 'json',
      beforeSend(jqxhr, settings) {
        $body.trigger('beforeAddItem.ajaxCart', form);
      },
      success(line_item) {
        if ((typeof callback) === 'function') {
          callback(line_item, form);
        } else {
          ShopifyAPI.onItemAdded(line_item, form);
        }
        $body.trigger('afterAddItem.ajaxCart', [line_item, form]);
      },
      error(XMLHttpRequest, textStatus) {
        if ((typeof errorCallback) === 'function') {
          errorCallback(XMLHttpRequest, textStatus);
        } else {
          ShopifyAPI.onError(XMLHttpRequest, textStatus);
        }
        $body.trigger('errorAddItem.ajaxCart', [XMLHttpRequest, textStatus]);
      },
      complete(jqxhr, text) {
        $body.trigger('completeAddItem.ajaxCart', [this, jqxhr, text]);
      }
    };

  jQuery.ajax(params);
};

// Get from cart.js returns the cart in JSON
ShopifyAPI.getCart = function(callback) {
  $(document.body).trigger('beforeGetCart.ajaxCart');
  jQuery.getJSON('/cart.js', (cart, textStatus) => {
    if ((typeof callback) === 'function') {
      callback(cart);
    } else {
      ShopifyAPI.onCartUpdate(cart);
    }
    $(document.body).trigger('afterGetCart.ajaxCart', cart);
  });
};

// POST to cart/change.js returns the cart in JSON
ShopifyAPI.changeItem = function(line, quantity, callback) {
  const $body = $(document.body);
    const params = {
      type: 'POST',
      url: '/cart/change.js',
      data: `quantity=${  quantity  }&line=${  line}`,
      dataType: 'json',
      beforeSend() {
        $body.trigger('beforeChangeItem.ajaxCart', [line, quantity]);
      },
      success(cart) {
        if ((typeof callback) === 'function') {
          callback(cart);
        } else {
          ShopifyAPI.onCartUpdate(cart);
        }
        $body.trigger('afterChangeItem.ajaxCart', [line, quantity, cart]);
      },
      error(XMLHttpRequest, textStatus) {
        $body.trigger('errorChangeItem.ajaxCart', [XMLHttpRequest, textStatus]);
        ShopifyAPI.onError(XMLHttpRequest, textStatus);
      },
      complete(jqxhr, text) {
        $body.trigger('completeChangeItem.ajaxCart', [this, jqxhr, text]);
      }
    };

  jQuery.ajax(params);
};

/**
 * Mobile Navigation Script
 * ------------------------------------------------------------------------------
 */

theme.MobileNav = (function() {
	const selectors = {
		mobileNavDrawer: '#mobile-nav-drawer',
		dropdownTrigger: '[js-dropdown-trigger]',
		dropdown: '[js-dropdown]'
	};
	let cache = {};

	function init() {
		cacheSelectors();
		initDrawer();

		$(selectors.dropdownTrigger, $(selectors.mobileNavDrawer)).on('click', function() {
			$(this).toggleClass('active');
			$(selectors.dropdown, $(selectors.mobileNavDrawer)).toggleClass('active');
		});
	}

	function cacheSelectors() {
		cache = {
			mobileNavDrawer: $(selectors.mobileNavDrawer)
		};
	}

	function initDrawer() {
		// Add required classes to HTML
		$('.js-drawer-open-nav')
			.attr('aria-controls', 'mobile-nav-drawer')
			.attr('aria-expanded', 'false');

		theme.MobileNavDrawer = window.Helpers.Drawers.create('mobile-nav-drawer', 'nav');
	}

	return {
		init
	};
})();

/*= ===========================================================================
  Ajax the add to cart experience by revealing it in a side drawer
  Plugin Documentation - http://shopify.github.io/Timber/#ajax-cart
  (c) Copyright 2015 Shopify Inc. Author: Carson Shold (@cshold). All Rights Reserved.

  This file includes:
    - Basic Shopify Ajax API calls
    - Ajax cart plugin

  This requires:
    - jQuery 1.8+
    - handlebars.min.js (for cart template)
    - modernizr.min.js
    - snippet/ajax-cart-template.liquid

  Customized version of Shopify's jQuery API
  (c) Copyright 2009-2015 Shopify Inc. Author: Caroline Schnapp. All Rights Reserved.
============================================================================== */

/*= ===========================================================================
  Ajax Shopify Add To Cart
============================================================================== */
var ajaxCart = (function(module, $) {
  let cartItems = [];
  /* global ShopifyAPI, slate, theme, Handlebars, Shopify */

  // Private general variables
  let settings; let isUpdating; let $body;

  // Private plugin variables
  let $formContainer; let $addToCart; let $cartCountSelector; let $cartCostSelector; let $cartContainer;

  window.dataLayer = window.dataLayer || [];
  /*= ===========================================================================
    PUBLIC METHODS - Initialise the plugin and define global options
  ============================================================================== */
  function init(options) {

    // Default settings
    settings = {
      formSelector: 'form[action^="/cart/add"]',
      cartContainer: '#CartContainer',
      addToCartSelector: 'input[type="submit"]',
      cartCountSelector: null,
      cartCostSelector: null,
      moneyFormat: '${{amount}}',
      disableAjaxCart: false,
      enableQtySelectors: true
    };

    // Override defaults with arguments
    $.extend(settings, options);

    // Select DOM elements
    $formContainer = $(settings.formSelector);
    $cartContainer = $(settings.cartContainer);
    $addToCart = $formContainer.find(settings.addToCartSelector);
    $cartCountSelector = $(settings.cartCountSelector);
    $cartCostSelector = $(settings.cartCostSelector);

    // General Selectors
    $body = $(document.body);

    // Track cart activity status
    isUpdating = false;

    // Setup ajax quantity selectors on the any template if enableQtySelectors is true
    if (settings.enableQtySelectors) {
      _qtySelectors();
    }

    // Take over the add to cart form submit action if ajax enabled
    if (!settings.disableAjaxCart && $addToCart.length) {
      _formOverride();
    }

    // Run this function in case we're using the quantity selector outside of the cart
    _adjustCart();
  }
  
  function open() {
    theme.CartDrawer.open();
  }

  function loadCart() {
    $body.addClass('drawer--is-loading');
    ShopifyAPI.getCart(_cartUpdateCallback);
  }

  /*= ===========================================================================
    PRIVATE METHODS
  ============================================================================== */
  function _updateCountPrice(cart) {
    if ($cartCountSelector) {
      $cartCountSelector.html(cart.item_count).removeClass('hidden-count');

      if (cart.item_count === 0) {
        $cartCountSelector.addClass('hidden-count');
      }
    }
    if ($cartCostSelector) {
      $cartCostSelector.html(slate.Currency.formatMoney(cart.total_price, settings.moneyFormat));
    }
  }

  function _formOverride() {
    $('body').on('submit', settings.formSelector, function(evt) {
      evt.preventDefault();

      // If gift card PDP, just add to cart
      if ($(this).data('gift-card-form')) {
        ShopifyAPI.addItemFromForm(evt.target, _itemAddedCallback, _itemErrorCallback);
      }
    });
  }

  function _itemAddedCallback() {
    $addToCart.removeClass('is-adding').addClass('is-added');

    ShopifyAPI.getCart(_cartUpdateCallback);
  }

  function _itemErrorCallback(XMLHttpRequest) {
    const data = JSON.parse(XMLHttpRequest.responseText);

    $addToCart.removeClass('is-adding is-added');

    if (data.message) {
      if (data.status === 422) {
        $addToCart.text('Sold Out').prop('disabled', true);
      }
    }
  }

  function _cartUpdateCallback(cart) {
    // Update quantity and price
    _updateCountPrice(cart);
    _buildCart(cart);
  }

  function _buildCart(cart) {
    // Start with a fresh cart div
    $cartContainer.empty();

    // Show empty cart
    if (cart.item_count === 0) {
      $('[js-cart-count]').html('0 Items');
      $('[js-bag-count]').html('(0)');
      $('[data-bag-count]').attr('data-bag-count', '');
      $cartContainer
        .append('<div class="ajaxcart__empty"><p>Your cart is currently empty.</p></div>');
      _cartCallback(cart);
      return;
    }

    $('[js-bag-count]').html(`(${  cart.item_count  })`);
    $('[data-bag-count]').attr('data-bag-count', cart.item_count);

    if (cart.item_count == 1) {
      $('[js-cart-count]').html(`${cart.item_count  } Item`);
    } else {
      $('[js-cart-count]').html(`${cart.item_count  } Items`);
    }

    // Handlebars.js cart layout
    const items = [];
      let item = {};
      let data = {};
      const source = $("#CartTemplate").html();
      const template = Handlebars.compile(source);

    // Add each item to our handlebars.js data
    $.each(cart.items, (index, cartItem) => {

      /* Hack to get product image thumbnail
       *   - If image is not null
       *     - Remove file extension, add _small, and re-add extension
       *     - Create server relative link
       *   - A hard-coded url of no-image
       */
  
      let prodImg = "//cdn.shopify.com/s/assets/admin/no-image-medium-cc9732cb976dd349a0df1d39816fbcc7.gif";

      const itemUrl = (window.Shopify.routes.root !== '/') ? window.Shopify.routes.root.concat(cartItem.url) : cartItem.url;

      if (cartItem.image != null) {
        prodImg = cartItem.image
      }

      const handleArray = cartItem.handle.split('-')
      const isGiftCard = handleArray[0] === 'gift'; // Gift card product handle starts with 'gift-...'
  
      let size = null;
      let design = null;
      let color = null;
      
      cartItem.options_with_values.forEach((option) => {
        if (option.name === 'Size') {
          size = option.value;
        }
  
        if (option.name === 'Color') {
          color = option.value;
        }
        
        if (option.name === 'Design' || (isGiftCard && option.name === 'Style')) {
          design = option.value;
        }
      })

      // Create item's data object and add to 'items' array
      item = {
        key: cartItem.key,
        line: index + 1, // Shopify uses a 1+ index in the API
        url: itemUrl,
        img: prodImg,
        name: cartItem.product_title,
        variation: cartItem.variant_title,
        size,
        color,
        design,
        properties: cartItem.properties,
        itemAdd: cartItem.quantity + 1,
        itemMinus: cartItem.quantity - 1,
        itemQty: cartItem.quantity,
        price: slate.Currency.formatMoney(cartItem.price, settings.moneyFormat),
        vendor: cartItem.vendor,
        linePrice: slate.Currency.formatMoney(cartItem.line_price, settings.moneyFormat),
        originalLinePrice: slate.Currency.formatMoney(cartItem.original_line_price, settings.moneyFormat),
        discounts: cartItem.discounts,
        discountsApplied: cartItem.line_price !== cartItem.original_line_price
      };

      console.log(item.url);
      items.push(item);
    });

    // Gather all cart data and add to DOM
    data = {
      items,
      note: cart.note,
      totalPrice: slate.Currency.formatMoney(cart.total_price, settings.moneyFormat),
      totalCartDiscount: cart.total_discount === 0 ? 0 : `${theme.strings.cartSavings  } ${  slate.Currency.formatMoney(cart.total_discount, settings.moneyFormat)}`,
      totalCartDiscountApplied: cart.total_discount !== 0,
      disclaimer_1: theme.settings.disclaimer_1,
      disclaimer_2: theme.settings.disclaimer_2,
      editItemsUrl: `${window.Shopify.routes.root}cart`
    };

    $cartContainer.append(template(data));

    _cartCallback(cart);
  }

  function _cartCallback(cart) {
    cartItems = cart.items.map((cartItem) => ({
      item_name: cartItem.product_title,
      item_id: String(cartItem.id),
      price: (cartItem.final_price / 100)
          .toFixed(2)
          .toLocaleString('en-US'),
      item_category: cartItem.product_type,
      item_variant: cartItem.variant_title,
      currency: window.Shopify.currency.active,
      quantity: String(cartItem.quantity),
    }));

    $body.removeClass('drawer--is-loading');
    $body.trigger('afterCartLoad.ajaxCart', cart);

    const cartFooterHeight = $('.ajaxcart__footer').outerHeight();

    $('#ajax-cart-drawer .ajaxcart__container').css('padding-bottom', `${cartFooterHeight  }px`);

    if (window.Shopify && Shopify.StorefrontExpressButtons) {
      Shopify.StorefrontExpressButtons.initialize();
    }
  }

  function _adjustCart() {
    // Delegate all events because elements reload with the cart

    // Remove line item from cart
    $body.on('click', '[data-remove-line]', function(e) {
      e.preventDefault();

      if (isUpdating) {
        return;
      }

      const line = $(this).data('line');
      const qty = 0;


      const removedItem = cartItems[line-1];
      if (removedItem) {
        const REMOVE_FROM_CART = 'remove_from_cart'; // NOTE: recurring analytics script variable

        window.dataLayer.push({
          event: REMOVE_FROM_CART,
          ecommerce: {
            items: [
              {
                ...removedItem
              }
            ]
          }
        });

        console.info(`dataLayer last event: ${
          JSON.stringify(window.dataLayer[window.dataLayer.length - 1])
        }`);
      }


      // If it has a data-line, update the cart
      if (line) {
        updateQuantity(line, qty);
      }
    });

    // Add or remove from the quantity
    $body.on('click', '.ajaxcart__qty-adjust', function() {
      if (isUpdating) {
        return;
      }

      const $el = $(this);
        const line = $el.data('line');
        const $qtySelector = $el.siblings('.ajaxcart__qty-num');
        var qty = parseInt($qtySelector.val().replace(/\D/g, ''));

      var qty = _validateQty(qty);

      // Add or subtract from the current quantity
      if ($el.hasClass('ajaxcart__qty--plus')) {
        qty += 1;
      } else {
        qty -= 1;
        if (qty <= 0) qty = 0;
      }

      // If it has a data-line, update the cart.
      // Otherwise, just update the input's number
      if (line) {
        updateQuantity(line, qty);
      } else {
        $qtySelector.val(qty);
      }
    });

    // Update quantity based on input on change
    $body.on('change', '.ajaxcart__qty-num', function() {
      if (isUpdating) {
        return;
      }

      const $el = $(this);
        const line = $el.data('line');
        var qty = parseInt($el.val().replace(/\D/g, ''));

      var qty = _validateQty(qty);

      // If it has a data-line, update the cart
      if (line) {
        updateQuantity(line, qty);
      }
    });

    // Prevent cart from being submitted while quantities are changing
    // Highlight the text when focused

    $body.on('submit', 'form.ajaxcart', (evt) => {
      const CHECKOUT = 'begin_checkout'; // NOTE: recurring analytics script variable

      window.dataLayer.push({
        event: CHECKOUT,
        ecommerce: {
          items: cartItems
        }
      });

      console.info(`dataLayer last event: ${
        JSON.stringify(window.dataLayer[window.dataLayer.length - 1])
      }`);

      if (isUpdating) {
        evt.preventDefault();
      }
    });
    $body.on('focus', '.ajaxcart__qty-adjust', function() {
      const $el = $(this);

      setTimeout(() => {
        $el.select();
      }, 50);
    });

    function updateQuantity(line, qty) {
      isUpdating = true;

      // Add activity classes when changing cart quantities
      const $row = $(`.ajaxcart__row[data-line="${  line  }"]`).addClass('is-loading');

      if (qty === 0) {
        $row.parent().addClass('is-removed');
      }

      // Slight delay to make sure removed animation is done
      setTimeout(() => {
        ShopifyAPI.changeItem(line, qty, _adjustCartCallback);
      }, 250);
    }

    // Save note anytime it's changed
    $body.on('change', 'textarea[name="note"]', function() {
      const newNote = $(this).val();

      // Update the cart note in case they don't click update/checkout
      ShopifyAPI.updateCartNote(newNote, (cart) => {});
    });
  }

  function _adjustCartCallback(cart) {
    // Update quantity and price
    _updateCountPrice(cart);

    // Reprint cart on short timeout so you don't see the content being removed
    setTimeout(() => {
      isUpdating = false;
      ShopifyAPI.getCart(_buildCart);
    }, 150);
  }

  function _qtySelectors() {
    // Change number inputs to JS ones, similar to ajax cart but without API integration.
    // Make sure to add the existing name and id to the new input element
    const numInputs = $('input[type="number"]');

    if (numInputs.length) {
      numInputs.each(function() {
        const $el = $(this);
        const currentQty = $el.val();
        const inputName = $el.attr('name');

        const itemAdd = currentQty + 1;
        const itemMinus = currentQty - 1;
        const itemQty = currentQty;

        const source = $("#JsQty").html();
          const template = Handlebars.compile(source);
          const data = {
            key: $el.data('key'),
            itemQty,
            itemAdd,
            itemMinus,
            inputName,
          };

        // Append new quantity selector then remove original
        $el.after(template(data)).remove();
      });

      // Setup listeners to add/subtract from the input
      $('.js-qty__adjust').on('click', function() {
        const $el = $(this);
        const $qtySelector = $el.siblings('.js-qty__num');
        const parsedQty = parseInt($qtySelector.val().replace(/\D/g, ''));

        var qty = _validateQty(parsedQty);

        // Add or subtract from the current quantity
        if ($el.hasClass('js-qty__adjust--plus')) {
          qty += 1;
        } else {
          qty -= 1;
          if (qty <= 1) qty = 1;
        }

        // Update the input's number
        $qtySelector.val(qty);
      });
    }
  }

  function _validateQty(qty) {
    if ((parseFloat(qty) === parseInt(qty)) && !isNaN(qty)) {
      // We have a valid number!
    } else {
      // Not a number. Default to 1.
      qty = 1;
    }
    return qty;
  }

  module = {
    init,
    open,
    load: loadCart
  };

  return module;

}(ajaxCart || {}, jQuery));

window.theme = window.theme || {};

theme.CartDrawer = window.Helpers.Drawers.create('ajax-cart-drawer', 'cart', {
  onDrawerOpen: ajaxCart.load
});

// Init ajax cart
ajaxCart.init({
  formSelector: '[data-product-form]',
  cartContainer: '#CartContainer',
  addToCartSelector: '[data-add-to-cart]',
  cartCountSelector: '.cart-count',
  moneyFormat: theme.moneyFormat
});
// Bind to 'afterCartLoad.ajaxCart' to run any javascript after the cart has loaded in the DOM
jQuery(document.body).on('afterCartLoad.ajaxCart', () => {
  theme.CartDrawer.open();
});

theme.Accordion = (function(){
  const selectors = {
    container: '[js-accordion-group]',
    header: '[js-accordion-header]',
    content: '[js-accordion-content]'
  }

  function init() {
    $('body').on('click', selectors.header, function(evt){
      const $el = $(this);

      if($el.attr('aria-expanded') == 'true'){
        // this stops the slide up triggering the parent;
        $el.siblings().slideUp(400, function() {
          $(this).attr('aria-hidden', true);
        })
        // This is closing the children accordions when the parent accordion is closed.
        $el.siblings(selectors.content).find(selectors.header).each(function(){
          $(this).attr('aria-expanded', false);
          $(this).siblings(selectors.content).slideUp(400, function() {
            $(this).attr('aria-hidden', true);
          });
        })
        $el.attr('aria-expanded', false);
      } else {
        $el.parent().siblings().find(selectors.content, selectors.container).slideUp(400, function(){
          $(this).attr('aria-hidden', true);
        });
        $el.parent().siblings().find(selectors.header, selectors.container).attr('aria-expanded', false);
        $el.siblings(selectors.content).slideDown().attr('aria-hidden', false);
        $el.attr('aria-expanded', true);
      }
    })
  }
  return {
    init
  }
})();

theme.AuxDrawers = (function() {
  function init() {
    initSizeGuide();
    initMoreInfo();
  }

  function initSizeGuide() {
    theme.sizeGuideDrawer = window.Helpers.Drawers.create('size-guide-drawer', 'size-guide');
  }

  function initMoreInfo() {
    theme.moreInfoDrawer = window.Helpers.Drawers.create('more-info-drawer', 'more-info');
    theme.moreInfoDrawer = window.Helpers.Drawers.create('more-info-drawer-new', 'more-info-new');
  }

  return {
    init
  };
})();

theme.CookieBar = (function() {
	const selectors = {
    cookieBar: '[js-cookie-bar]',
		close: '[js-close]'
	};

	function init() {
		const status = sessionStorage.getItem('cookieBar');

		if (status == undefined || status == 'true') {
			sessionStorage.setItem('cookieBar', 'true');
			$(selectors.cookieBar).css('display', 'flex');
		}

		$(selectors.close, $(selectors.cookieBar)).on('click', () => {
			$(selectors.cookieBar).hide();
			
			sessionStorage.setItem('cookieBar', 'false');
		});
	}

	return {
		init
	};
})();



theme.s1Gallery = (function() {

  const selectors = {
    scrollTrigger: '[js-scroll-trigger]',
    scrollImage: '[js-scroll-image]'
  }

  function s1Gallery() {
    enquire.register(theme.config.mediaQueries.smallDown,{
      match() {
        const controller = new ScrollMagic.Controller();

        new ScrollMagic.Scene({
          triggerElement: selectors.scrollTrigger,
          triggerHook: 0
        })
        .setClassToggle(selectors.scrollImage, 'fade-up')
        .addTo(controller);
      }
    })

  }

  return s1Gallery
})();

/*= =============== Templates ================ */
/**
 * Customer Addresses Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Customer Addresses
 * template.
 *
 * @namespace customerAddresses
 */

theme.customerAddresses = (function() {
  const $newAddressForm = $('#address_form_new');

  if (!$newAddressForm.length || !Shopify.CountryProvinceSelector) {
    return;
  }

  // Initialize observers on address selectors, defined in shopify_common.js
  if (Shopify) {
    new Shopify.CountryProvinceSelector('AddressCountryNew', 'AddressProvinceNew', {
      hideElement: 'AddressProvinceContainerNew'
    });
  }

  // Initialize each edit form's country/province selector
  $('[data-address-province-option]').each(function() {
    const $newAddressForm = $('#address_form_new');

    if (!$newAddressForm.length) {
      return;
    }

    const formId = $(this).data('form-id');
    const countrySelector = `AddressCountry_${formId}`;
    const provinceSelector = `AddressProvince_${formId}`;
    const containerSelector = `AddressProvinceContainer_${formId}`;

    new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
      hideElement: containerSelector
    });
  });

  $('[data-address-delete]').on('click', function() {
    const $el = $(this);
    const formId = $el.data('form-id');
    const confirmMessage = $el.data('confirm-message');


    if (confirm(confirmMessage)) {
      Shopify.postLink(`${window.Shopify.routes.root}account/addresses/${formId}`, {parameters: {_method: 'delete'}});
    }
  });

  return this;
})();

/**
 * Password Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Password template.
 *
 * @namespace password
 */

theme.customerLogin = (function() {
  const config = {
    recoverPasswordForm: '[js-show-recover]',
    hideRecoverPasswordLink: '[js-hide-recover]'
  };

  if (!$(config.recoverPasswordForm).length) {
    return;
  }

  checkUrlHash();
  resetPasswordSuccess();

  $(config.recoverPasswordForm).on('click', onShowHidePasswordForm);
  $(config.hideRecoverPasswordLink).on('click', onShowHidePasswordForm);

  function onShowHidePasswordForm(evt) {
    evt.preventDefault();
    toggleRecoverPasswordForm();
  }

  function checkUrlHash() {
    const {hash} = window.location;

    // Allow deep linking to recover password form
    if (hash === '#recover') {
      toggleRecoverPasswordForm();
    }
  }

  /**
   *  Show/Hide recover password form
   */
  function toggleRecoverPasswordForm() {
    $('.login__recover').toggle();
    $('.login__login').toggle();
  }

  /**
   *  Show reset password success message
   */
  function resetPasswordSuccess() {
    const $formState = $('.reset-password-success');

    // check if reset password form was successfully submited.
    if (!$formState.length) {
      return;
    }

    // show success message
    $('#ResetSuccess').removeClass('hide');
  }

  return this;
})();

theme.AccountAddress = (function(){
  function AccountAddress(container) {
    this.$container = $(container);
  
    $('[data-address-delete]').on('click', function() {
      const $el = $(this);
      const formId = $el.data('form-id');
      const confirmMessage = $el.data('confirm-message');

      if (confirm(confirmMessage || 'Are you sure you wish to delete this address?')) {
        Shopify.postLink(`/account/addresses/${  formId}`, {parameters: {_method: 'delete'}});
      }
    });
  }

  return AccountAddress;
})();

theme.PrivacyPolicy = (function() {
  
  const selectors = {
    trigger: '[js-trigger]',
    panel: '[js-panel]'
  }

  function PrivacyPolicy(container) {
    enquire.register(theme.config.mediaQueries.mediumUp,{
      match() {
        this.$container = $(container);
        
        this.$container.find(selectors.trigger).on('click', function() {
          $(this)
            .addClass('active')
            .siblings()
            .removeClass('active');
    
          const index = $(this).data('index');
    
          $('html, body').animate({
            scrollTop: parseInt($(selectors.panel).eq(index).offset().top - 125)
          }, 500);
        })
      }
    })
  }

  return PrivacyPolicy;
})();

$(document).ready(() => {
  const sections = new slate.Sections();

  sections.register('account-address', theme.AccountAddress);
  sections.register('privacy-policy', theme.PrivacyPolicy);
  sections.register('s1-gallery', theme.s1Gallery);

  // Common a11y fixes
  slate.a11y.pageLinkFocus($(window.location.hash));

  $('.in-page-link').on('click', (evt) => {
    slate.a11y.pageLinkFocus($(evt.currentTarget.hash));
  });

  // Target tables to make them scrollable
  const tableSelectors = '.rte table';

  slate.rte.wrapTable({
    $tables: $(tableSelectors),
    tableWrapperClass: 'rte__table-wrapper',
  });

  // Target iframes to make them responsive
  const iframeSelectors =
    '.rte iframe[src*="youtube.com/embed"],' +
    '.rte iframe[src*="player.vimeo"]';

  slate.rte.wrapIframe({
    $iframes: $(iframeSelectors),
    iframeWrapperClass: 'rte__video-wrapper'
  });

  // Apply a specific class to the html element for browser support of cookies.
  if (slate.cart.cookiesEnabled()) {
    document.documentElement.className = document.documentElement.className.replace('supports-no-cookies', 'supports-cookies');
  }

  // init
  theme.MobileNav.init();
  theme.Accordion.init();
  theme.AuxDrawers.init();
  theme.CookieBar.init();
});
