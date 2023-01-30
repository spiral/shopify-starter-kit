import {
  HIDDEN_CUSTOM_OPTION_KEY,
  ORDER_CUSTOM_OPTION_KEY,
  SOLD_OUT_CUSTOM_OPTION_KEY,
  makeOptionString,
  parseOptionString,
  normalizeProductConfig,
  makeVariantsOptionsConfig,
  makeKeyOrders,
  normalizeCustomOptions,
  normalizeVariants,
  calculateProductImages,
} from './productBaseHelpers';
import productMock from '../mocks/productConfig.json';

// TODO: add tests for makeVariantsOptionsStringList

const copyTestConfig = (config) => JSON.parse(JSON.stringify(config));

// *** NOTE: how to option cell are built description *** //
// Prod. order: ['Color', 'Size', 'Type']
//
// Variant 1: ['Red', 'Small', 'Light'],
// Variant 2: ['Red', 'Small', 'Hard'],
// Variant 3: ['Red', 'Large', 'Hard'],
// Variant 4: ['Blue', 'Small', 'Hard'],
//
// .

// *** parseOptionString *** //

describe('makeOptionString test', () => {
  it('incorrect params cases', () => {
    expect(makeOptionString(1, 2)).toBe('');
    expect(makeOptionString('test', 2)).toBe('');
    expect(makeOptionString([], {})).toBe('');
    expect(makeOptionString(null, null)).toBe('');
    expect(makeOptionString(String, '-')).toBe('');
    expect(makeOptionString('+', String)).toBe('');
    expect(makeOptionString(/test/, 'Value')).toBe('');
    expect(makeOptionString(NaN, 'Value')).toBe('');
  });

  it('correct params cases', () => {
    expect(makeOptionString('key', 'value')).toBe('key: value');
    expect(makeOptionString('Key', 'Value')).toBe('Key: Value');
    expect(makeOptionString('Key', '1')).toBe('Key: 1');
    expect(makeOptionString('2', 'Value')).toBe('2: Value');
  });
});

// *** parseOptionString *** //

describe('parseOptionString test', () => {
  it('incorrect params', () => {
    expect(parseOptionString(1, 2)).toEqual([]);
    expect(parseOptionString('test', 2)).toEqual([]);
    expect(parseOptionString([], {})).toEqual([]);
    expect(parseOptionString(null, null)).toEqual([]);
    expect(parseOptionString(String, '-')).toEqual([]);
    expect(parseOptionString(String(), '-')).toEqual([]);
    expect(parseOptionString('+', String)).toEqual([]);
    expect(parseOptionString(/test/, /test2/)).toEqual([]);
    expect(parseOptionString(NaN, 'Value')).toEqual([]);
  });

  it('correct params', () => {
    expect(parseOptionString('Key: Value')).toEqual(['Key', 'Value']);
    expect(parseOptionString('Key: Value: More: Arguments')).toEqual([
      'Key',
      'Value',
      'More',
      'Arguments',
    ]);
  });
});

// *** makeVariantsOptionsConfig *** //

