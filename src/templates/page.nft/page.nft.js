import './page.nft.scss';
import throttle from 'lodash/throttle';
import { initVideoOverlay } from '../../snippets/site-overlay/site-overlay';

document.onscroll = throttle(scrollCallback, 60);

const showOnVisibleAttr = 'data-move-on-scroll';
const showOnVisibleTargetAttr = 'data-move-on-scroll-target';

const scrolledItemsList = document.querySelectorAll(`[${showOnVisibleAttr}]`);

const updateItemsOnScroll = () => {
  scrolledItemsList.forEach((item) => {
    const parentItemOffset = item
      .closest(`[${showOnVisibleTargetAttr}]`)
      .getBoundingClientRect().top;

    // const itemHeight = item.offsetHeight;
    const documentScroll = window.scrollY;

    // for absolute position items get parent offset
    const itemTopHeight = Math.ceil(
      parentItemOffset + documentScroll - item.clientHeight / 2
    );

    const scrollMovePercentage =
      Math.ceil((documentScroll / itemTopHeight) * 100) / 100;

    const paramOffset = item.getAttribute(showOnVisibleAttr);
    const moveOffset = Math.ceil(paramOffset * (scrollMovePercentage - 1));

    // eslint-disable-next-line no-param-reassign
    item.style.transform = `translateY(${moveOffset}px)`;
  });
};

function scrollCallback() {
  updateItemsOnScroll();
}

initVideoOverlay();
