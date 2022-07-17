/**
 * 归档（日榜）
 */
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const spider = require('./spider');
const utils = require('./utils');
const { ARCHIVE_DAILY_PATH, TEMPLATES_PATH } = require('./config');

// 获取当天所有数据文件
function getSourceFiles(runTime) {
  const dir = spider.getDailyDir(runTime);
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
    startTime: Number.MAX_SAFE_INTEGER,
    endTime: 0,
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

    // 时间
    const { runTime } = data;
    if (result.startTime > runTime) {
      result.startTime = runTime;
    }

    if (result.endTime < runTime) {
      result.endTime = runTime;
    }
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
function getArchiveDir(runTime) {
  const date = new Date(runTime);

  const dir = path.resolve(ARCHIVE_DAILY_PATH, `${date.getFullYear()}`);
  fs.mkdirSync(dir, { recursive: true });

  return dir;
}

function getFilePath(runTime, ext) {
  const dir = getArchiveDir(runTime);
  const date = new Date(runTime);
  const temp = [
    `${date.getMonth() + 1}`.padStart(2, '0'),
    `${date.getDate()}`.padStart(2, '0'),
  ].join('-');
  const filePath = path.resolve(dir, `${temp}.${ext}`);
  return filePath;
}

function archiveJSON(runTime, data) {
  const file = getFilePath(runTime, 'json');
  const content = JSON.stringify(data, '', 2);
  fs.writeFileSync(file, content, 'utf-8');

  return content;
}

function renderMD(data) {
  return new Promise((resolve, reject) => {
    const tplPath = path.resolve(__dirname, './templates/archive-daily.md.ejs');
    ejs.renderFile(tplPath, {
      ...data,
      date: utils.formatDate(data.startTime, 1),
      startTime: utils.formatDate(data.startTime, 2),
      endTime: utils.formatDate(data.endTime, 2),
    }, {
      rmWhitespace: true,
      root: TEMPLATES_PATH,
    }, (error, string) => {
      if (error) {
        reject(error);
      } else {
        resolve(string);
      }
    });
  });
}

async function archiveMD(runTime, data) {
  // 渲染内容
  const content = await renderMD(data);

  const file = getFilePath(runTime, 'md');

  fs.writeFileSync(file, content, 'utf-8');

  return content;
}

function copyToREADME(content) {
  const readmeFile = path.resolve('./', 'README.md');

  if (process.env.NODE_ENV === 'test') {
    // eslint-disable-next-line no-param-reassign
    content = fs.readFileSync(readmeFile, 'utf-8');
  }

  fs.writeFileSync(readmeFile, content, 'utf-8');
}

async function run(timestamp) {
  const runTime = timestamp || Date.now();
  // 获取当前所有数据文件
  const sourceFiles = getSourceFiles(runTime);

  // 聚合数据
  const data = aggregate(sourceFiles);

  // 归档 json
  archiveJSON(runTime, data);

  // 归档 md
  const mdContent = await archiveMD(runTime, data);

  // 同步到README.md
  copyToREADME(mdContent);
}

module.exports = {
  getSourceFiles,
  aggregate,
  renderMD,
  getFilePath,
  run,
};