describe('makeVariantsOptionsConfig', () => {
  let productConfig;

  beforeEach(() => {
    productConfig = copyTestConfig(productMock);
  });

  afterEach(() => {
    productConfig = null;
  });

  it('default', () => {
    expect(makeVariantsOptionsConfig(productConfig)).toStrictEqual({
      Color: ['Red', 'Blue'],
      Size: ['Small', 'Large'],
      Type: ['Light', 'Hard'],
    });
  });

  it('hidden option case 1', () => {
    productConfig.metafields.customOptionsConfig = {
      [HIDDEN_CUSTOM_OPTION_KEY]: ['Size: Large'],
    };

    expect(makeVariantsOptionsConfig(productConfig)).toStrictEqual({
      Color: ['Red', 'Blue'],
      Size: ['Small'],
      Type: ['Light', 'Hard'],
    });
  });

  it('hidden option case 2', () => {
    productConfig.metafields.customOptionsConfig = {
      [HIDDEN_CUSTOM_OPTION_KEY]: ['Type: Hard'],
    };

    expect(makeVariantsOptionsConfig(productConfig)).toStrictEqual({
      Color: ['Red'],
      Size: ['Small'],
      Type: ['Light'],
    });
  });

  it('hidden option case 3', () => {
    productConfig.metafields.customOptionsConfig = {
      [HIDDEN_CUSTOM_OPTION_KEY]: ['Color: Red'],
    };

    expect(makeVariantsOptionsConfig(productConfig)).toStrictEqual({
      Color: ['Blue'],
      Size: ['Small'],
      Type: ['Hard'],
    });
  });

  it('hidden option case 4', () => {
    productConfig.metafields.customOptionsConfig = {
      [HIDDEN_CUSTOM_OPTION_KEY]: ['Type: Hard', 'Color: Red'],
    };

    expect(makeVariantsOptionsConfig(productConfig)).toStrictEqual({});
  });

  it('hidden custom option case 1', () => {
    productConfig.metafields.customOptionsConfig = {
      [HIDDEN_CUSTOM_OPTION_KEY]: ['Size: Large'],
      Custom: ['Size: Large'],
    };

    expect(makeVariantsOptionsConfig(productConfig)).toStrictEqual({
      Color: ['Red', 'Blue'],
      Size: ['Small'],
      Type: ['Light', 'Hard'],
    });
  });

  it('custom option case 1', () => {
    productConfig.metafields.customOptionsConfig = {
      Custom: ['Size: Large'],
    };

    expect(makeVariantsOptionsConfig(productConfig)).toStrictEqual({
      Color: ['Red', 'Blue'],
      Custom: ['Large'],
      Size: ['Small'],
      Type: ['Light', 'Hard'],
    });
  });

  it('custom option case 2', () => {
    productConfig.metafields.customOptionsConfig = {
      Custom: ['Size: Small'],
      Extra: ['Type: Hard'],
    };

    expect(makeVariantsOptionsConfig(productConfig)).toStrictEqual({
      Color: ['Red', 'Blue'],
      Custom: ['Small'],
      Extra: ['Hard'],
      Size: ['Large'],
      Type: ['Light'],
    });
  });

  it('hidden custom option case 3', () => {
    productConfig.metafields.customOptionsConfig = {
      [HIDDEN_CUSTOM_OPTION_KEY]: ['Size: Large'],
      Custom: ['Size: Large', 'Size: Small'],
    };

    expect(makeVariantsOptionsConfig(productConfig)).toStrictEqual({
      Color: ['Red', 'Blue'],
      Custom: ['Small'],
      Type: ['Light', 'Hard'],
    });
  });

  it('only custom option case 1', () => {
    productConfig.metafields.customOptionsConfig = {
      Custom: ['Size: Large'],
    };

    expect(makeVariantsOptionsConfig(productConfig, true)).toStrictEqual({
      Color: ['Red', 'Blue'],
      Custom: ['Large'],
      Size: ['Small'],
      Type: ['Light', 'Hard'],
    });
  });

  it('only custom option case 2', () => {
    productConfig.metafields.customOptionsConfig = {
      Custom: ['Size: Small'],
      Extra: ['Type: Hard'],
    };

    expect(makeVariantsOptionsConfig(productConfig, true)).toStrictEqual({
      Color: ['Red', 'Blue'],
      Custom: ['Small'],
      Extra: ['Hard'],
      Size: ['Large'],
      Type: ['Light'],
    });
  });
});

// *** normalizeVariants *** //

