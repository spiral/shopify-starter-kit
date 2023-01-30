import { GoogleAnalytics } from '../../../scripts/analytics/index';

export const initSayshCollectiveForm = () => {
  window.addEventListener('load', () => {
    // NOTE: Klaviyo form doesn't use submit button
    const sectionsFormsButtons = document.querySelectorAll(
      '[data-snippet="saysh-collective-klaviyo-form"] form [type="button"]'
    );

    sectionsFormsButtons.forEach((submitButton) => {
      submitButton.addEventListener('click', () => {
        GoogleAnalytics.trackEvent(GoogleAnalytics.EVENTS.NEWSLETTER_SIGNUP);
      });
    });
  });
};
