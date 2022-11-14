document.addEventListener('shopify:block:select', (event) => {
  const blockSelectedIsSlide =
    event.target.classList.contains('slideshow__slide');

  if (!blockSelectedIsSlide) {
    return;
  }

  const parentSlideshowComponent = event.target.closest('slideshow-component');

  parentSlideshowComponent.pause();

  setTimeout(() => {
    parentSlideshowComponent.slider.scrollTo({
      left: event.target.offsetLeft,
    });
  }, 200);
});

document.addEventListener('shopify:block:deselect', (event) => {
  const blockDeselectedIsSlide =
    event.target.classList.contains('slideshow__slide');

  if (!blockDeselectedIsSlide) {
    return;
  }
  const parentSlideshowComponent = event.target.closest('slideshow-component');

  if (parentSlideshowComponent.autoplayButtonIsSetToPlay)
    parentSlideshowComponent.play();
});

document.addEventListener('shopify:section:load', () => {
  const zoomOnHoverScript = document.querySelector('[id^=EnableZoomOnHover]');

  if (zoomOnHoverScript) {
    const newScriptTag = document.createElement('script');

    newScriptTag.src = zoomOnHoverScript.src;
    zoomOnHoverScript.parentNode.replaceChild(newScriptTag, zoomOnHoverScript);
  }
});
