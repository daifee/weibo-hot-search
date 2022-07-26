const fs = require('fs');
const spider = require('../scripts/spider');
const utils = require('../scripts/utils');
const tool = require('./tool');

beforeEach(() => {
  tool.cleanTempDir();
});

describe('isHotSearchItem(item)', () => {
  test('正确用法', () => {
    expect(spider.isHotSearchItem({
      raw_hot: 2478668,
      num: 2478668,
      word: '用高德打车遇车祸身亡女生哥哥发声',
      onboard_time: 1657967425,
      rank: 0,
    })).toBe(true);
  });

  test('不是热搜', () => {
    expect(spider.isHotSearchItem(null)).toBe(false);
    expect(spider.isHotSearchItem({})).toBe(false);
    expect(spider.isHotSearchItem({
      word: 'daifee',
    })).toBe(false);
  });
});

describe('trimHotSearchItem(item)', () => {
  test('正确用法', () => {
    const expected = {
      raw_hot: 2478668,
      num: 2478668,
      word: '用高德打车遇车祸身亡女生哥哥发声',
      onboard_time: 1657967425,
      rank: 0,
    };
    expect(spider.trimHotSearchItem({
      ...expected,
      name: 'daifee',
      age: 999,
    })).toEqual(expected);
  });

  test('null', () => {
    expect(() => {
      spider.trimHotSearchItem(null);
    }).toThrow();
  });
});

describe('trimData(data)', () => {
  test('只保留两个字段', () => {
    const data = {
      name: 'daifee',
      age: 18,
    };
    const received = spider.trimData(data);
    expect(received.name).toBeUndefined();
    expect(received.age).toBeUndefined();

    expect(received.band_list).toEqual([]);
    expect(received.hotgov).toEqual(null);
  });

  test('热搜项冗余字段', () => {
    const data = {
      band_list: [
        {
          extra: 'string',
          raw_hot: 2478668,
          num: 2478668,
          word: '用高德打车遇车祸身亡女生哥哥发声',
          onboard_time: 1657967425,
          rank: 0,
          mblog: 'string',
        },
      ],
      hotgov: {
        extra: 'string',
        raw_hot: 2478668,
        num: 2478668,
        word: '用高德打车遇车祸身亡女生哥哥发声',
        onboard_time: 1657967425,
        rank: 0,
      },
    };

    const received = spider.trimData(data);
    expect(received.hotgov.extra).toBeUndefined();
    expect(received.band_list[0].extra).toBeUndefined();
    expect(received.band_list[0].mblog).toBeUndefined();
  });

  test('热搜项冗余字段', () => {
    const data = {
      band_list: [
        {
          extra: 'string',
          raw_hot: 2478668,
          num: 2478668,
          onboard_time: 1657967425,
          rank: 0,
          mblog: 'string',
        },
        {
          extra: 'string',
          raw_hot: 2478668,
          num: 2478668,
          word: '用高德打车遇车祸身亡女生哥哥发声',
          onboard_time: 1657967425,
          rank: 0,
          mblog: 'string',
        },
        {
          extra: 'string',
          num: 2478668,
          word: '用高德打车遇车祸身亡女生哥哥发声',
          onboard_time: 1657967425,
          rank: 0,
          mblog: 'string',
        },
      ],
    };

    const received = spider.trimData(data);
    expect(received.band_list.length).toEqual(1);
  });
});

describe('getDailyDir', () => {
  test('正确用法', () => {
    const received = spider.getDailyDir(1657945739042);
    expect(
      (/\/source\/2022\/07\/16$/).test(received),
    ).toBe(true);
  });
});

describe('getFilePath', () => {
  test('正确用法', () => {
    const received = spider.getFilePath(1657945739042);
    expect(
      (/\/source\/2022\/07\/16\/1657945739042\.json$/).test(received),
    ).toBe(true);
  });
});

describe('saveSourceData(runTime, data)', () => {
  const runTime = 1657945739031;
  const filePath = spider.getFilePath(runTime);

  test('1657945739031', () => {
    spider.saveSourceData(runTime, {});

    expect(fs.existsSync(filePath)).toBe(true);
    const data = utils.readJSON(filePath);

    expect(data).toBeDefined();
    expect(data.runTime).toBeDefined();
    expect(data.source).toBeDefined();
  });
});

describe('run', () => {
  const runTime = 1657945739121;
  const filePath = spider.getFilePath(runTime);

  test('1657945739121', async () => {
    await spider.run(runTime);

    expect(fs.existsSync(filePath)).toBe(true);
    const data = utils.readJSON(filePath);

    expect(data).toBeDefined();
    expect(data.runTime).toBeDefined();
    expect(data.source).toBeDefined();
  });
});
