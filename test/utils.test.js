require('./bootstrap');

const utils = require('../scripts/utils');

describe('test/utils.test.js', () => {
  test('isHotSearch(item)', () => {
    expect(utils.isHotSearch({})).toBe(false);
    expect(utils.isHotSearch({
      raw_hot: 2478668,
      num: 2478668,
      word: '用高德打车遇车祸身亡女生哥哥发声',
      onboard_time: 1657967425,
      rank: 0,
    })).toBe(true);
  });

  test('trimHotSearchItem(item)', () => {
    expect(utils.trimHotSearchItem()).toEqual({
      raw_hot: undefined,
      num: undefined,
      word: undefined,
      onboard_time: undefined,
      rank: undefined,
    });

    const expected = {
      raw_hot: 2478668,
      num: 2478668,
      word: '用高德打车遇车祸身亡女生哥哥发声',
      onboard_time: 1657967425,
      rank: 0,
    };
    expect(utils.trimHotSearchItem({
      ...expected,
      name: 'daifee',
      age: 999,
    })).toEqual(expected);
  });

  describe('formatDate(timestamp)', () => {
    test('1', () => {
      const timestamp = 1658030509598;
      const received = utils.formatDate(timestamp, 1);
      expect(received).toBe('2022/07/17');
    });

    test('2', () => {
      const timestamp = 1658030509598;
      const received = utils.formatDate(timestamp, 2);
      expect(received).toBe('2022/07/17 12:01:49');
    });

    test('-1', () => {
      const timestamp = 1658030509598;
      const received = utils.formatDate(timestamp, -1);
      expect(received).toBe('');
    });

    test('-1', () => {
      const received = utils.formatDate('0', 1);
      expect(received).toBe('');
    });
  });
});
