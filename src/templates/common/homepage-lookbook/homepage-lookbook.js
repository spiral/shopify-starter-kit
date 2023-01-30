// import Splide from '@splidejs/splide';

export const initHomepageLookbook = () => {
  const lookbookSliders = document.querySelectorAll(
    ' [data-homepage-lookbook-slider]'
  );

  if (lookbookSliders.length > 0) {
    lookbookSliders.forEach((slider) => {
      // new Splide(slider, {
      //   type: 'loop',
      //   rewind: true,
      //   speed: 800,
      //   interval: 5000,
      //   pagination: false,
      //   perMove: 1,
      //   perPage: 1,
      //   arrows: false,
      //   drag: true,
      //   autoplay: true,
      // }).mount();
    });
  }
};
