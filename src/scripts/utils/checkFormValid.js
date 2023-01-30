import { validateEmail } from './validateEmail';

// eslint-disable-next-line no-useless-escape
const REGEXP_SPECIAL_SYMBOLS = /[!@#$%^&*()_+=\[\]{};:"\\|,<>\/?~]/;

const CONTROL_DATA_ATTR = 'data-control';
const CONTROL_VALIDATION_STYLES_DATA_ATTR = 'data-validation-styles';
const CONTROL_FIELD_DATA_ATTR = 'data-field';
const CONTROL_ERROR_MESSAGE_DATA_ATTR = 'data-error';

const FORM_CUSTOM_RULES_DATA_ATTR = 'data-form-custom-rules';
const FORM_CUSTOM_RULE_DATA_ATTR = 'data-form-custom-rule';
const FORM_CUSTOM_RULE_PATTERN_DATA_ATTR = 'data-form-custom-rule-pattern';

export const CONTROL_VALIDATION_STATUS = {
  ERROR: 'error',
  SUCCESS: 'success',
  DEFAULT: '',
};

const ERROR_MESSAGE_DATA_ATTR = {
  REQUIRED: 'data-required-error',
  SPECIAL_SYMBOLS: 'data-spec-symbol-error',
  EMAIL_FORMAT: 'data-email-error',
  CUSTOM_RULES: 'data-control-custom-rules',
  NOTHING: '',
};

export const initPasswordFields = (form) => {
  if (!form) {
    return null;
  }

  form.querySelectorAll('label').forEach((label) => {
    const showPasswordButton = label.querySelector('input + span + button');

    if (showPasswordButton) {
      const labelInput = label.querySelector('input');

      showPasswordButton.addEventListener('click', () => {
        if (labelInput.type === 'password') {
          labelInput.type = 'text';
        } else if (labelInput.type === 'text') {
          labelInput.type = 'password';
        }
      });
    }
  });

  return form;
};

export function checkFormValid(formId) {
  return new Promise((resolve, reject) => {
    const form = document.querySelector(`#${formId}`);
    const controls = form
      ? form.querySelectorAll(`[${CONTROL_DATA_ATTR}]`)
      : [];

    if (checkFieldData()) {
      setBotTrapValue(form);
      const formData = getFormData(form);

      return resolve(formData);
    }

    return reject(new Error(`Invalid control values for fromID: ${formId}`));

    function checkFieldData() {
      let isFormDataValid = true;

      controls.forEach((control) => {
        const dataField = control.querySelector(`[${CONTROL_FIELD_DATA_ATTR}]`);

        if (dataField) {
          if (control.hasAttribute(ERROR_MESSAGE_DATA_ATTR.REQUIRED)) {
            if (!dataField.value.trim()) {
              isFormDataValid = false;
              setControlErrorMessage(control, ERROR_MESSAGE_DATA_ATTR.REQUIRED);
              setControlValidationStyles(
                control,
                CONTROL_VALIDATION_STATUS.ERROR
              );
              return;
            }
          }

          if (control.hasAttribute(ERROR_MESSAGE_DATA_ATTR.SPECIAL_SYMBOLS)) {
            if (REGEXP_SPECIAL_SYMBOLS.test(String(dataField.value))) {
              isFormDataValid = false;
              setControlErrorMessage(
                control,
                ERROR_MESSAGE_DATA_ATTR.SPECIAL_SYMBOLS
              );
              setControlValidationStyles(
                control,
                CONTROL_VALIDATION_STATUS.ERROR
              );
              return;
            }
          }

          if (control.hasAttribute(ERROR_MESSAGE_DATA_ATTR.EMAIL_FORMAT)) {
            if (!validateEmail(dataField.value)) {
              isFormDataValid = false;
              setControlErrorMessage(
                control,
                ERROR_MESSAGE_DATA_ATTR.EMAIL_FORMAT
              );
              setControlValidationStyles(
                control,
                CONTROL_VALIDATION_STATUS.ERROR
              );
              return;
            }
          }

          if (control.hasAttribute(ERROR_MESSAGE_DATA_ATTR.CUSTOM_RULES)) {
            if (!validateCustomRules(control)) {
              isFormDataValid = false;
              setControlErrorMessage(
                control,
                ERROR_MESSAGE_DATA_ATTR.CUSTOM_RULES
              );
              setControlValidationStyles(
                control,
                CONTROL_VALIDATION_STATUS.ERROR
              );
              return;
            }
          }

          setControlErrorMessage(control, ERROR_MESSAGE_DATA_ATTR.NOTHING);
          setControlValidationStyles(
            control,
            CONTROL_VALIDATION_STATUS.SUCCESS
          );
        }
      });

      return isFormDataValid;
    }
  });
}

export function setControlErrorMessage(
  control,
  errorMessageAttr = ERROR_MESSAGE_DATA_ATTR.NOTHING
) {
  let errorContainer = control.querySelector(
    `[${CONTROL_ERROR_MESSAGE_DATA_ATTR}]`
  );

  if (!errorContainer) {
    errorContainer = document.createElement('div');
    control.appendChild(errorContainer);
  }

  if (errorMessageAttr === ERROR_MESSAGE_DATA_ATTR.NOTHING) {
    errorContainer.innerHTML = '';

    return;
  }

  const errorText = control.getAttribute(errorMessageAttr);

  if (errorText) {
    errorContainer.setAttribute(CONTROL_ERROR_MESSAGE_DATA_ATTR, 'true');

    errorContainer.innerHTML = errorText;
  }
}

export function setControlValidationStyles(
  control,
  param = CONTROL_VALIDATION_STATUS.DEFAULT
) {
  control.setAttribute(CONTROL_VALIDATION_STYLES_DATA_ATTR, param);
}

function getFormData(formEl) {
  const formFields = formEl.querySelectorAll(`[${CONTROL_FIELD_DATA_ATTR}]`);
  const formData = new FormData();

  if (formFields) {
    formFields.forEach((field) => {
      formData.append(field.name, field.value);
    });
  }

  return formData;
}

function setBotTrapValue(formEl) {
  const inputTrap = formEl.querySelector('[name="trap"]');

  if (inputTrap?.value === '' || inputTrap?.value === 'null') {
    inputTrap.value = 'not_a_bot';
  }
}

function validateCustomRules(control) {
  if (!control || !control.hasAttribute(ERROR_MESSAGE_DATA_ATTR.CUSTOM_RULES)) {
    return true;
  }

  const validationRules = [
    ...control.querySelectorAll(`[${FORM_CUSTOM_RULE_DATA_ATTR}]`),
  ];

  if (!validationRules.length) {
    return true;
  }

  const controlValue = control.querySelector('input').value;

  const validationStatusList = validationRules.map((ruleField) => {
    const rulePattern = ruleField.getAttribute(
      FORM_CUSTOM_RULE_PATTERN_DATA_ATTR
    );

    const isValid = new RegExp(rulePattern.replace(/^\/|\/$/g, '')).test(
      String(controlValue)
    );

    ruleField.setAttribute(
      FORM_CUSTOM_RULE_DATA_ATTR,
      makeErrorStatus(isValid)
    );

    return isValid;
  });

  const isValidControl = !validationStatusList.some((value) => value !== true);

  control
    .querySelector(`[${FORM_CUSTOM_RULES_DATA_ATTR}]`)
    .setAttribute(FORM_CUSTOM_RULES_DATA_ATTR, makeErrorStatus(isValidControl));

  return isValidControl;
}

function makeErrorStatus(status) {
  return status
    ? CONTROL_VALIDATION_STATUS.SUCCESS
    : CONTROL_VALIDATION_STATUS.ERROR;
}
