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
    expect(dates.length).toBe(1);

    expectDate(dates[0], 6, 18, 1);
  });

  test('周三', () => {
    // 2022/6/29 16:09:29 周三（上海时区）
    const timestamp = 1656490169889;
    const dates = archiveWeekly.getWeeklyDates(timestamp);
    expect(dates.length).toBe(3);

    expectDate(dates[2], 5, 29, 3);
    expectDate(dates[1], 5, 28, 2);
    expectDate(dates[0], 5, 27, 1);
  });

  test('周五', () => {
    // 2022/7/1 16:09:29 周五（上海时区）
    const timestamp = 1656662969889;
    const dates = archiveWeekly.getWeeklyDates(timestamp);
    expect(dates.length).toBe(5);

    expectDate(dates[4], 6, 1, 5);
    expectDate(dates[3], 5, 30, 4);
    expectDate(dates[2], 5, 29, 3);
    expectDate(dates[1], 5, 28, 2);
    expectDate(dates[0], 5, 27, 1);
  });

  test('周日', () => {
    // 2022/7/3 16:09:29 周五（上海时区）
    const timestamp = 1656835769000;
    const dates = archiveWeekly.getWeeklyDates(timestamp);
    expect(dates.length).toBe(7);

    expectDate(dates[6], 6, 3, 0);
    expectDate(dates[5], 6, 2, 6);
    expectDate(dates[4], 6, 1, 5);
    expectDate(dates[3], 5, 30, 4);
    expectDate(dates[2], 5, 29, 3);
    expectDate(dates[1], 5, 28, 2);
    expectDate(dates[0], 5, 27, 1);
  });
});

describe('getSourceFiles', () => {
  test('runTime = 1658382269954', () => {
    fs.cpSync('./test/data/20', './temp', { recursive: true });

    const timestamp = 1658382269954;
    const received = archiveWeekly.getSourceFiles(timestamp);
    expect(received.length).toEqual(4);
    expect(
      (/archives\/daily\/2022\/07-18\.json$/).test(received[0]),
    ).toBe(true);
    expect(
      (/archives\/daily\/2022\/07-19\.json$/).test(received[1]),
    ).toBe(true);
    expect(
      (/archives\/daily\/2022\/07-20\.json$/).test(received[2]),
    ).toBe(true);
    expect(
      (/archives\/daily\/2022\/07-21\.json$/).test(received[3]),
    ).toBe(true);
  });

  test('runTime = 1658630710372', () => {
    fs.cpSync('./test/data/20', './temp', { recursive: true });

    const timestamp = 1658630710372;
    const received = archiveWeekly.getSourceFiles(timestamp);
    expect(received.length).toEqual(7);
    expect(
      (/archives\/daily\/2022\/07-18\.json$/).test(received[0]),
    ).toBe(true);
    expect(
      (/archives\/daily\/2022\/07-19\.json$/).test(received[1]),
    ).toBe(true);
    expect(
      (/archives\/daily\/2022\/07-20\.json$/).test(received[2]),
    ).toBe(true);
    expect(
      (/archives\/daily\/2022\/07-21\.json$/).test(received[3]),
    ).toBe(true);
    expect(
      (/archives\/daily\/2022\/07-22\.json$/).test(received[4]),
    ).toBe(true);
    expect(
      (/archives\/daily\/2022\/07-23\.json$/).test(received[5]),
    ).toBe(true);
    expect(
      (/archives\/daily\/2022\/07-24\.json$/).test(received[6]),
    ).toBe(true);
  });

  test('runTime = 1258630710372', () => {
    const timestamp = 1258630710372;
    const received = archiveWeekly.getSourceFiles(timestamp);
    expect(received.length).toEqual(0);
  });
});

describe('setMonday(date)', () => {
  test('周一', () => {
    // 2022/7/18 16:20:39 周一（上海时区）
    const timestamp = 1658132439026;
    const date = new Date(timestamp);
    archiveWeekly.setMonday(date);

    const received = utils.formatDate(date.getTime(), 1);

    expect(received).toEqual('2022/07/18');
  });

  test('周三', () => {
    // 2022/6/29 16:09:29 周三（上海时区）
    const timestamp = 1656490169889;
    const date = new Date(timestamp);
    archiveWeekly.setMonday(date);

    const received = utils.formatDate(date.getTime(), 1);

    expect(received).toEqual('2022/06/27');
  });

  test('周五', () => {
    // 2022/7/1 16:09:29 周五（上海时区）
    const timestamp = 1656662969889;
    const date = new Date(timestamp);
    archiveWeekly.setMonday(date);

    const received = utils.formatDate(date.getTime(), 1);

    expect(received).toEqual('2022/06/27');
  });

  test('周日', () => {
    // 2022/7/3 16:09:29 周五（上海时区）
    const timestamp = 1656835769000;
    const date = new Date(timestamp);
    archiveWeekly.setMonday(date);

    const received = utils.formatDate(date.getTime(), 1);

    expect(received).toEqual('2022/06/27');
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
  test('2022/7/18', () => {
    // 2022/7/18 16:20:39 周一（上海时区）
    const timestamp = 1658132439026;

    const json = archiveWeekly.getFilePath(timestamp, 'json');
    const md = archiveWeekly.getFilePath(timestamp, 'md');

    expect(
      (/archives\/weekly\/2022\/07-18\.json$/).test(json),
    ).toEqual(true);
    expect(
      (/archives\/weekly\/2022\/07-18\.md$/).test(md),
    ).toEqual(true);
  });

  test('2022/6/29', () => {
    // 2022/6/29 16:09:29 周三（上海时区）
    const timestamp = 1656490169889;
    const json = archiveWeekly.getFilePath(timestamp, 'json');
    const md = archiveWeekly.getFilePath(timestamp, 'md');

    expect(
      (/archives\/weekly\/2022\/06-27\.json$/).test(json),
    ).toEqual(true);
    expect(
      (/archives\/weekly\/2022\/06-27\.md$/).test(md),
    ).toEqual(true);
  });

  test('2022/7/1', () => {
    // 2022/7/1 16:09:29 周五（上海时区）
    const timestamp = 1656662969889;
    const json = archiveWeekly.getFilePath(timestamp, 'json');
    const md = archiveWeekly.getFilePath(timestamp, 'md');

    expect(
      (/archives\/weekly\/2022\/06-27\.json$/).test(json),
    ).toEqual(true);
    expect(
      (/archives\/weekly\/2022\/06-27\.md$/).test(md),
    ).toEqual(true);
  });

  test('2022/7/3', () => {
    // 2022/7/3 16:09:29 周五（上海时区）
    const timestamp = 1656835769000;
    const json = archiveWeekly.getFilePath(timestamp, 'json');
    const md = archiveWeekly.getFilePath(timestamp, 'md');

    expect(
      (/archives\/weekly\/2022\/06-27\.json$/).test(json),
    ).toEqual(true);
    expect(
      (/archives\/weekly\/2022\/06-27\.md$/).test(md),
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

describe('archiveJSON(runTime)', () => {
  test('2022/7/18', async () => {
    fs.cpSync('./test/data/20', './temp', { recursive: true });

    // 2022/7/18 16:20:39 周一（上海时区）
    const timestamp = 1658132439043;
    await archiveWeekly.run(timestamp);

    const jsonFilePath = archiveWeekly.getFilePath(timestamp, 'json');

    const json = utils.readJSON(jsonFilePath);
    expect(json).toBeDefined();
  });
});
