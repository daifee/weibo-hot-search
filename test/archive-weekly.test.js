const fs = require('fs');
const archiveWeekly = require('../scripts/archive-weekly');
const utils = require('../scripts/utils');
const tool = require('./tool');

function expectDate(receivedDateObj, expectedMonth, expectedDate, expectedDay) {
  expect(receivedDateObj.getMonth()).toEqual(expectedMonth);
  expect(receivedDateObj.getDate()).toEqual(expectedDate);
  expect(receivedDateObj.getDay()).toEqual(expectedDay);
}

beforeEach(() => {
  tool.cleanTempDir();
});

describe('getWeeklyDates(runTime)', () => {
  test('周一', () => {
    // 2022/7/18 16:20:39 周一（上海时区）
    const timestamp = 1658132439026;
    const dates = archiveWeekly.getWeeklyDates(timestamp);
    expect(dates.length).toBe(2);

    expectDate(dates[1], 6, 18, 1);
    expectDate(dates[0], 6, 17, 0);
  });

  test('周三', () => {
    // 2022/6/29 16:09:29 周三（上海时区）
    const timestamp = 1656490169889;
    const dates = archiveWeekly.getWeeklyDates(timestamp);
    expect(dates.length).toBe(4);

    expectDate(dates[3], 5, 29, 3);
    expectDate(dates[2], 5, 28, 2);
    expectDate(dates[1], 5, 27, 1);
    expectDate(dates[0], 5, 26, 0);
  });

  test('周五', () => {
    // 2022/7/1 16:09:29 周五（上海时区）
    const timestamp = 1656662969889;
    const dates = archiveWeekly.getWeeklyDates(timestamp);
    expect(dates.length).toBe(6);

    expectDate(dates[5], 6, 1, 5);
    expectDate(dates[4], 5, 30, 4);
    expectDate(dates[3], 5, 29, 3);
    expectDate(dates[2], 5, 28, 2);
    expectDate(dates[1], 5, 27, 1);
    expectDate(dates[0], 5, 26, 0);
  });

  test('周日', () => {
    // 2022/7/3 16:09:29 周日（上海时区）
    const timestamp = 1656835769000;
    const dates = archiveWeekly.getWeeklyDates(timestamp);
    expect(dates.length).toBe(1);

    expectDate(dates[0], 6, 3, 0);
  });
});

describe('getSourceFiles', () => {
  test('runTime = 1658382269954', () => {
    fs.cpSync('./test/data/20', './temp', { recursive: true });

    const timestamp = 1658382269954;
    const received = archiveWeekly.getSourceFiles(timestamp);
    expect(received.length).toEqual(5);
    expect(
      (/archives\/daily\/2022\/07-17\.json$/).test(received[0]),
    ).toBe(true);
    expect(
      (/archives\/daily\/2022\/07-18\.json$/).test(received[1]),
    ).toBe(true);
    expect(
      (/archives\/daily\/2022\/07-19\.json$/).test(received[2]),
    ).toBe(true);
    expect(
      (/archives\/daily\/2022\/07-20\.json$/).test(received[3]),
    ).toBe(true);
    expect(
      (/archives\/daily\/2022\/07-21\.json$/).test(received[4]),
    ).toBe(true);
  });

  test('runTime = 1658630710372', () => {
    fs.cpSync('./test/data/20', './temp', { recursive: true });

    const timestamp = 1658630710372;
    const received = archiveWeekly.getSourceFiles(timestamp);
    expect(received.length).toEqual(1);
    expect(
      (/archives\/daily\/2022\/07-24\.json$/).test(received[0]),
    ).toBe(true);
  });

  test('runTime = 1258630710372', () => {
    const timestamp = 1258630710372;
    const received = archiveWeekly.getSourceFiles(timestamp);
    expect(received.length).toEqual(0);
  });
});

describe('setSunday(date)', () => {
  test('周一', () => {
    // 2022/7/18 16:20:39 周一（上海时区）
    const timestamp = 1658132439026;
    const date = new Date(timestamp);
    archiveWeekly.setSunday(date);

    const received = utils.formatDate(date.getTime(), 1);

    expect(received).toEqual('2022/07/17');
  });

  test('周三', () => {
    // 2022/6/29 16:09:29 周三（上海时区）
    const timestamp = 1656490169889;
    const date = new Date(timestamp);
    archiveWeekly.setSunday(date);

    const received = utils.formatDate(date.getTime(), 1);

    expect(received).toEqual('2022/06/26');
  });

  test('周五', () => {
    // 2022/7/1 16:09:29 周五（上海时区）
    const timestamp = 1656662969889;
    const date = new Date(timestamp);
    archiveWeekly.setSunday(date);

    const received = utils.formatDate(date.getTime(), 1);

    expect(received).toEqual('2022/06/26');
  });

  test('周日', () => {
    // 2022/7/3 16:09:29 周日（上海时区）
    const timestamp = 1656835769000;
    const date = new Date(timestamp);
    archiveWeekly.setSunday(date);

    const received = utils.formatDate(date.getTime(), 1);

    expect(received).toEqual('2022/07/03');
  });
});

