import { GoogleAnalytics } from '../../scripts/analytics/index';
import { SHOPIFY_REDIRECT_FROM } from '../../scripts/utils/constants';

export const initNewsletterForm = () => {
  // NOTE: Form submit button is not available for use with addEventListener
  window.addEventListener('submit', ({ target }) => {
    const isNewsletterForm = target.classList.contains('newsletter-form__form');

    if (isNewsletterForm) {
      GoogleAnalytics.trackEvent(GoogleAnalytics.EVENTS.NEWSLETTER_SIGNUP);

      if (window.localStorage) {
        const shopifyRoot =
          window.Shopify.routes.root.length === '/'
            ? window.Shopify.routes.root
            : window.Shopify.routes.root.slice(
                0,
                window.Shopify.routes.root.length - 1
              );

        window.localStorage.setItem(SHOPIFY_REDIRECT_FROM, shopifyRoot);
      }
    }
  });
};
