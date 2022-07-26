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
