import { toCanvas as qrToCanvas } from 'qrcode';

/**
 * Gift Card Template Script
 * --------------------------------------
 * A file that contains scripts highly
 * couple code to the Gift Card template.
 */

const QR_CODE_CANVAS_SELECTOR = '[data-gift-card-qr]';
const PRINT_BUTTON_SELECTOR = '[data-gift-card-print]';
const GIFT_CARD_CODE_SELECTOR = '[data-gift-card-digits]';

// This is the QR code that allows customers to use at a POS
document.querySelectorAll(QR_CODE_CANVAS_SELECTOR).forEach((element) => {
  qrToCanvas(element, element.dataset.identifier);
});

document.querySelectorAll(PRINT_BUTTON_SELECTOR).forEach((element) => {
  element.addEventListener('click', () => {
    window.print();
  });
});

// Auto-select gift card code on click, based on ID passed to the function
document.querySelectorAll(GIFT_CARD_CODE_SELECTOR).forEach((element) => {
  element.addEventListener('click', (evt) => {
    const selection = window.getSelection();
    const range = document.createRange();

    range.selectNodeContents(evt.target);
    selection.removeAllRanges();
    selection.addRange(range);
  });
});
