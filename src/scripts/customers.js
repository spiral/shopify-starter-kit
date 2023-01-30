import { checkFormValid, initPasswordFields } from './utils/checkFormValid';
import { GoogleAnalytics } from './analytics/index';
import {
  EVENT_STORAGE_KEY,
  EVENT_STORAGE_VALUES,
  SHOPIFY_REDIRECT_FROM,
  SHOPIFY_FORM_REDIRECTS,
} from './utils/constants';
import { initCustomersAddressModalEditSnippet } from '../snippets/customers-address-modal-edit/customers-address-modal-edit';
import { initCustomersAddressModalNewSnippet } from '../snippets/customers-address-modal-new/customers-address-modal-new';
import { initCustomersHeaderSnippet } from '../snippets/customers-header/customers-header';

const { localStorage = null, customerId = null } = window;

const DATA_ACCOUNT_PASSWORD_RECOVER_MESSAGE =
  'data-account-password-recover-success';
const PASSWORD_RECOVER_FORM_ID = 'recover_customer_password';

const initCustomerLoginForm = () => {
  const loginForm = document.querySelector('form#customer_login') || null;

  if (loginForm && localStorage) {
    initPasswordFields(loginForm);

    loginForm.addEventListener('submit', () => {
      localStorage.setItem(EVENT_STORAGE_KEY, EVENT_STORAGE_VALUES.LOGIN);
    });
  }
};

const initCustomerRegisterForm = () => {
  const registerForm = document.querySelector('form#create_customer') || null;

  if (registerForm && localStorage) {
    initPasswordFields(registerForm);
    registerForm.addEventListener('submit', () => {
      localStorage.setItem(EVENT_STORAGE_KEY, EVENT_STORAGE_VALUES.REGISTER);
    });
  }
};

const initResetPasswordLogic = () => {
  const resetPasswordForm = document.querySelector('form#reset-password__form');

  if (resetPasswordForm) {
    initPasswordFields(resetPasswordForm);

    const formSubmitButton = resetPasswordForm.querySelector('[type="submit"]');
    const formId = resetPasswordForm.getAttribute('id');

    formSubmitButton.addEventListener('click', (event) => {
      event.preventDefault();

      checkFormValid(formId).then(() => {
        resetPasswordForm.submit();
      });
    });
  }
};

initResetPasswordLogic();

const initAccountPage = () => {
  initCustomersHeaderSnippet();

  const changePasswordForm = document.querySelector(
    `form#${PASSWORD_RECOVER_FORM_ID}`
  );

  if (changePasswordForm) {
    const changePasswordSuccessMessage = document.querySelector(
      '[data-account-password-recover-success]'
    );

    changePasswordForm.addEventListener('submit', () => {
      window.sessionStorage.setItem(
        SHOPIFY_REDIRECT_FROM,
        SHOPIFY_FORM_REDIRECTS.RECOVER_CUSTOMER_PASSWORD
      );
    });

    if (window.sessionStorage.getItem(SHOPIFY_REDIRECT_FROM)) {
      changePasswordSuccessMessage.setAttribute(
        DATA_ACCOUNT_PASSWORD_RECOVER_MESSAGE,
        'true'
      );

      window.sessionStorage.removeItem(SHOPIFY_REDIRECT_FROM);
    }
  }
};

const initCustomerNewsletter = () => {
  const newsletterForm = document.querySelector(
    'form#newsletter-subscription-form'
  );

  if (newsletterForm) {
    const submitButton = newsletterForm?.querySelector('[type=submit]');

    newsletterForm.addEventListener('submit', (event) => {
      event.preventDefault();

      submitButton?.setAttribute('disabled', '');

      checkFormValid(newsletterForm.id).then((data) => {
        const body = JSON.stringify(Object.fromEntries(data.entries()));

        return fetch(newsletterForm.getAttribute('data-submit-url'), {
          method: 'POST',
          body,
        })
          .then(() => {
            const subscriptionStatusInput = newsletterForm.querySelector(
              '[name=accepts_marketing]'
            );

            const isEnableStatus = subscriptionStatusInput.value === 'true';

            subscriptionStatusInput.value = String(!isEnableStatus);

            newsletterForm.setAttribute(
              'data-newsletter-from-status',
              String(isEnableStatus)
            );
          })
          .finally(() => {
            submitButton?.removeAttribute('disabled');
          });
      });
    });
  }
};

initAccountPage();
initCustomerNewsletter();

window.addEventListener('DOMContentLoaded', () => {
  initCustomerLoginForm();
  initCustomerRegisterForm();
  initCustomersAddressModalEditSnippet();
  initCustomersAddressModalNewSnippet();

  const storedEventName = localStorage
    ? localStorage.getItem(EVENT_STORAGE_KEY)
    : null;

  if (customerId && storedEventName) {
    GoogleAnalytics.trackEvent(storedEventName, {
      user_id: customerId,
    });

    localStorage.removeItem(EVENT_STORAGE_KEY);
  }
});
