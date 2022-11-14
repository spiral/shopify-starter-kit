const selectors = {
  customerAddresses: '[data-customer-addresses]',
  addressCountrySelect: '[data-address-country-select]',
  addressContainer: '[data-address]',
  toggleAddressButton: 'button[aria-expanded]',
  cancelAddressButton: 'button[type="reset"]',
  deleteAddressButton: 'button[data-confirm-message]',
};

const attributes = {
  expanded: 'aria-expanded',
  confirmMessage: 'data-confirm-message',
};

const { Shopify, confirm } = window;

class CustomerAddresses {
  constructor() {
    this.elements = this.getElements();
    if (Object.keys(this.elements).length === 0) {
      return;
    }
    this.setupCountries();
    this.setupEventListeners();
  }

  static getElements() {
    const container = document.querySelector(selectors.customerAddresses);

    if (!container) {
      return {};
    }

    return {
      container,
      addressContainer: container.querySelector(selectors.addressContainer),
      toggleButtons: document.querySelectorAll(selectors.toggleAddressButton),
      cancelButtons: container.querySelectorAll(selectors.cancelAddressButton),
      deleteButtons: container.querySelectorAll(selectors.deleteAddressButton),
      countrySelects: container.querySelectorAll(
        selectors.addressCountrySelect
      ),
    };
  }

  setupCountries() {
    if (Shopify && Shopify.CountryProvinceSelector) {
      // eslint-disable-next-line no-new
      new Shopify.CountryProvinceSelector(
        'AddressCountryNew',
        'AddressProvinceNew',
        {
          hideElement: 'AddressProvinceContainerNew',
        }
      );
      this.elements.countrySelects.forEach((select) => {
        const { formId } = select.dataset;
        // eslint-disable-next-line no-new

        Shopify.CountryProvinceSelector(
          `AddressCountry_${formId}`,
          `AddressProvince_${formId}`,
          {
            hideElement: `AddressProvinceContainer_${formId}`,
          }
        );
      });
    }
  }

  setupEventListeners() {
    this.elements.toggleButtons.forEach((element) => {
      element.addEventListener('click', this.handleAddEditButtonClick);
    });
    this.elements.cancelButtons.forEach((element) => {
      element.addEventListener('click', this.handleCancelButtonClick);
    });
    this.elements.deleteButtons.forEach((element) => {
      element.addEventListener('click', this.handleDeleteButtonClick);
    });
  }

  static toggleExpanded(target) {
    target.setAttribute(
      attributes.expanded,
      (target.getAttribute(attributes.expanded) === 'false').toString()
    );
  }

  handleAddEditButtonClick({ currentTarget }) {
    this.toggleExpanded(currentTarget);
  }

  handleCancelButtonClick({ currentTarget }) {
    this.toggleExpanded(
      currentTarget
        .closest(selectors.addressContainer)
        .querySelector(`[${attributes.expanded}]`)
    );
  }

  static handleDeleteButtonClick({ currentTarget }) {
    // eslint-disable-next-line no-alert
    if (confirm(currentTarget.getAttribute(attributes.confirmMessage))) {
      Shopify.postLink(currentTarget.dataset.target, {
        parameters: { _method: 'delete' },
      });
    }
  }
}

window.CustomerAddresses = CustomerAddresses;