describe('normalizeVariants test', () => {
  let productConfig;

  beforeEach(() => {
    productConfig = copyTestConfig(productMock);
  });

  afterEach(() => {
    productConfig = null;
  });

  it('default', () => {
    expect(Object.values(normalizeVariants(productConfig)).length).toEqual(
      Object.values(productConfig.variants).length
    );
  });

  it('hidden option case 1', () => {
    productConfig.metafields.customOptionsConfig = {
      [HIDDEN_CUSTOM_OPTION_KEY]: ['Size: Large'],
    };

    expect(Object.values(normalizeVariants(productConfig)).length).toEqual(
      Object.values(productConfig.variants).length - 1
    );
  });

  it('hidden option case 2', () => {
    productConfig.metafields.customOptionsConfig = {
      [HIDDEN_CUSTOM_OPTION_KEY]: ['Color: Red', 'Color: Blue'],
    };

    expect(Object.values(normalizeVariants(productConfig)).length).toEqual(0);
  });

  it('custom incorrect options case 1', () => {
    productConfig.metafields.customOptionsConfig = {
      Custom: 'Color: Value1',
    };

    expect(Object.values(normalizeVariants(productConfig)).length).toEqual(
      Object.values(productMock.variants).length
    );
  });

  it('custom options case 1', () => {
    productConfig.metafields.customOptionsConfig = {
      Custom: ['Color: Value1'],
    };

    expect(Object.values(normalizeVariants(productConfig)).length).toEqual(
      Object.values(productMock.variants).length
    );
  });

  it('hidden and custom options case 1', () => {
    productConfig.metafields.customOptionsConfig = {
      Custom: ['Type: Light'],
      [HIDDEN_CUSTOM_OPTION_KEY]: ['Size: Large'],
    };

    expect(Object.values(normalizeVariants(productConfig)).length).toEqual(
      Object.values(productConfig.variants).length - 1
    );
  });

  it('incorrect option `isCustomOnly: true` case 1', () => {
    productConfig.metafields.customOptionsConfig = {
      Custom: 'Color: Red',
    };

    expect(
      Object.values(normalizeVariants(productConfig, true)).length
    ).toEqual(0);
  });

  it('incorrect option `isCustomOnly: true` case 2', () => {
    productConfig.metafields.customOptionsConfig = {
      Custom: 'Size: Small',
      New: 'Type: Light',
    };

    expect(
      Object.values(normalizeVariants(productConfig, true)).length
    ).toEqual(0);
  });

  it('`isCustomOnly: true` case 1', () => {
    productConfig.metafields.customOptionsConfig = {
      Custom: ['Color: Red'],
    };

    expect(
      Object.values(normalizeVariants(productConfig, true)).length
    ).toEqual(Object.values(productConfig.variants).length - 1);
  });

  it('`isCustomOnly: true` case 2', () => {
    productConfig.metafields.customOptionsConfig = {
      Custom: ['Size: Small'],
    };

    expect(
      Object.values(normalizeVariants(productConfig, true)).length
    ).toEqual(Object.values(productConfig.variants).length - 1);
  });

  it('`isCustomOnly: true` case 3', () => {
    productConfig.metafields.customOptionsConfig = {
      Custom: ['Size: Small'],
      New: ['Type: Light'],
    };

    expect(
      Object.values(normalizeVariants(productConfig, true)).length
    ).toEqual(Object.values(productConfig.variants).length - 1);
  });

  it('hidden option with `isCustomOnly: true` case 1', () => {
    productConfig.metafields.customOptionsConfig = {
      Custom: ['Size: Small'],
      [HIDDEN_CUSTOM_OPTION_KEY]: ['Size: Large'],
    };

    expect(
      Object.values(normalizeVariants(productConfig, true)).length
    ).toEqual(Object.values(productConfig.variants).length - 1);
  });

  it('hidden option with `isCustomOnly: true` case 2', () => {
    productConfig.metafields.customOptionsConfig = {
      Custom: ['Color: Red'],
      [HIDDEN_CUSTOM_OPTION_KEY]: ['Size: Large'],
    };

    expect(
      Object.values(normalizeVariants(productConfig, true)).length
    ).toEqual(2);
  });

  it('hidden option with `isCustomOnly: true` case 3', () => {
    productConfig.metafields.customOptionsConfig = {
      Custom: ['Size: Small'],
    };

    expect(
      Object.values(normalizeVariants(productConfig, true)).length
    ).toEqual(Object.values(productConfig.variants).length - 1);
  });

  it('hidden option with `isCustomOnly: true` case 4', () => {
    productConfig.metafields.customOptionsConfig = {
      Custom: ['Size: Small'],
      New: ['Type: Light'],
    };

    expect(
      Object.values(normalizeVariants(productConfig, true)).length
    ).toEqual(Object.values(productConfig.variants).length - 1);
  });
});

// *** normalizeCustomOptions *** //

