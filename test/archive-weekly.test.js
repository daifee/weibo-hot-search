require('./bootstrap');

const archiveWeekly = require('../scripts/archive-weekly');

function expectDate(receivedDateObj, expectedMonth, expectedDate, expectedDay) {
  expect(receivedDateObj.getMonth()).toEqual(expectedMonth);
  expect(receivedDateObj.getDate()).toEqual(expectedDate);
  expect(receivedDateObj.getDay()).toEqual(expectedDay);
}

describe('test/archive-weekly.test.js', () => {
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

  describe('getDailyArchiveFilePath(runTime)', () => {
    test('true ', () => {
      // temp/archives/daily/2022/07-03.json
      const timestamp = 1656835769000;
      const received = archiveWeekly.getDailyArchiveFilePath(timestamp);

      const expected = /archives\/daily\/2022\/07-03\.json$/;

      expect(expected.test(received)).toBe(true);
    });
  });

  describe('getSourceFiles', () => {
    test('runTime = 1658382269954', () => {
      const timestamp = 1658382269954;
      const received = archiveWeekly.getSourceFiles(timestamp);
      expect(received.length === 4).toBe(true);
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
      const timestamp = 1658630710372;
      const received = archiveWeekly.getSourceFiles(timestamp);
      expect(received.length === 7).toBe(true);
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

  // describe('aggregate(sourceFiles)', () => {
  //   test('runTime = 1258630710372', () => {

  //   });
  // });
});
