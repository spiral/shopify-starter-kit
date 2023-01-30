const SCROLL_DISABLE_DATA_ATTR = 'data-disable-scroll';

export const lockPageScroll = () => {
  const { body } = window.document;

  if (!body || body.hasAttribute(SCROLL_DISABLE_DATA_ATTR)) {
    return;
  }

  body.setAttribute(SCROLL_DISABLE_DATA_ATTR, '');
};

export const unlockPageScroll = () => {
  const { body } = window.document;

  if (!body || !body.hasAttribute(SCROLL_DISABLE_DATA_ATTR)) {
    return;
  }

  body.removeAttribute(SCROLL_DISABLE_DATA_ATTR);
};
