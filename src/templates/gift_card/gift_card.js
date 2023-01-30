/**
 * Gift Card Template Script
 * ---------------------------------------------------
 * A file that contains scripts highly couple code
 * to the Gift Card template.
 */

const { $, QRCode } = window;

// eslint-disable-next-line func-names
(function () {
  const config = {
    qrCode: '#QrCode',
    printButton: '#PrintGiftCard',
    gift_cardCode: '.gift_card__code',
  };

  const $qrCode = $(config.qrCode);

  // eslint-disable-next-line no-new
  new QRCode($qrCode[0], {
    text: $qrCode.attr('data-identifier'),
    width: 120,
    height: 120,
  });

  $(config.printButton).on('click', () => {
    window.print();
  });

  // Auto-select gift card code on click, based on ID passed to the function
  $(config.gift_cardCode).on(
    'click',
    { element: 'gift_cardDigits' },
    selectText
  );

  function selectText(evt) {
    const text = document.getElementById(evt.data.element);
    let range = '';

    if (document.body.createTextRange) {
      range = document.body.createTextRange();
      range.moveToElementText(text);
      range.select();
    } else if (window.getSelection) {
      const selection = window.getSelection();

      range = document.createRange();
      range.selectNodeContents(text);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
})();
