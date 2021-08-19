/**
 * Customer Addresses Script
 * --------------------------------------------
 * A file that contains scripts
 * highly couple code to the Customer Addresses
 * template.
 *
 * @namespace customerAddresses
 */

import { AddressForm } from '@shopify/theme-addresses';


const ADDRESS_CONTAINER_SELECTOR = '[data-address]';
const ADDRESS_FIELDS_SELECTOR = '[data-address-fields]';
const ADDRESS_TOGGLE_SELECTOR = '[data-address-toggle]';
const ADDRESS_FORM_SELECTOR = '[data-address-form]';
const ADDRESS_DELETE_FORM_SELECTOR = '[data-address-delete-form]';

const hideClass = 'hide';

function initializeAddressForm(container) {
  const addressFields = container.querySelector(ADDRESS_FIELDS_SELECTOR);
  const addressForm = container.querySelector(ADDRESS_FORM_SELECTOR);
  const deleteForm = container.querySelector(ADDRESS_DELETE_FORM_SELECTOR);

  container.querySelectorAll(ADDRESS_TOGGLE_SELECTOR).forEach((button) => {
    button.addEventListener('click', () => {
      addressForm.classList.toggle(hideClass);
    });
  });

  AddressForm(addressFields, 'en');

  if (deleteForm) {
    deleteForm.addEventListener('submit', (event) => {
      const confirmMessage = deleteForm.getAttribute('data-confirm-message');

      if (
        !window.confirm(
          confirmMessage || 'Are you sure you wish to delete this address?'
        )
      ) {
        event.preventDefault();
      }
    });
  }
}

const addressForms = document.querySelectorAll(ADDRESS_CONTAINER_SELECTOR);

if (addressForms.length) {
  addressForms.forEach((addressContainer) => {
    initializeAddressForm(addressContainer);
  });
}
