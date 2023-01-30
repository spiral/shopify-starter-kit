import { isMobileDevice } from '../../scripts/utils/isMobileDevice';
import { normalizeIndex } from '../../scripts/utils/normalizeIndex';

export const initCustomersAddressModalNewSnippet = () => {
  const addressModalForm =
    document.querySelector(
      '[data-snippet="customers-address-modal-new"] form'
    ) || null;

  if (addressModalForm) {
    useAdaptiveFormLabels(addressModalForm);
  }

  if (isMobileDevice()) {
    const addressModalFormInputs =
      addressModalForm?.querySelectorAll('input') || [];

    addressModalFormInputs.forEach((input) => {
      input.addEventListener('click', () => {
        const inputEnd = input.value.length;

        input.setSelectionRange(inputEnd, inputEnd);
        input.focus();
      });
    });
  }
};

// TODO: need to remove duplicate with address-modal-edit
function useAdaptiveFormLabels(form) {
  const controlId = 'AddressCountryNew';
  const control = form.querySelector(`#${controlId}`) || null;
  const valueOrder = ['United States', 'Canada'];

  updateAdaptValues(
    form,
    controlId,
    normalizeIndex(valueOrder.indexOf(control?.value))
  );

  control?.addEventListener('change', ({ target }) => {
    updateAdaptValues(
      form,
      controlId,
      normalizeIndex(valueOrder.indexOf(target?.value))
    );
  });
}

// TODO: need to remove duplicate with address-modal-edit
function updateAdaptValues(form, controlId, value = 0) {
  form.querySelectorAll(`[data-adapt-for=${controlId}]`).forEach((el) => {
    if (el.getAttribute(`data-adapt-value`) === String(value)) {
      el.classList.remove('visually-hidden');
    } else {
      el.classList.add('visually-hidden');
    }
  });
}
