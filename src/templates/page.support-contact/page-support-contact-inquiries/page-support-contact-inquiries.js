import isString from 'lodash/isString';
import {
  checkFormValid,
  CONTROL_VALIDATION_STATUS,
  setControlErrorMessage,
  setControlValidationStyles,
} from '../../../scripts/utils/checkFormValid';
import '../../../scripts/domPolyfills/closest';

import { GoogleAnalytics } from '../../../scripts/analytics/index';

const FILE_INPUT_DATA_ATTR = 'data-support-contact-inquiries-file-control';
const FILE_INPUT_MESSAGE_DATA_ATTR =
  'data-support-contact-inquiries-file-control-message';

const formsWrapper = document.querySelector(
  '[data-support-contact-inquiries-forms]'
);

const formSelectElement = formsWrapper.querySelector(`[data-form-select]`);
const targetForms = formsWrapper.querySelectorAll('form');

const formSuccessResultElement = document.querySelector(
  '[data-page-support-contact-inquiries-form-success]'
);

export const initPageSupportInquiriesSection = () => {
  initFileInputs();

  targetForms.forEach((form) => {
    handleFormSubmit(form.id);
  });

  formSelectElement.addEventListener('change', () => {
    toggleSuccessResult(false);

    const selectItemValue =
      formSelectElement.options[formSelectElement.selectedIndex].value;

    targetForms.forEach((form) => {
      const isSelectedForm = form.id === selectItemValue;

      form.setAttribute('data-hidden', isSelectedForm ? 'false' : 'true');
    });
  });
};

function handleFormSubmit(id) {
  const form = document.getElementById(id);
  const formSubmitButton = form.querySelector('[type="submit"]');
  const formSubmitButtonText = formSubmitButton.textContent;

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      checkFormValid(id)
        .then((data) => {
          if (formSubmitButton) {
            formSubmitButton.disabled = true;
            formSubmitButton.textContent = 'Submitting...';
          }

          GoogleAnalytics.trackEvent(GoogleAnalytics.EVENTS.CONTACT_US, {
            form_name: id,
          });

          return fetch(`${form.dataset.submitUrl}`, {
            method: 'POST',
            body: normalizedBody(id, data),
          });
        })
        .then((response) => {
          if (formSubmitButton) {
            formSubmitButton.disabled = false;

            formSubmitButton.textContent = formSubmitButtonText;
          }

          if (!response.ok) {
            return Promise.reject(
              new Error(`Response status ${response.status}`)
            );
          }

          return Promise.resolve(response);
        })
        .then(() => {
          toggleSuccessResult(true);

          // NOTE: Manual set success styles to input file upload 'cause
          // file upload isn't included by checkFormValid
          form
            .querySelectorAll(`[${FILE_INPUT_DATA_ATTR}]`)
            .forEach((control) => {
              setControlValidationStyles(
                control,
                CONTROL_VALIDATION_STATUS.SUCCESS
              );
              setControlErrorMessage(control, '');
            });

          hideAllForms();
        })
        .catch(() => {
          console.error('Form validation is failed');
        });
    });
  }
}

function toggleSuccessResult(isVisible) {
  formSuccessResultElement.setAttribute(
    'data-page-support-contact-inquiries-form-success',
    isVisible ? 'true' : 'false'
  );
}

function hideAllForms() {
  targetForms.forEach((form) => {
    form.setAttribute('data-hidden', 'true');
  });

  const anchorItem = document.querySelector(
    '[data-section="page-support-contact-inquiries"]'
  );

  anchorItem.scrollIntoView();
}

function normalizedBody(formId, formData) {
  const targetForm = document.querySelector(`form#${formId}`);
  const isMultipartForm =
    targetForm.getAttribute('enctype') === 'multipart/form-data';

  if (isMultipartForm) {
    targetForm.querySelectorAll('[type="file"]').forEach((fileInput) => {
      Array.from(fileInput.files).forEach((file, index) => {
        formData.append(`file${index + 1}`, file, file.name);
      });
    });

    return formData;
  }

  return JSON.stringify(Object.fromEntries(formData));
}

function initFileInputs() {
  const fileControlsList = document.querySelectorAll(
    `[${FILE_INPUT_DATA_ATTR}]`
  );

  fileControlsList.forEach((control) => {
    const fileInput = control.querySelector('input');

    document.addEventListener('dragenter', (e) => {
      fileInput.setAttribute(
        'data-drop-file',
        e.target === fileInput ? 'true' : 'false'
      );
    });

    fileInput.addEventListener('dragleave', () => {
      fileInput.setAttribute('data-drop-file', 'false');
    });

    fileInput.addEventListener(
      'change',
      (e) => {
        const inputFilesTextEl = control.querySelector(
          `[${FILE_INPUT_MESSAGE_DATA_ATTR}]`
        );

        inputFilesTextEl.innerHTML = '';

        const isValidFiles = validateFiles(control, fileInput.files);

        if (!isValidFiles) {
          e.preventDefault();

          fileInput.value = '';
        }

        const message =
          Array.from(fileInput.files).reduce(
            (result, file) => `${result}<p>${formatFileName(file.name)}</p>`,
            ''
          ) || '';

        inputFilesTextEl.innerHTML = String(message);
      },
      false
    );
  });
}

function validateFiles(control, filesList) {
  if (filesList.length > 3) {
    setControlValidationStyles(control, CONTROL_VALIDATION_STATUS.ERROR);
    setControlErrorMessage(control, 'data-max-count-error');

    return false;
  }

  let isValidFiles = true;

  Array.from(filesList).forEach((file) => {
    if (isValidFiles) {
      const maxSize = 2 * 1024 * 1024; // 2MB

      if (file.name.split('.').pop() !== 'pdf') {
        isValidFiles = false;

        setControlValidationStyles(control, CONTROL_VALIDATION_STATUS.ERROR);
        setControlErrorMessage(control, 'data-file-type-error');
      }

      if (file.size > maxSize) {
        isValidFiles = false;

        setControlValidationStyles(control, CONTROL_VALIDATION_STATUS.ERROR);
        setControlErrorMessage(control, 'data-max-size-error');
      }
    }
  });

  if (isValidFiles) {
    setControlValidationStyles(control, CONTROL_VALIDATION_STATUS.DEFAULT);
    setControlErrorMessage(control, '');
  }

  return isValidFiles;
}

function formatFileName(fileName) {
  if (!isString(fileName)) {
    return fileName;
  }

  const nameLengthStart = 30;
  const nameLengthEnd = 7;
  const nameLengthExtra = 3;

  if (fileName.length <= nameLengthStart + nameLengthEnd + nameLengthExtra) {
    return fileName;
  }

  return `${fileName.substring(0, nameLengthStart)}...${fileName.substring(
    fileName.length - nameLengthEnd
  )}`;
}
