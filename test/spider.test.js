require('./bootstrap');

const fs = require('fs');
const spider = require('../scripts/spider');

describe('test/spider.test.js', () => {
  test('run()', async () => {
    const filePath = await spider.run();

    expect(filePath).not.toBe(undefined);
    const json = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(json);
    expect(data.source).not.toBe(undefined);
    expect(data.runTime).not.toBe(undefined);
  });

  test('getDailyDir(timestamp)', () => {
    const result = spider.getDailyDir(1657965739042);
    expect(result).toEqual(expect.stringContaining('source/2022/07/16'));
  });
});
