// import Splide from '@splidejs/splide';
import '../../../scripts/domPolyfills/closest';

export const initProductLookbook = () => {
  const LOOKBOOK_SLIDER_DATA_ATTR = 'data-product-lookbook-slider';
  const LOOKBOOK_BLOCK_ID_DATA_ATTR = 'data-product-lookbook-block-id';
  const LOOKBOOK_THUMBNAIL_INDEX_DATA_ATTR =
    'data-product-lookbook-thumbnail-index';
  const BLOCK_ID_SLIDER_MAP = {};

  const lookbookSliders =
    document.querySelectorAll(`[${LOOKBOOK_SLIDER_DATA_ATTR}]`) || [];

  lookbookSliders.forEach((slider) => {
    const blockId = slider.getAttribute(LOOKBOOK_BLOCK_ID_DATA_ATTR) || null;

    // BLOCK_ID_SLIDER_MAP[blockId] = new Splide(slider, {
    //   type: 'fade',
    //   speed: 800,
    //   rewind: true,
    //   interval: 5000,
    //   pauseOnFocus: false,
    //   pagination: false,
    //   perMove: 1,
    //   arrows: false,
    //   drag: false,
    //   autoplay: true,
    // });
    //
    // BLOCK_ID_SLIDER_MAP[blockId].mount();
  });

  const lookbookThumbnails =
    document.querySelectorAll(`[${LOOKBOOK_THUMBNAIL_INDEX_DATA_ATTR}]`) || [];

  lookbookThumbnails.forEach((el) => {
    const blockId = el
      ?.closest(`[${LOOKBOOK_BLOCK_ID_DATA_ATTR}]`)
      ?.getAttribute(LOOKBOOK_BLOCK_ID_DATA_ATTR);

    const slideIndex = Number(
      el.getAttribute(LOOKBOOK_THUMBNAIL_INDEX_DATA_ATTR) || ''
    );

    el.addEventListener('click', () => {
      BLOCK_ID_SLIDER_MAP[blockId]?.go(slideIndex);
    });
  });
};
