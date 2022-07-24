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

  describe.only('getDailyArchiveFilePath(runTime)', () => {
    test('should ', () => {
      // temp/archives/daily/2022/07-03.json
      const timestamp = 1656835769000;
      const received = archiveWeekly.getDailyArchiveFilePath(timestamp);

      console.log(received);
    });
  });
});
