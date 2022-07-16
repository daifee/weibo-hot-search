const fs = require('fs');
const spider = require('../scripts/spider');

describe('scripts/spider.js', () => {
  test('run', async () => {
    const filePath = await spider.run();

    expect(filePath).not.toBe(undefined);
    const json = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(json);
    expect(data.source).not.toBe(undefined);
    expect(data.runTime).not.toBe(undefined);
  });
});
