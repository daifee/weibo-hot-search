const { execSync } = require('child_process');
const weibo = require('../scripts/weibo');

describe.only('generateDailyContent(data)', () => {
  test('正确用法', () => {
    const data = {
      startTime: 1658247236896,
      endTime: 1658329848059,
      band_list: [
        {
          raw_hot: 15664999,
          num: 15664999,
          word: '王冰冰 徐嘉余',
          onboard_time: 1658302408,
          rank: 5,
          category: '体育,艺人',
        },
        {
          raw_hot: 11106497,
          num: 11106497,
          word: '易烊千玺同时提名百花奖男主男配',
          onboard_time: 1658303612,
          rank: 1,
          category: '影视',
        },
      ],
      hotgov_list: [
        {
          word: '#文明之美看东方#',
        },
        {
          word: '#东城有约非凡十年#',
        },
      ],
    };

    const content = weibo.generateDailyContent(data);

    console.log(content);

    execSync(`echo "${content}" > ./temp/test.txt`);
  });
});

describe('sendDaily(timestamp)', () => {
  test('07/20 ', () => {
    // const timestamp = 1658247236896;
    // const content = weibo.gene;
  });
});
