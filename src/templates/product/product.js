import './product.scss';
import { runProductBase } from '../../snippets/product-base/product-base';
import { runProductMultipage } from '../../snippets/product-multipage/product-multipage';
import {
  CUSTOM_EVENTS,
  VARIANT_SEARCH_PARAM,
} from '../../scripts/utils/constants';
import { makeOptionString } from '../../scripts/utils/productBaseHelpers';
import { initProductLookbook } from './product-look-book/product-look-book';

const initProductVariantContent = () => {
  updateActiveVariantBlock();

  document.addEventListener(
    CUSTOM_EVENTS.BROWSER_HISTORY_REPLACE_STATE,
    updateActiveVariantBlock
  );

  window.addEventListener('popstate', updateActiveVariantBlock);
};

const createVariantIdOptionStringsMap = () => {
  // eslint-disable-next-line no-unsafe-optional-chaining
  const { options = [], variants = {} } = window?.productConfig;

  const result = {};

  Object.values(variants).forEach((variant) => {
    result[variant.id] = variant.options.map((o, index) =>
      makeOptionString(options[index], o)
    );
  });

  return result;
};

// NOTE: need to call once
const variantIdsOptionsStringMap = createVariantIdOptionStringsMap();

const calVariantsIdsByOptionStrings = (stringList) => {
  const relatedIds = [];

  stringList.forEach((optionString) =>
    Object.entries(variantIdsOptionsStringMap)
      .filter((entry) => entry[1].includes(optionString))
      .forEach(([key]) => {
        if (!relatedIds.includes(key)) {
          relatedIds.push(key);
        }
      })
  );

  return relatedIds;
};

function updateActiveVariantBlock() {
  const VARIANT_BLOCK_DATA_ATTR = 'data-variant-ids';
  const ACTIVE_BLOCK_DATA_ATTR = 'data-variant-id-active';
  const DEFAULT_BLOCK_DATA_ATTR = 'data-variant-id-default';

  const activeVariantId = new URLSearchParams(window.location.search).get(
    VARIANT_SEARCH_PARAM
  );

  [...document.querySelectorAll(`[${VARIANT_BLOCK_DATA_ATTR}]`)].forEach(
    (el) => {
      const variantIds = calVariantsIdsByOptionStrings(
        el.getAttribute(VARIANT_BLOCK_DATA_ATTR).split(',')
      );

      const isVisibleVariant = activeVariantId
        ? variantIds.includes(activeVariantId)
        : el.hasAttribute(DEFAULT_BLOCK_DATA_ATTR);

      el.setAttribute(ACTIVE_BLOCK_DATA_ATTR, String(isVisibleVariant));
    }
  );
}

runProductBase();
runProductMultipage();

window.addEventListener('DOMContentLoaded', () => {
  // NOTE: product content sections
  initProductVariantContent();
  initProductLookbook();
});
