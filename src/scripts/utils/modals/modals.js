import { lockPageScroll, unlockPageScroll } from '../pageScroll';

const MODAL_DATA_ATTR = 'data-modal';
const MODALS_LAYER_DATA_ATTR = 'data-modals-layout';
const MODAL_OPEN_DATA_ATTR = `data-modal-open`;
const MODAL_CLOSE_DATA_ATTR = `data-modal-close`;
const MODALS_LAYER_ID_DATA_ATTR = 'data-modals-layer-id';

let modalsIdsInUse = [];

export const initModals = () => {
  const modalsList = [...document.querySelectorAll(`[${MODAL_DATA_ATTR}]`)];

  modalsList.forEach((modal) => {
    const modalId = modal.getAttribute(MODAL_DATA_ATTR);

    initModal(modalId);
  });

  return {};
};

function initModal(modalId) {
  const openModalControls = document.querySelectorAll(
    `[${MODAL_OPEN_DATA_ATTR}=${modalId}]`
  );

  openModalControls.forEach((el) => {
    el.addEventListener('click', () => {
      openModal(modalId);
    });
  });

  const closeModalControls = document.querySelectorAll(
    `[${MODAL_CLOSE_DATA_ATTR}=${modalId}]`
  );

  closeModalControls.forEach((el) => {
    el.addEventListener('click', () => {
      closeModal(modalId);
    });
  });

  const closeModalsLayout = document.querySelector(
    `[${MODALS_LAYER_DATA_ATTR}]`
  );

  closeModalsLayout.addEventListener('click', ({ target }) => {
    if (target.hasAttribute(MODALS_LAYER_DATA_ATTR)) {
      modalsIdsInUse.forEach(closeModal);
    }
  });
}

function openModal(id) {
  document
    .querySelector(`[${MODALS_LAYER_ID_DATA_ATTR}]`)
    .setAttribute(MODALS_LAYER_ID_DATA_ATTR, id);

  if (modalsIdsInUse.length === 0) {
    lockPageScroll();

    modalsIdsInUse[0] = id;

    document
      .querySelector(`[${MODALS_LAYER_DATA_ATTR}]`)
      .setAttribute(MODALS_LAYER_DATA_ATTR, 'open');
  }
}

function closeModal(id) {
  if (modalsIdsInUse.length > 0 && modalsIdsInUse.includes(id)) {
    modalsIdsInUse = modalsIdsInUse.filter((_modalId) => id !== _modalId);

    document
      .querySelector(`[${MODALS_LAYER_ID_DATA_ATTR}]`)
      .setAttribute(MODALS_LAYER_ID_DATA_ATTR, '');

    if (!modalsIdsInUse.length) {
      unlockPageScroll();

      document
        .querySelector(`[${MODALS_LAYER_DATA_ATTR}]`)
        .setAttribute(MODALS_LAYER_DATA_ATTR, '');
    }
  }
}
