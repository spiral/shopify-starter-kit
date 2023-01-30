import throttle from 'lodash/throttle';

const updateItemsOnScroll = () => {
  const titleAnimatedEls = document.querySelectorAll(
    `[data-product-spike-bag-reveal-scrolled-text] [data-scrolled-text]`
  );

  titleAnimatedEls.forEach((target) => {
    const windowHeight = window.innerHeight;
    const targetOffset = target.getBoundingClientRect().top;

    const isTargetInViewport = targetOffset < windowHeight && targetOffset > 0;

    if (isTargetInViewport) {
      const textGrowingSize = windowHeight / 3; // NOTE: size from viewport top to target with visible fulfill text

      if (windowHeight - targetOffset > textGrowingSize) {
        target.setAttribute('data-scrolled-text', 'visible');
      } else {
        target.setAttribute('data-scrolled-text', '');
      }
    }
  });
};

export const initProductSpikeBugReveal = () => {
  document.addEventListener('scroll', throttle(updateItemsOnScroll, 60));
};
