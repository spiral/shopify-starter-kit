const HEADER_ITEM_ID_ATTR = 'data-header-submenu-id';
const HEADER_NAV_ITEM_ATTR = 'data-header-nav-item';
const HEADER_SUBMENU_ATTR = 'data-header-submenu';

export const initHeader = () => {
  const navItemList = Array.from(
    document.querySelectorAll(`[${HEADER_NAV_ITEM_ATTR}]`) || []
  );

  const navItemIds = navItemList.map((item) =>
    item.getAttribute(HEADER_ITEM_ID_ATTR)
  );

  navItemList.forEach((actionItem) => {
    const actionItemId = actionItem.getAttribute(HEADER_ITEM_ID_ATTR);

    actionItem.addEventListener('click', () => {
      navItemIds.forEach((itemId) => {
        const targetStatus = itemId === actionItemId ? 'active' : '';

        updateItemStatus(HEADER_NAV_ITEM_ATTR, itemId, targetStatus);
        updateItemStatus(HEADER_SUBMENU_ATTR, itemId, targetStatus);
      });
    });
  });

  function updateItemStatus(dataAttr, itemId, activeStatus) {
    const nodeList = Array.from(document.querySelectorAll(`[${dataAttr}]`));

    const targetItem =
      nodeList.find(
        (node) => node?.getAttribute(HEADER_ITEM_ID_ATTR) === itemId
      ) || null;

    if (targetItem) {
      const isActiveItem = Boolean(targetItem.getAttribute(dataAttr)) || false;

      targetItem.setAttribute(dataAttr, isActiveItem ? '' : activeStatus);
    }
  }
};
