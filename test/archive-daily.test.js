const { execSync } = require('child_process');
const fs = require('fs');

const archiveDaily = require('../scripts/archive-daily');
const spider = require('../scripts/spider');

describe('getSourceFiles(runTime)', () => {
  const times = [
    Date.now(),
    Date.now() + 300, // 刚好跨一天，就报错。超低概率
  ];

  afterAll(() => {
    const filePaths = archiveDaily.getSourceFiles(times[0]);
    filePaths.forEach((filePath) => {
      execSync(`rm ${filePath}`);
    });
  });

  test('getSourceFiles(runTime)', async () => {
    await spider.saveSourceData(times[0], {});
    await spider.saveSourceData((times[1]), {});
    const filePaths = archiveDaily.getSourceFiles(times[0]);

    expect(filePaths.length).toEqual(2);
  });
});

describe('getArchiveDir(runTime)', () => {
  test('正确用法', () => {
    // archives/daily/2022
    const runTime = 1657945739042;
    const received = archiveDaily.getArchiveDir(runTime);
    expect(
      (/archives\/daily\/2022$/).test(received),
    ).toBe(true);
  });
});

describe('getFilePath(runTime, ext)', () => {
  test('json', () => {
    // archives/daily/2022/07-16.json
    const runTime = 1657945739042;
    const received = archiveDaily.getFilePath(runTime, 'json');
    expect(
      (/archives\/daily\/2022\/07-16\.json$/).test(received),
    ).toBe(true);
  });

  test('md', () => {
    // archives/daily/2022/07-16.md
    const runTime = 1657945739042;
    const received = archiveDaily.getFilePath(runTime, 'md');
    expect(
      (/archives\/daily\/2022\/07-16\.md$/).test(received),
    ).toBe(true);
  });
});

describe('archiveJSON', () => {
  const runTime = Date.now();
  const filePath = archiveDaily.getFilePath(runTime, 'json');

  afterAll(() => {
    execSync(`rm ${filePath}`);
  });

  test('正确用法', () => {
    archiveDaily.archiveJSON(runTime, {});

    expect(
      fs.existsSync(filePath),
    ).toBe(true);
  });
});

describe('archiveMD', () => {
  const runTime = Date.now();
  const filePath = archiveDaily.getFilePath(runTime, 'md');

  afterAll(() => {
    execSync(`rm ${filePath}`);
  });

  test('正确用法', () => {
    archiveDaily.archiveMD(runTime, '{}');

    expect(
      fs.existsSync(filePath),
    ).toBe(true);
  });
});

describe('renderMD(data)', () => {
  test('正确用法', async () => {
    const content = await archiveDaily.renderMD({
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

    expect(content).toBeDefined();
  });
});

describe('run(timestamp)', () => {
  beforeAll(() => {
    execSync('cp -R ./test/data/19/source ./temp');
  });

  afterAll(() => {
    // execSync('rm -R ./temp');
  });

  test('正确用法', async () => {
    const runTime = 1657945739042;
    await archiveDaily.run(runTime);

    // /mnt/e/GitHub/weibo-hot-search/temp/archives/daily/2022/07-16.json
    const jsonFile = archiveDaily.getFilePath(runTime, 'json');

    // /mnt/e/GitHub/weibo-hot-search/temp/archives/daily/2022/07-16.md
    const mdFile = archiveDaily.getFilePath(runTime, 'md');

    expect(fs.existsSync(jsonFile)).toBe(true);
    expect(fs.existsSync(mdFile)).toBe(true);
  });
});
