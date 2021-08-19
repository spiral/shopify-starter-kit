/**
 * Password Template Script
 * -------------------------------------
 * A file that contains scripts highly
 * couple code to the Password template.
 *
 * @namespace password
 */

const RECOVER_PASSWORD_FORM_TRIGGERS_SELECTOR = '[data-recover-toggle]';
const RECOVER_PASSWORD_FORM_SELECTOR = '[data-recover-form]';
const LOGIN_FORM_SELECTOR = '[data-login-form]';
const FORM_STATE_SELECTOR = '[data-form-state]';
const REQUEST_SUCCESS_SELECTOR = '[data-reset-success]';

function onShowHidePasswordForm(evt) {
  evt.preventDefault();
  toggleRecoverPasswordForm();
}

function checkUrlHash() {
  const { hash } = window.location;

  // Allow deep linking to recover password form
  if (hash === '#recover') {
    toggleRecoverPasswordForm();
  }
}

/**
 *  Show/Hide recover password form
 */
function toggleRecoverPasswordForm() {
  document
    .querySelector(RECOVER_PASSWORD_FORM_SELECTOR)
    .classList.toggle('hide');
  document.querySelector(LOGIN_FORM_SELECTOR).classList.toggle('hide');
}

/**
 *  Show reset password success message
 */
function resetPasswordSuccess() {
  // check if reset password form was
  // successfully submitted and show success message.

  if (document.querySelector(FORM_STATE_SELECTOR)) {
    document.querySelector(REQUEST_SUCCESS_SELECTOR).classList.remove('hide');
  }
}

if (document.querySelector(RECOVER_PASSWORD_FORM_SELECTOR)) {
  checkUrlHash();
  resetPasswordSuccess();

  document
    .querySelectorAll(RECOVER_PASSWORD_FORM_TRIGGERS_SELECTOR)
    .forEach((trigger) => {
      trigger.addEventListener('click', onShowHidePasswordForm);
    });
}