describe('normalizeCustomOptions test', () => {
  let productConfig;

  beforeEach(() => {
    productConfig = copyTestConfig(productMock);
  });

  afterEach(() => {
    productConfig = null;
  });

  it('default case', () => {
    expect(normalizeCustomOptions(productConfig)).toStrictEqual({});
  });

  it('custom option case 1', () => {
    productConfig.metafields.customOptionsConfig = {
      Design: ['Color: Red'],
    };

    expect(normalizeCustomOptions(productConfig)).toStrictEqual({
      Design: ['Color: Red'],
    });
  });

  it('custom option case 2', () => {
    productConfig.metafields.customOptionsConfig = {
      Design: ['Color: Red'],
      Custom: ['Color: Red'],
    };

    expect(normalizeCustomOptions(productConfig)).toStrictEqual({
      Design: ['Color: Red'],
      Custom: ['Color: Red'],
    });
  });

  it('custom option case 3', () => {
    productConfig.metafields.customOptionsConfig = {
      Design: ['Type: Massive'], // incorrect option
      Custom: ['Color: Red'],
    };

    expect(normalizeCustomOptions(productConfig)).toStrictEqual({
      Custom: ['Color: Red'],
    });
  });
  it('custom hidden option case 1', () => {
    productConfig.metafields.customOptionsConfig = {
      Design: ['Color: Red'],
      [HIDDEN_CUSTOM_OPTION_KEY]: ['Color: Red'],
    };

    expect(normalizeCustomOptions(productConfig)).toStrictEqual({});
  });

  it('custom hidden option case 2', () => {
    productConfig.metafields.customOptionsConfig = {
      Design: ['Size: Large'],
      [HIDDEN_CUSTOM_OPTION_KEY]: ['Type: Hard'],
    };

    expect(normalizeCustomOptions(productConfig)).toStrictEqual({});
  });

  it('custom hidden option case 3', () => {
    productConfig.metafields.customOptionsConfig = {
      Design: ['Size: Small', 'Size: Large'],
      [HIDDEN_CUSTOM_OPTION_KEY]: ['Size: Small'],
    };

    expect(normalizeCustomOptions(productConfig)).toStrictEqual({
      Design: ['Size: Large'],
    });
  });
});

// *** makeKeyOrders *** //

describe('makeKeyOrders test', () => {
  let productConfig;

  beforeEach(() => {
    productConfig = copyTestConfig(productMock);
  });

  afterEach(() => {
    productConfig = null;
  });

  it('default case', () => {
    expect(makeKeyOrders(productConfig)).toStrictEqual([
      'Color',
      'Size',
      'Type',
    ]);
  });

  it('custom key case 1', () => {
    productConfig.metafields.customOptionsConfig = {
      Design: ['Color: Red', 'Color: Blue'],
    };

    expect(makeKeyOrders(productConfig)).toStrictEqual([
      'Design',
      'Size',
      'Type',
    ]);
  });

  it('custom key case 2', () => {
    productConfig.metafields.customOptionsConfig = {
      Design: ['Size: Large'],
      Custom: ['Color: Red', 'Color: Blue'],
    };

    expect(makeKeyOrders(productConfig)).toStrictEqual([
      'Custom',
      'Design',
      'Size',
      'Type',
    ]);
  });

  it('custom key case 3', () => {
    productConfig.metafields.customOptionsConfig = {
      Design: ['Size: Large'],
    };

    expect(makeKeyOrders(productConfig)).toStrictEqual([
      'Color',
      'Design',
      'Size',
      'Type',
    ]);
  });

  it('custom key and orders case 1', () => {
    productConfig.metafields.customOptionsConfig = {
      Design: ['Size: Large'],
      Custom: ['Color: Red'],
      [ORDER_CUSTOM_OPTION_KEY]: ['Design', 'Custom', 'Type'],
    };

    expect(makeKeyOrders(productConfig)).toStrictEqual([
      'Design',
      'Custom',
      'Type',
      'Color',
      'Size',
    ]);
  });

  it('custom key and orders case 2', () => {
    productConfig.metafields.customOptionsConfig = {
      Design: ['Size: Large'],
      [ORDER_CUSTOM_OPTION_KEY]: ['Design', 'Custom', 'Type'],
    };

    expect(makeKeyOrders(productConfig)).toStrictEqual([
      'Design',
      'Type',
      'Color',
      'Size',
    ]);
  });

  it('custom key and orders case 3', () => {
    productConfig.metafields.customOptionsConfig = {
      Design: ['Size: Large'],
      Favorite: ['Size: Small'],
      [ORDER_CUSTOM_OPTION_KEY]: ['Design', 'Custom', 'Type'],
    };

    expect(makeKeyOrders(productConfig)).toStrictEqual([
      'Design',
      'Type',
      'Color',
      'Favorite',
    ]);
  });

  it('hidden key case 1', () => {
    productConfig.metafields.customOptionsConfig = {
      [HIDDEN_CUSTOM_OPTION_KEY]: ['Size: Large'],
    };

    expect(makeKeyOrders(productConfig)).toStrictEqual([
      'Color',
      'Size',
      'Type',
    ]);
  });

  it('hidden key with order case 1', () => {
    productConfig.metafields.customOptionsConfig = {
      [HIDDEN_CUSTOM_OPTION_KEY]: ['Size: Large'],
      [ORDER_CUSTOM_OPTION_KEY]: ['Size', 'Color'],
    };

    expect(makeKeyOrders(productConfig)).toStrictEqual([
      'Size',
      'Color',
      'Type',
    ]);
  });

  it('hidden key with order case 2', () => {
    productConfig.metafields.customOptionsConfig = {
      Design: ['Size: Large'],
      Favorite: ['Size: Small'],
      [HIDDEN_CUSTOM_OPTION_KEY]: ['Size: Small'],
      [ORDER_CUSTOM_OPTION_KEY]: ['Design', 'Custom', 'Type'],
    };

    expect(makeKeyOrders(productConfig)).toStrictEqual([
      'Design',
      'Type',
      'Color',
    ]);
  });

  it('hidden key with order case 3', () => {
    productConfig.metafields.customOptionsConfig = {
      Design: ['Size: Large'],
      Favorite: ['Size: Small'],
      [HIDDEN_CUSTOM_OPTION_KEY]: ['Size: Small'],
      [ORDER_CUSTOM_OPTION_KEY]: ['Design', 'Custom', 'Type'],
      [SOLD_OUT_CUSTOM_OPTION_KEY]: ['Size: Large'],
    };

    expect(makeKeyOrders(productConfig)).toStrictEqual([
      'Design',
      'Type',
      'Color',
    ]);
  });
});

