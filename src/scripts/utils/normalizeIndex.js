import isNumber from 'lodash/isNumber';

export const normalizeIndex = (index, defaultValue = 0) => {
  if (isNumber(index) && Number.isFinite(index)) {
    return index >= 0 ? Math.abs(index) : defaultValue;
  }

  return defaultValue;
};
