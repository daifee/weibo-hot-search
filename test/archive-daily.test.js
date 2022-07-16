const archiveDaily = require('../scripts/archive-daily');
const spider = require('../scripts/spider');

describe('test/archive-daily.test.js', () => {
  test.only('getDailySourceFilePaths(timestamp)', async () => {
    const runTime = Date.now();
    await spider.run();
    const files = archiveDaily.getDailySourceFilePaths(runTime);

    expect(files.length >= 1).toBe(true);
  });
});
