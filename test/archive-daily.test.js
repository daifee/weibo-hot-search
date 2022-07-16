const archiveDaily = require('../scripts/archive-daily');

describe('test/archive-daily.test.js', () => {
  test.only('getDailySourceFilePaths(timestamp)', async () => {
    const files = archiveDaily.getDailySourceFilePaths(1657965739042);

    expect(files.length >= 2).toBe(true);
  });
});
