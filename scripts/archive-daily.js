/**
 * 归档（日榜）
 */
const fs = require('fs');
const path = require('path');
const spider = require('./spider');
const { ARCHIVE_PATH } = require('./config');

// 获取当天所有数据文件
function getSourceFiles(timestamp) {
  if (!timestamp) {
    // eslint-disable-next-line no-param-reassign
    timestamp = Date.now();
  }

  const dir = spider.getDailyDir(timestamp);
  const files = fs.readdirSync(dir, 'utf-8');

  const regFile = /[0-9]+\.json/;
  return files.filter((file) => {
    return regFile.test(file);
  }).map((file) => {
    return path.join(dir, file);
  });
}

function getSourceData(filePath) {
  const json = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(json);
}

// 聚合数据
function aggregate(sourceFiles) {
  const result = {
    band_list: [],
    hotgov_list: [],
  };

  function mergeBandItem(originItem, newItem) {
    if (originItem.raw_hot < newItem.raw_hot) {
      // eslint-disable-next-line no-param-reassign
      originItem.raw_hot = newItem.raw_hot;
    }

    if (originItem.num < newItem.num) {
      // eslint-disable-next-line no-param-reassign
      originItem.num = newItem.num;
    }

    if (originItem.onboard_time > newItem.onboard_time) {
      // eslint-disable-next-line no-param-reassign
      originItem.onboard_time = newItem.onboard_time;
    }
  }

  function appendBand(item) {
    if (!appendBand.filterMap) {
      appendBand.filterMap = new Map();
    }

    const originItem = appendBand.filterMap.get(item.word);
    if (!originItem) {
      appendBand.filterMap.set(item.word, item);
      result.band_list.push(item);
      return;
    }

    // 合并
    mergeBandItem(originItem, item);
  }

  function appendHotgov(hotgov) {
    if (!appendHotgov.filterMap) {
      appendHotgov.filterMap = new Map();
    }

    const originItem = appendHotgov.filterMap.get(hotgov.word);
    if (!originItem) {
      result.hotgov_list.push(hotgov);
      appendHotgov.filterMap.set(hotgov.word, hotgov);
    }
  }

  // 聚合、去重
  for (let i = 0; i < sourceFiles.length; i += 1) {
    const data = getSourceData(sourceFiles[i]);
    const { band_list: bandList, hotgov } = data.source;
    bandList.forEach((item) => {
      appendBand(item);
    });

    appendHotgov(hotgov);
  }

  // 排序
  result.band_list.sort((a, b) => {
    const val = a.raw_hot - b.raw_hot;
    if (val === 0) {
      return 0;
    }

    if (val > 0) {
      return -1;
    }

    return 1;
  });

  return result;
}

// 创建归档目录
function getArchiveDir(timestamp) {
  const date = new Date(timestamp);

  const dir = path.resolve(ARCHIVE_PATH, `${date.getFullYear()}`);
  fs.mkdirSync(dir, { recursive: true });

  return dir;
}

function archive(dir, runTime, data) {
  const date = new Date(runTime);
  const temp = [
    `${date.getMonth() + 1}`.padStart(2, '0'),
    `${date.getDate()}`.padStart(2, '0'),
  ].join('-');
  const file = path.resolve(dir, `${temp}.json`);
  fs.writeFileSync(file, JSON.stringify(data, '', 2), 'utf-8');

  return file;
}

function run(timestamp) {
  const runTime = timestamp || Date.now();
  // 获取当前所有数据文件
  const sourceFiles = getSourceFiles(runTime);

  // 聚合数据
  const data = aggregate(sourceFiles);

  // 创建归档目录
  const dir = getArchiveDir(runTime);

  // 归档 json
  return archive(dir, runTime, data);
}

module.exports = {
  getSourceFiles,
  aggregate,
  run,
};
