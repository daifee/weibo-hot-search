const fs = require('fs');

const archiveDaily = require('../scripts/archive-daily');
const spider = require('../scripts/spider');

describe('test/archive-daily.test.js', () => {
  test('getSourceFiles(runTime)', async () => {
    const runTime = Date.now();
    await spider.run();
    const files = archiveDaily.getSourceFiles(runTime);

    expect(files.length >= 1).toBe(true);
  });

  test('aggregate(sourceFilePaths)', () => {
    const sourceFilePaths = archiveDaily.getSourceFiles(1658074311206);
    const data = archiveDaily.aggregate(sourceFilePaths);

    expect(data.hotgov_list.length).toBe(5);
    expect(data.band_list.length).toBe(310);
    // console.log(data);
    expect(data.startTime < Number.MAX_SAFE_INTEGER).toBe(true);
    expect(data.endTime > 0).toBe(true);
    const first = data.band_list[0];
    const second = data.band_list[1];

    expect(first.raw_hot >= second.raw_hot).toBe(true);
  });

  test('aggregate([])', () => {
    const data = archiveDaily.aggregate([]);
    expect(data.hotgov_list.length).toBe(0);
    expect(data.band_list.length).toBe(0);
  });

  test('run(timestamp)', () => {
    const runTime = 1658024204166;
    archiveDaily.run(runTime);

    const archiveFile = archiveDaily.getFilePath(runTime, 'json');
    expect(archiveFile).toBeDefined();
    expect(fs.existsSync(archiveFile)).toBe(true);
  });

  test('should ', async () => {
    const string = await archiveDaily.renderMD({
      startTime: 1658024204166,
      endTime: 1658026718622,
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

    expect(string).toBeDefined();
  });
});
