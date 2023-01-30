export const initProductSpikeBugOne = () => {
  const MAIN_IMAGE_WRAPPER_DATA_ATTR = 'data-product-spike-bag-one-main-images';

  const imageTargetEl = document.querySelector(
    `[${MAIN_IMAGE_WRAPPER_DATA_ATTR}]`
  );

  imageTargetEl.onpointerover = () => {
    imageTargetEl.setAttribute(MAIN_IMAGE_WRAPPER_DATA_ATTR, 'hovered');
  };

  imageTargetEl.onpointerleave = () => {
    imageTargetEl.setAttribute(MAIN_IMAGE_WRAPPER_DATA_ATTR, '');
  };
};
