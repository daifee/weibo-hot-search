// const { execSync } = require('child_process');
const fs = require('fs');
const weibo = require('../scripts/weibo');
const tool = require('./tool');

const data = {
  startTime: 1658247236896,
  endTime: 1658329848059,
  band_list: [
    {
      raw_hot: 15664999,
      num: 15664999,
      word: '王冰冰 徐嘉余',
      onboard_time: 1658302408,
      rank: 5,
      category: '体育,艺人',
    },
    {
      raw_hot: 11106497,
      num: 11106497,
      word: '易烊千玺同时提名百花奖男主男配',
      onboard_time: 1658303612,
      rank: 1,
      category: '影视',
    },
  ],
  hotgov_list: [
    {
      word: '#文明之美看东方#',
    },
    {
      word: '#东城有约非凡十年#',
    },
  ],
};

beforeEach(() => {
  tool.cleanTempDir();
});

describe('renderDailyContent(data, "today")', () => {
  test('正确用法', async () => {
    const content = await weibo.renderDailyContent(data, 'today');
    // 预览
    // execSync(`echo "${content}" > ./temp/preview.txt`);

    const expected = fs.readFileSync('./test/data/preview-weibo-today.txt', 'utf-8');

    expect(content).toBeDefined();
    // expect(content).toEqual(expected);
    for (let index = 0; index < content.length; index += 1) {
      const element = content[index];
      expect(element).toEqual(expected[index]);
    }
  });
});

describe('renderDailyContent(data, "yesterday")', () => {
  test('正确用法', async () => {
    const content = await weibo.renderDailyContent(data, 'yesterday');
    // 预览
    // execSync(`echo "${content}" > ./temp/preview.txt`);

    const expected = fs.readFileSync('./test/data/preview-weibo-yesterday.txt', 'utf-8');

    expect(content).toBeDefined();
    // expect(content).toEqual(expected);
    for (let index = 0; index < content.length; index += 1) {
      const element = content[index];
      expect(element).toEqual(expected[index]);
    }
  });
});

describe('generateDailyContent(timestamp)', () => {
  test('2022/7/18 16:20:39', async () => {
    fs.cpSync('./test/data/20', './temp', { recursive: true });

    // 2022/7/18 16:20:39 周一（上海时区）
    const timestamp = 1658132439043;

    const content = await weibo.generateDailyContent(timestamp);

    expect(content).toBeDefined();
    expect(typeof content).toEqual('string');
  });
});
