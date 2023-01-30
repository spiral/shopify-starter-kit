// import Splide from '@splidejs/splide';

export const initInlineImageSlider = () => {
  if (document.querySelector('[data-inline-images-slider]')) {
    document.querySelectorAll('[data-inline-images-slider]').forEach((item) => {
      // new Splide(item, {
      //   type: 'loop',
      //   perPage: 1,
      //   speed: 600,
      //   rewind: true,
      //   arrows: false,
      //   pagination: false,
      //   padding: 76,
      //   gap: 14,
      // }).mount();
    });
  }
};
