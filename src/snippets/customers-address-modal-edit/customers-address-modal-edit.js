import { isMobileDevice } from '../../scripts/utils/isMobileDevice';
import { normalizeIndex } from '../../scripts/utils/normalizeIndex';

export const initCustomersAddressModalEditSnippet = () => {
  const addressModalForms =
    document.querySelectorAll(
      '[data-snippet="customers-address-modal-edit"] form'
    ) || [];

  addressModalForms.forEach((form) => {
    useAdaptiveFormLabels(form);
  });

  if (isMobileDevice()) {
    const addressModalFormInputs = document.querySelectorAll(
      '[data-snippet="customers-address-modal-edit"] form input'
    );

    addressModalFormInputs.forEach((input) => {
      input.addEventListener('click', () => {
        const inputEnd = input.value.length;

        input.setSelectionRange(inputEnd, inputEnd);
        input.focus();
      });
    });
  }
};

// TODO: need to remove duplicate with address-modal-new
function useAdaptiveFormLabels(form) {
  const controlId = `AddressCountry_${form.getAttribute('data-form-id')}`;
  const control = form.querySelector(`#${controlId}`);
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

// TODO: need to remove duplicate with address-modal-new
function updateAdaptValues(form, controlId, value = 0) {
  form.querySelectorAll(`[data-adapt-for=${controlId}]`).forEach((el) => {
    if (el.getAttribute(`data-adapt-value`) === String(value)) {
      el.classList.remove('visually-hidden');
    } else {
      el.classList.add('visually-hidden');
    }
  });
}
