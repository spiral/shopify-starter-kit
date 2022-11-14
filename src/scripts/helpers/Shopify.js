export const Shopify = {};

Shopify.bind = (fn, scope) =>
  // eslint-disable-next-line func-names
  function () {
    // eslint-disable-next-line prefer-rest-params
    return fn.apply(scope, arguments);
  };

Shopify.setSelectorByValue = (selector, value) => {
  let result = null;

  Array.from(selector.options || []).forEach((option, index) => {
    if ((value === option.value || value === option.innerHTML) && !result) {
      result = index;
    }
  });

  // eslint-disable-next-line no-param-reassign
  selector.selectedIndex = result;

  return result;
};

Shopify.addListener = (target, eventName, callback) => {
  if (target.addEventListener) {
    target.addEventListener(eventName, callback, false);
  } else {
    target.attachEvent(`on${eventName}`, callback);
  }
};

Shopify.postLink = (path, opt) => {
  const options = opt || {};
  const method = options.method || 'post';
  const params = options.parameters || {};

  const form = document.createElement('form');

  form.setAttribute('method', method);
  form.setAttribute('action', path);

  Object.entries(params).forEach(([key, value]) => {
    const hiddenField = document.createElement('input');

    hiddenField.setAttribute('type', 'hidden');
    hiddenField.setAttribute('name', key);
    hiddenField.setAttribute('value', value);
    form.appendChild(hiddenField);
  });

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};

Shopify.CountryProvinceSelector = (countryDomid, provinceDomid, options) => {
  this.countryEl = document.getElementById(countryDomid);
  this.provinceEl = document.getElementById(provinceDomid);
  this.provinceContainer = document.getElementById(
    options.hideElement || provinceDomid
  );

  Shopify.addListener(
    this.countryEl,
    'change',
    Shopify.bind(this.countryHandler, this)
  );

  this.initCountry();
  this.initProvince();
};

Shopify.CountryProvinceSelector.prototype = {
  initCountry() {
    const value = this.countryEl.getAttribute('data-default');

    Shopify.setSelectorByValue(this.countryEl, value);
    this.countryHandler();
  },

  initProvince() {
    const value = this.provinceEl.getAttribute('data-default');

    if (value && this.provinceEl.options.length > 0) {
      Shopify.setSelectorByValue(this.provinceEl, value);
    }
  },

  countryHandler() {
    const opt = this.countryEl.options[this.countryEl.selectedIndex];
    const raw = opt.getAttribute('data-provinces');
    const provinces = JSON.parse(raw);

    this.clearOptions(this.provinceEl);

    if (provinces && provinces.length === 0) {
      this.provinceContainer.style.display = 'none';
    } else {
      Array.from(provinces).forEach(([key, value]) => {
        const option = document.createElement('option');

        option.value = key;
        option.innerHTML = value;
        this.provinceEl.appendChild(option);
      });

      this.provinceContainer.style.display = '';
    }
  },

  clearOptions(selector) {
    while (selector.firstChild) {
      selector.removeChild(selector.firstChild);
    }
  },
};
