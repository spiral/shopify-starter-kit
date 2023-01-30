// import Splide from '@splidejs/splide';

export const initCustomersHeaderSnippet = () => {
  const LINK_ACTIVE_DATA_ATTR = 'data-link-active';

  const sliderElement = document.querySelector('[data-account-mobile-slider]');

  if (sliderElement) {
    // const activeLinkCount = document.querySelector(`[${LINK_ACTIVE_DATA_ATTR}]`)
    //   ? document
    //       .querySelector(`[${LINK_ACTIVE_DATA_ATTR}]`)
    //       .getAttribute(LINK_ACTIVE_DATA_ATTR)
    //   : 3;
    // new Splide(sliderElement, {
    //   perMove: 1,
    //   fixedWidth: 'fit-content',
    //   gap: '24px',
    //   speed: 600,
    //   focus: 'center',
    //   start: activeLinkCount - 1,
    //   arrows: true,
    //   classes: {
    //     arrows: 'splide__arrows customers-header__nav--slider-arrows',
    //     arrow: 'splide__arrow customers-header__nav--slider-arrow',
    //   },
    //   arrowPath:
    //     'M7.87868 8.96967L0.90901 15.9393L1.96967 17L10 8.96967L1.96967 0.93934L0.909011 2L7.87868 8.96967Z',
    //   pagination: false,
    //   padding: {
    //     right: 24,
    //   },
    //   wheel: true,
    //   dots: false,
    // }).mount();
  }
};
