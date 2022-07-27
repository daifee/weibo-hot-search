const fs = require('fs');
const archiveMonthly = require('../scripts/archive-monthly');
const utils = require('../scripts/utils');
const tool = require('./tool');

beforeEach(() => {
  tool.cleanTempDir();
});

describe('getFilePath(runTime, ext)', () => {
  test('json', () => {
    // 2022/7/18 10:42:19 周一（上海时区）
    const timestamp = 1658112139026;
    const received = archiveMonthly.getFilePath(timestamp, 'json');

    expect(
      (/archives\/monthly\/2022-07.json$/).test(received),
    ).toBe(true);
  });

  test('md', () => {
    // 2022/7/18 10:42:19 周一（上海时区）
    const timestamp = 1658112139026;
    const received = archiveMonthly.getFilePath(timestamp, 'md');

    expect(
      (/archives\/monthly\/2022-07.md$/).test(received),
    ).toBe(true);
  });
});

describe('getMonthlyDates(runTime)', () => {
  test('18天', () => {
    // 2022/7/18 10:42:19 周一（上海时区）
    const timestamp = 1658112139026;
    const dates = archiveMonthly.getMonthlyDates(timestamp);

    expect(dates.length).toEqual(18);
    expect(dates[0].getDate()).toEqual(1);
    expect(dates[0].getMonth()).toEqual(6);

    expect(dates[17].getDate()).toEqual(18);
    expect(dates[17].getMonth()).toEqual(6);
  });

  test('第一天', () => {
    // Fri Jul 01 2022 10:42:19 GMT+0800 (中国标准时间)
    const timestamp = 1656643339026;
    const dates = archiveMonthly.getMonthlyDates(timestamp);

    expect(dates.length).toEqual(1);
    expect(dates[0].getDate()).toEqual(1);
    expect(dates[0].getMonth()).toEqual(6);
  });

  test('最后一天', () => {
    // Thu Jun 30 2022 10:42:19 GMT+0800 (中国标准时间)
    const timestamp = 1656556939026;
    const dates = archiveMonthly.getMonthlyDates(timestamp);

    expect(dates.length).toEqual(30);
    expect(dates[0].getDate()).toEqual(1);
    expect(dates[0].getMonth()).toEqual(5);

    expect(dates[29].getDate()).toEqual(30);
    expect(dates[29].getMonth()).toEqual(5);
  });
});

describe('getSourceFiles(runTime)', () => {
  test('正确用法', () => {
    fs.cpSync('./test/data/20', './temp', { recursive: true });

    // Thu Jul 21 2022 13:44:29 GMT+0800 (中国标准时间)
    const timestamp = 1658382269954;
    const received = archiveMonthly.getSourceFiles(timestamp);

    expect(received.length).toEqual(6);
  });
});

describe('archiveJSON(runTime, data)', () => {
  test('正确用法', () => {
    const timestamp = 1658382269954;
    archiveMonthly.archiveJSON(timestamp, { date: timestamp });

    const filePath = archiveMonthly.getFilePath(timestamp, 'json');

    const data = utils.readJSON(filePath);

    expect(data.date).toEqual(timestamp);
  });
});

describe('renderMD(data)', () => {
  test('正确用法', async () => {
    const content = await archiveMonthly.renderMD({
      startTime: 1658132439043,
      endTime: 1658132439043,
      band_list: [
        {
          raw_hot: 28626840,
          num: 28626840,
          word: '易烊千玺发声',
          onboard_time: 1658024438,
          rank: 0,
        },
        {
          raw_hot: 11057332,
          num: 1338378,
          word: '易烊千玺决定放弃⼊职国话',
          onboard_time: 1658025580,
          rank: 3,
        },
      ],
      hotgov_list: [
        {
          word: '#我国成功发射四维0304两颗卫星#',
        },
        {
          word: '#制造业的核心就是创新#',
        },
      ],
    });

    expect(content).toBeDefined();
    expect(content.length > 100).toBe(true);
  });
});

describe('archiveMD(runTime, content)', () => {
  test('正确用法', () => {
    const timestamp = 1658132439043;
    const content = 'daifee';
    archiveMonthly.archiveMD(timestamp, content);

    const filePath = archiveMonthly.getFilePath(timestamp, 'md');
    const received = fs.readFileSync(filePath, 'utf-8');
    expect(received).toEqual(content);
  });
});

describe('run(timestamp)', () => {
  test('2022/7/18', async () => {
    fs.cpSync('./test/data/20', './temp', { recursive: true });

    // 2022/7/18 16:20:39 周一（上海时区）
    const timestamp = 1658132439043;
    await archiveMonthly.run(timestamp);

    const jsonFilePath = archiveMonthly.getFilePath(timestamp, 'json');
    const mdFilePath = archiveMonthly.getFilePath(timestamp, 'md');

    const json = utils.readJSON(jsonFilePath);
    expect(json).toBeDefined();

    expect(
      fs.existsSync(mdFilePath),
    ).toEqual(true);
  });
});
