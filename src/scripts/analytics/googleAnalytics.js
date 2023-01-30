export const EVENTS = {
  ADD_TO_CARD: 'add_to_cart',
  VIEW_ITEM: 'view_item',
  NEWSLETTER_SIGNUP: 'newsletter_signup',
  CONTACT_US: 'contact_us',
  LOGIN: 'login',
  LOGGED_IN: 'logged_in',
  REGISTER: 'register',
  CHECKOUT: 'begin_checkout',
  NOTIFY_ME: 'notify_me',
  REMOVE_FROM_CART: 'remove_from_cart',
};

export const trackEvent = (eventName, options) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...options,
  });

  console.info(
    `dataLayer last event: ${JSON.stringify(
      window.dataLayer[window.dataLayer.length - 1]
    )}`
  );
};
