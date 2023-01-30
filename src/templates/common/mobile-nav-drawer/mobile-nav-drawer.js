const MOBILE_NAV_DRAWER_HOME_ATTR = 'data-mobile-nav-drawer-home';
const MOBILE_NAV_DRAWER_STEP_ATTR = 'data-mobile-nav-drawer-step';
const MOBILE_NAV_DRAWER_LINK_ATTR = 'data-mobile-nav-drawer-link';
const MOBILE_NAV_DRAWER_LINK_ID_ATTR = 'data-mobile-nav-drawer-link-id';
const MOBILE_NAV_DRAWER_TYPE_ATTR = 'data-mobile-nav-drawer-type';

export const initMobileNavDrawer = () => {
  const linkList = Array.from(
    document.querySelectorAll(`[${MOBILE_NAV_DRAWER_LINK_ATTR}]`) || []
  );

  const stepItems = Array.from(
    document.querySelectorAll(`[${MOBILE_NAV_DRAWER_STEP_ATTR}]`) || []
  );

  linkList.forEach((currentLink) => {
    const currentLinkId = currentLink.getAttribute(
      MOBILE_NAV_DRAWER_LINK_ID_ATTR
    );

    currentLink.addEventListener('click', () => {
      setNavType('steps');

      const relatedStep = stepItems.find(
        (stepItem) =>
          stepItem?.getAttribute(MOBILE_NAV_DRAWER_LINK_ID_ATTR) ===
          currentLinkId
      );

      relatedStep?.setAttribute(MOBILE_NAV_DRAWER_STEP_ATTR, 'active');
    });
  });

  const homeButtonsList = Array.from(
    document.querySelectorAll(`[${MOBILE_NAV_DRAWER_HOME_ATTR}]`) || []
  );

  homeButtonsList.forEach((homeButton) => {
    homeButton.addEventListener('click', () => {
      setNavType('main');

      stepItems.forEach((stepItem) => {
        stepItem.setAttribute(MOBILE_NAV_DRAWER_STEP_ATTR, '');
      });
    });
  });

  function setNavType(attrValue) {
    const navBlocksParent = document.querySelector(
      `[${MOBILE_NAV_DRAWER_TYPE_ATTR}]`
    );

    navBlocksParent?.setAttribute(MOBILE_NAV_DRAWER_TYPE_ATTR, attrValue);
  }
};
