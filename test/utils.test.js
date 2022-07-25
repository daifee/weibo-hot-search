const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const utils = require('../scripts/utils');
const tool = require('./tool');

describe('isHotSearch(item)', () => {
  test('正确用法', () => {
    expect(utils.isHotSearch({})).toBe(false);
    expect(utils.isHotSearch({
      raw_hot: 2478668,
      num: 2478668,
      word: '用高德打车遇车祸身亡女生哥哥发声',
      onboard_time: 1657967425,
      rank: 0,
    })).toBe(true);
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
    expect(utils.trimHotSearchItem({
      ...expected,
      name: 'daifee',
      age: 999,
    })).toEqual(expected);
  });

  test('缺少参数 ', () => {
    expect(utils.trimHotSearchItem()).toEqual({
      raw_hot: undefined,
      num: undefined,
      word: undefined,
      onboard_time: undefined,
      rank: undefined,
    });
  });
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

  test('-1 参数类型错误', () => {
    const received = utils.formatDate('0', 1);
    expect(received).toBe('');
  });
});

describe('readJSON()', () => {
  test('文件存在', () => {
    const filePath = './test/data/1.json';
    const data = utils.readJSON(filePath);

    expect(data).toBeDefined();
    expect(typeof data === 'object').toBe(true);
  });

  test('不存在', () => {
    const filePath = `${Date.now()}`;
    expect(() => {
      utils.readJSON(filePath);
    }).toThrow();
  });

  test('内容格式错误', () => {
    const filePath = './test/data/2.json';
    expect(() => {
      utils.readJSON(filePath);
    }).toThrow();
  });
});

describe('aggregate(sourceFiles)', () => {
  test('空数据', () => {
    const data = utils.aggregate([]);
    expect(data.hotgov_list.length).toBe(0);
    expect(data.band_list.length).toBe(0);
  });

  test('日榜数据', () => {
    const sourceFilePaths = tool.getFilePathsFromDir('./test/data/18');
    const data = utils.aggregate(sourceFilePaths);

    expect(data.hotgov_list.length).toBe(5);
    expect(data.band_list.length).toBe(310);
    expect(data.startTime < Number.MAX_SAFE_INTEGER).toBe(true);
    expect(data.endTime > 0).toBe(true);
  });

  test('排序', () => {
    const sourceFilePaths = tool.getFilePathsFromDir('./test/data/18');

    const data = utils.aggregate(sourceFilePaths);

    for (let i = 1; i < data.band_list.length; i += 1) {
      const prev = data.band_list[(i - 1)];
      const curr = data.band_list[i];

      expect(prev.raw_hot >= curr.raw_hot).toBe(true);
    }
  });
});

describe('archiveJSON(filePath, data)', () => {
  const filePath = path.resolve(`./temp/${Date.now()}.json`);

  afterEach(() => {
    execSync(`rm ${filePath}`);
  });

  test('正确用法', () => {
    utils.archiveJSON(filePath, { name: 'daifee' });

    expect(
      fs.existsSync(filePath),
    ).toBe(true);
  });
});

describe('archiveMD(filePath, content)', () => {
  const filePath = path.resolve(`./temp/${Date.now()}.md`);

  afterEach(() => {
    execSync(`rm ${filePath}`);
  });

  test('正确用法', () => {
    utils.archiveJSON(filePath, '#daifee');

    expect(
      fs.existsSync(filePath),
    ).toBe(true);
  });
});
