import intersection from 'lodash/intersection';
import uniq from 'lodash/uniq';
import isString from 'lodash/isString';
import union from 'lodash/union';

const HIDDEN_CUSTOM_OPTION_KEY = '_hide';
const ORDER_CUSTOM_OPTION_KEY = '_order';
const SOLD_OUT_CUSTOM_OPTION_KEY = '_soldout';

const makeOptionString = (key = '', value = '') => {
  if (!isString(key) || !isString(value)) {
    return '';
  }

  return `${key}: ${value}`;
};

const parseOptionString = (optionString) => {
  if (
    !optionString ||
    !isString(optionString) ||
    !optionString.includes(': ')
  ) {
    return [];
  }

  return optionString.split(': ');
};

const filterUtilitiesOptionKey = (key) => isString(key) && key[0] !== '_';

const makeVariantsOptionsStringList = (variantOptions, productOptions) =>
  variantOptions.map((value, index) =>
    makeOptionString(productOptions[index], value)
  );

const getVariantsIdsByOptionString = (
  optionString,
  { variants, options: productOptions }
) => {
  const [optionKey, optionValue] = parseOptionString(optionString);
  const optionIndex = productOptions.findIndex((key) => key === optionKey);

  return Object.values(variants)
    .filter(({ options }) => options[optionIndex] === optionValue)
    .map(({ id }) => id);
};

const getVariantsIdsByOptionStringList = (optionStringList, config) => {
  const variantIds = optionStringList.map((optionString) =>
    getVariantsIdsByOptionString(optionString, config)
  );

  return uniq(variantIds.flat());
};

const isArraysWithoutIntersection = (stringList1 = [], stringsList2 = []) => {
  if (!Array.isArray(stringList1) || !Array.isArray(stringsList2)) {
    return true;
  }

  if (stringList1.length === 0 || stringsList2.length === 0) {
    return true;
  }

  return intersection(stringList1, stringsList2).length === 0;
};

const normalizeVariants = (_config, isCustomOnly = false) => {
  const customOptionsConfig = _config?.metafields?.customOptionsConfig || {};
  const hiddenOptionStringList =
    customOptionsConfig[HIDDEN_CUSTOM_OPTION_KEY] || [];

  const customOptionStringList =
    Object.entries(customOptionsConfig)
      .filter(([key]) => filterUtilitiesOptionKey(key))
      .map((entry) => (Array.isArray(entry[1]) ? entry[1] : null))
      .filter(Boolean)
      .flat() || [];

  const hiddenVariantIds = getVariantsIdsByOptionStringList(
    hiddenOptionStringList,
    _config
  );

  const customVariantIds = getVariantsIdsByOptionStringList(
    customOptionStringList,
    _config
  );

  return Object.values(_config.variants)
    .filter((variant) => !hiddenVariantIds.includes(variant.id))
    .filter((variant) => {
      if (isCustomOnly === true) {
        return customVariantIds.includes(variant.id);
      }
      return true;
    })
    .reduce((acc, variant) => {
      acc[variant.id] = variant;

      return acc;
    }, {});
};

// TODO: need to refactor normalizeCustomOptions without normalizeVariants
const normalizeCustomOptions = (_config) => {
  const customVariantStringOptionsList = uniq(
    Object.values(normalizeVariants(_config, true))
      .map(({ options }) =>
        makeVariantsOptionsStringList(options, _config.options)
      )
      .flat()
  );

  const customOptionsConfig = _config?.metafields?.customOptionsConfig || {};
  const hiddenOptionStringList =
    customOptionsConfig[HIDDEN_CUSTOM_OPTION_KEY] || [];

  return Object.entries(customOptionsConfig)
    .filter(([key]) => filterUtilitiesOptionKey(key))
    .map(([key, values]) => [
      key,
      values.filter((v) => !hiddenOptionStringList.includes(v)),
    ])
    .filter((entry) => entry[1].length)
    .reduce((res, [key, values]) => {
      if (
        !isArraysWithoutIntersection(customVariantStringOptionsList, values)
      ) {
        res[key] = values;
      }
      return res;
    }, {});
};

const makeVariantsOptionsConfig = (_config) => {
  const customOptions = normalizeCustomOptions(_config);
  const customOptionsList = Object.values(customOptions).flat();

  const filteredVariantOption = {};

  Object.values(normalizeVariants(_config))
    .map(({ options }) =>
      makeVariantsOptionsStringList(options, _config.options)
    )
    .map((optionStrings) =>
      optionStrings.filter((v) => !customOptionsList.includes(v))
    )
    .forEach((optionStrings) => {
      optionStrings.forEach((optionString) => {
        const [key, value] = parseOptionString(optionString);

        if (!filteredVariantOption[key]) {
          filteredVariantOption[key] = [value];
        } else if (!filteredVariantOption[key].includes(value)) {
          filteredVariantOption[key].push(value);
        }
      });
    });

  const availableCustomOptions = Object.entries(customOptions).reduce(
    (res, [key, values]) => {
      res[key] = values.map((v) => parseOptionString(v)[1]);

      return res;
    },
    {}
  );

  return {
    ...filteredVariantOption,
    ...availableCustomOptions,
  };
};

export const calculateProductImages = (_configMedia) => {
  const mediaMobilePopup = [];
  const mediaDesktopPopup = [];
  const mediaMobile = [];
  const mediaDesktop = [];

  if (!Array.isArray(_configMedia)) {
    return {
      mediaMobilePopup,
      mediaDesktopPopup,
      mediaMobile,
      mediaDesktop,
    };
  }

  _configMedia.forEach((media) => {
    const isPopupMedia = (media?.alt || '').includes('GREAT_QUALITY');
    const isMobileMedia = (media?.alt || '').includes('MOBILE');

    if (isPopupMedia && isMobileMedia) {
      mediaMobilePopup.push(media);
    } else if (isPopupMedia) {
      mediaDesktopPopup.push(media);
    } else if (isMobileMedia) {
      mediaMobile.push(media);
    } else {
      mediaDesktop.push(media);
    }
  });

  return {
    mediaMobilePopup,
    mediaDesktopPopup,
    mediaMobile,
    mediaDesktop,
  };
};

const makeKeyOrders = (_config) => {
  const visibleKeyList = Object.keys(makeVariantsOptionsConfig(_config)).sort();

  const customOrder =
    _config?.metafields?.customOptionsConfig?.[ORDER_CUSTOM_OPTION_KEY] || [];

  if (customOrder.length === 0) {
    return visibleKeyList;
  }

  const variantOptionsOrder = intersection(customOrder, visibleKeyList);

  return union(variantOptionsOrder, visibleKeyList);
};

export const normalizeProductConfig = (_config) => ({
  ..._config,
  metafields: {
    ..._config.metafields,
    customOptionsConfig: normalizeCustomOptions(_config),
  },
  variants: normalizeVariants(_config),
  optionsKeyOrder: makeKeyOrders(_config),
  forceSoldOutOptions:
    _config?.metafields?.customOptionsConfig?.[SOLD_OUT_CUSTOM_OPTION_KEY] ||
    [],
});

export {
  HIDDEN_CUSTOM_OPTION_KEY,
  ORDER_CUSTOM_OPTION_KEY,
  SOLD_OUT_CUSTOM_OPTION_KEY,
  makeOptionString,
  parseOptionString,
  makeVariantsOptionsConfig,
  normalizeVariants,
  makeKeyOrders,
  normalizeCustomOptions,
  makeVariantsOptionsStringList,
};
