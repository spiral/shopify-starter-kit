import {
  unlockPageScroll,
  lockPageScroll,
} from '../../scripts/utils/pageScroll';

export function initVideoOverlay() {
  const overlayAttribute = '[data-site-overlay]';
  const videoAttribute = '[data-video-with-overlay]';
  const closeOverlayBtnAttribute = '[data-site-overlay-close-btn]';

  const video = document.querySelector(videoAttribute);
  const overlay = document.querySelector(overlayAttribute);
  const closeBtn = document.querySelector(closeOverlayBtnAttribute);

  initPopupOpen();
  initPopupClose();

  function initPopupOpen() {
    video.addEventListener('click', () => {
      overlay.setAttribute('data-site-overlay', 'active');
      lockPageScroll();

      const videoEl = document.createElement('video');

      videoEl.poster = video.setAttribute('poster', ' ') || '';
      videoEl.controls = true;
      videoEl.autoplay = true;

      const videoSourceEl = document.createElement('source');

      videoSourceEl.type = 'video/mp4';
      videoSourceEl.src = `${video
        .querySelector('source')
        .getAttribute('src')}`;
      videoEl.appendChild(videoSourceEl);
      overlay.appendChild(videoEl);
    });
  }

  function initPopupClose() {
    closeBtn.addEventListener('click', () => {
      overlay.setAttribute('data-site-overlay', '');
      overlay.querySelector('video').remove();

      unlockPageScroll();
    });
  }
}
