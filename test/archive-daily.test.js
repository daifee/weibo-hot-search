const fs = require('fs');
const path = require('path');
const archiveDaily = require('../scripts/archive-daily');
const spider = require('../scripts/spider');

function getSourceFilePaths() {
  const dir = './test/data/source/2022/07/16/';
  const files = fs.readdirSync(dir, 'utf-8');
  return files.map((file) => {
    return path.resolve(dir, file);
  });
}

describe('test/archive-daily.test.js', () => {
  test('getSourceFiles(timestamp)', async () => {
    const runTime = Date.now();
    await spider.run();
    const files = archiveDaily.getSourceFiles(runTime);

    expect(files.length >= 1).toBe(true);
  });

  test('aggregate(sourceFilePaths)', () => {
    const sourceFilePaths = getSourceFilePaths();
    const data = archiveDaily.aggregate(sourceFilePaths);

    expect(data.hotgov_list.length).toBe(1);
    expect(data.band_list.length).toBe(50);
    const first = data.band_list[0];
    const second = data.band_list[1];

    expect(first.raw_hot >= second.raw_hot).toBe(true);
  });

  test('run(timestamp)', () => {
    const archiveFile = archiveDaily.run();
    expect(archiveFile).toBeDefined();
    expect(fs.existsSync(archiveFile)).toBe(true);
  });
});
