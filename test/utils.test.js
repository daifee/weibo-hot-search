const fs = require('fs');
const path = require('path');
const utils = require('../scripts/utils');
const tool = require('./tool');

beforeEach(() => {
  tool.cleanTempDir();
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

  test('3', () => {
    const timestamp = 1658030509598;
    const received = utils.formatDate(timestamp, 3);
    expect(received).toBe('12:01');
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
    const data = utils.aggregate(sourceFilePaths, utils.convertDataFromSpider);

    expect(data.hotgov_list.length).toBe(5);
    expect(data.band_list.length).toBe(310);
    expect(data.startTime < Number.MAX_SAFE_INTEGER).toBe(true);
    expect(data.endTime > 0).toBe(true);
  });

  test('排序', () => {
    const sourceFilePaths = tool.getFilePathsFromDir('./test/data/18');

    const data = utils.aggregate(sourceFilePaths, utils.convertDataFromSpider);

    for (let i = 1; i < data.band_list.length; i += 1) {
      const prev = data.band_list[(i - 1)];
      const curr = data.band_list[i];

      expect(prev.raw_hot >= curr.raw_hot).toBe(true);
    }
  });
});

describe('extractDir(filePath)', () => {
  test('正确用法', () => {
    const dir = path.resolve(`./temp/${Date.now()}`);
    const filePath = path.resolve(dir, `${Date.now()}.json`);
    const received = utils.extractDir(filePath);
    expect(received).toEqual(dir);
  });
});

describe('archiveJSON(filePath, data)', () => {
  const filePath = path.resolve(`./temp/${Date.now()}/${Date.now()}.json`);

  test('正确用法', () => {
    utils.archiveJSON(filePath, { name: 'daifee' });

    expect(
      fs.existsSync(filePath),
    ).toBe(true);
  });
});

describe('archiveMD(filePath, content)', () => {
  const filePath = path.resolve(`./temp/${Date.now()}.md`);

  test('正确用法', () => {
    utils.archiveJSON(filePath, '#daifee');

    expect(
      fs.existsSync(filePath),
    ).toBe(true);
  });
});
