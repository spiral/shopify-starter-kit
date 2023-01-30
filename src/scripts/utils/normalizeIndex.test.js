import { normalizeIndex } from './normalizeIndex';

describe('normalizeIndex', () => {
  it('invalid values', () => {
    expect(normalizeIndex(null)).toEqual(0);
    expect(normalizeIndex([], 0)).toEqual(0);
    expect(normalizeIndex({}, 0)).toEqual(0);
    expect(normalizeIndex(String, 0)).toEqual(0);
    expect(normalizeIndex(Number, 0)).toEqual(0);
    expect(normalizeIndex(Infinity, 0)).toEqual(0);
    expect(normalizeIndex(NaN, 0)).toEqual(0);
    expect(normalizeIndex((10).toFixed(2))).toEqual(0);
    expect(normalizeIndex(12n)).toEqual(0);
    expect(normalizeIndex((10).toFixed(1), 1)).toEqual(1);
    expect(normalizeIndex(12n, 999)).toEqual(999);
    expect(normalizeIndex(-1)).toEqual(0);
    expect(normalizeIndex(-999, -99)).toEqual(-99);
  });

  it('valid values', () => {
    expect(normalizeIndex(1)).toEqual(1);
    expect(normalizeIndex(1, '123')).toEqual(1);
    expect(normalizeIndex(0, 12)).toEqual(0);
    expect(normalizeIndex(1000, 12)).toEqual(1000);
    expect(normalizeIndex(0, -99)).toEqual(0);
    expect(normalizeIndex(-0)).toEqual(0);
    expect(normalizeIndex(-0, -1)).toEqual(0);
  });
});