// *** normalizeProductConfig *** //

describe('normalizeProductConfig', () => {
  // TODO: Need to add test cases
  let productConfig;

  beforeEach(() => {
    productConfig = copyTestConfig(productMock);
  });

  afterEach(() => {
    productConfig = null;
  });

  it('without custom options', () => {
    expect(normalizeProductConfig(productConfig)).toBeTruthy();
  });
});

// *** calculateProductImages *** //

describe('calculateProductImages', () => {
  const emptyResult = {
    mediaMobilePopup: [],
    mediaDesktopPopup: [],
    mediaMobile: [],
    mediaDesktop: [],
  };

  it('incorrect type: undefined', () => {
    expect(calculateProductImages(undefined)).toStrictEqual(emptyResult);
  });

  it('incorrect type: null', () => {
    expect(calculateProductImages(null)).toStrictEqual(emptyResult);
  });

  it('incorrect type: object', () => {
    expect(calculateProductImages({})).toStrictEqual(emptyResult);
  });

  it('incorrect type: number', () => {
    expect(calculateProductImages(12)).toStrictEqual(emptyResult);
  });

  it('incorrect type: string', () => {
    expect(calculateProductImages('test')).toStrictEqual(emptyResult);
  });

  it('without images', () => {
    expect(calculateProductImages([])).toStrictEqual(emptyResult);
  });

  it('single image without alt', () => {
    const config = copyTestConfig(productMock);
    const cleanMedia = config.media.map(({ alt, ...image }) => image);

    expect(calculateProductImages(cleanMedia)).toBeDefined();
    expect(calculateProductImages(cleanMedia).mediaDesktop).toStrictEqual(
      cleanMedia
    );
  });

  it('multiple images for mobile and desktop', () => {
    const config = copyTestConfig(productMock);

    const getImageByAltInclude = (containedStrings = [], skippedStrings = []) =>
      config.media
        .filter(
          ({ alt = '' }) =>
            !skippedStrings.some((string) => alt.includes(string))
        )
        .filter(
          ({ alt = '' }) =>
            !containedStrings.some((string) => !alt.includes(string))
        );

    expect(calculateProductImages(config.media)).toBeDefined();

    const mobilePopupImages = getImageByAltInclude(
      ['MOBILE', 'GREAT_QUALITY'],
      []
    );

    expect(
      calculateProductImages(config.media)?.mediaMobilePopup
    ).toStrictEqual(mobilePopupImages);

    const desktopPopupImages = getImageByAltInclude(
      ['GREAT_QUALITY'],
      ['MOBILE']
    );

    expect(
      calculateProductImages(config.media)?.mediaDesktopPopup
    ).toStrictEqual(desktopPopupImages);

    const mobileImages = getImageByAltInclude(['MOBILE'], ['GREAT_QUALITY']);

    expect(calculateProductImages(config.media)?.mediaMobile).toStrictEqual(
      mobileImages
    );

    const normalImages = getImageByAltInclude([], ['MOBILE', 'GREAT_QUALITY']);

    expect(calculateProductImages(config.media)?.mediaDesktop).toEqual(
      normalImages
    );
  });
});