describe('getArchiveDir(runTime, ext)', () => {
  test('2022', () => {
    // 2022/7/18 16:20:39 周一（上海时区）
    const timestamp = 1658132439026;
    const dir = archiveWeekly.getArchiveDir(timestamp, 'json');

    expect(
      (/archives\/weekly\/2022$/).test(dir),
    ).toEqual(true);
  });

  test('2021', () => {
    // 2021/6/29 16:09:29 周三（上海时区）
    const timestamp = 1627254286933;
    const dir = archiveWeekly.getArchiveDir(timestamp, 'json');

    expect(
      (/archives\/weekly\/2021$/).test(dir),
    ).toEqual(true);
  });
});

describe('getFilePath(timestamp)', () => {
  test('2022/7/17', () => {
    // 2022/7/18 16:20:39 周一（上海时区）
    const timestamp = 1658132439026;

    const json = archiveWeekly.getFilePath(timestamp, 'json');
    const md = archiveWeekly.getFilePath(timestamp, 'md');

    expect(
      (/archives\/weekly\/2022\/07-17\.json$/).test(json),
    ).toEqual(true);
    expect(
      (/archives\/weekly\/2022\/07-17\.md$/).test(md),
    ).toEqual(true);
  });

  test('2022/6/29', () => {
    // 2022/6/29 16:09:29 周三（上海时区）
    const timestamp = 1656490169889;
    const json = archiveWeekly.getFilePath(timestamp, 'json');
    const md = archiveWeekly.getFilePath(timestamp, 'md');

    expect(
      (/archives\/weekly\/2022\/06-26\.json$/).test(json),
    ).toEqual(true);
    expect(
      (/archives\/weekly\/2022\/06-26\.md$/).test(md),
    ).toEqual(true);
  });

  test('2022/7/1', () => {
    // 2022/7/1 16:09:29 周五（上海时区）
    const timestamp = 1656662969889;
    const json = archiveWeekly.getFilePath(timestamp, 'json');
    const md = archiveWeekly.getFilePath(timestamp, 'md');

    expect(
      (/archives\/weekly\/2022\/06-26\.json$/).test(json),
    ).toEqual(true);
    expect(
      (/archives\/weekly\/2022\/06-26\.md$/).test(md),
    ).toEqual(true);
  });

  test('2022/7/3', () => {
    // 2022/7/3 16:09:29 周日（上海时区）
    const timestamp = 1656835769000;
    const json = archiveWeekly.getFilePath(timestamp, 'json');
    const md = archiveWeekly.getFilePath(timestamp, 'md');

    expect(
      (/archives\/weekly\/2022\/07-03\.json$/).test(json),
    ).toEqual(true);
    expect(
      (/archives\/weekly\/2022\/07-03\.md$/).test(md),
    ).toEqual(true);
  });
});

describe('archiveJSON(runTime, data)', () => {
  test('2022/7/18', () => {
    // 2022/7/18 16:20:39 周一（上海时区）
    const timestamp = 1658132439023;
    const filePath = archiveWeekly.getFilePath(timestamp, 'json');
    archiveWeekly.archiveJSON(timestamp, { runTime: timestamp });

    const obj = utils.readJSON(filePath);
    expect(obj).toBeDefined();
    expect(obj.runTime).toEqual(timestamp);
  });
});

describe('renderMD', () => {
  test('正确用法', async () => {
    const content = await archiveWeekly.renderMD({
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
    expect(typeof content).toEqual('string');
  });
});

describe('archiveMD', () => {
  test('正确用法', () => {
    const timestamp = 1658132439043;
    const content = 'daifee';
    archiveWeekly.archiveMD(timestamp, content);

    const filePath = archiveWeekly.getFilePath(timestamp, 'md');
    const received = fs.readFileSync(filePath, 'utf-8');
    expect(received).toEqual(content);
  });
});

describe('run(runTime)', () => {
  test('2022/7/18', async () => {
    fs.cpSync('./test/data/20', './temp', { recursive: true });

    // 2022/7/18 16:20:39 周一（上海时区）
    const timestamp = 1658132439043;
    await archiveWeekly.run(timestamp);

    const jsonFilePath = archiveWeekly.getFilePath(timestamp, 'json');
    const mdFilePath = archiveWeekly.getFilePath(timestamp, 'md');

    const json = utils.readJSON(jsonFilePath);
    expect(json).toBeDefined();

    expect(
      fs.existsSync(mdFilePath),
    ).toEqual(true);
  });
});
