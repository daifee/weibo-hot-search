/**
 * 归档（月榜）
 *
 */
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');
const archiveDaily = require('./archive-daily');
const utils = require('./utils');
const { ARCHIVE_MONTHLY_PATH, TEMPLATES_PATH } = require('./config');

function getMonthlyDates(runTime) {
  const result = [];
  let date = new Date(runTime);

  const month = date.getMonth();

  while (date.getMonth() === month) {
    result.unshift(date);
    date = new Date(date.getTime());
    date.setDate(date.getDate() - 1);
  }

  return result;
}

// 获取当月每天的归档文件
function getSourceFiles(runTime) {
  const dates = getMonthlyDates(runTime);
  const result = dates.map((date) => {
    const timestamp = date.getTime();
    return archiveDaily.getFilePath(timestamp, 'json');
  }).filter((filePath) => {
    return fs.existsSync(filePath);
  });

  return result;
}

// ARCHIVE_MONTHLY_PATH/2022-07.json
function getFilePath(runTime, ext) {
  const dir = path.resolve(ARCHIVE_MONTHLY_PATH);
  const date = new Date(runTime);

  const temp = [
    `${date.getFullYear()}`,
    `${date.getMonth() + 1}`.padStart(2, '0'),
  ].join('-');
  const filePath = path.resolve(dir, `${temp}.${ext}`);

  return filePath;
}

function archiveJSON(runTime, data) {
  const filePath = getFilePath(runTime, 'json');
  utils.archiveJSON(filePath, data);
}

function renderMD(data) {
  return new Promise((resolve, reject) => {
    const tplPath = path.resolve(TEMPLATES_PATH, 'archive-monthly.md.ejs');

    const date = new Date(data.startTime);
    const sDate = [
      date.getFullYear(),
      `${date.getMonth() + 1}`.padStart(2, '0'),
    ].join('/');

    ejs.renderFile(tplPath, {
      hotgov_list: data.hotgov_list,
      band_list: data.band_list.slice(0, 1000),
      date: sDate,
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

function archiveMD(runTime, content) {
  const filePath = getFilePath(runTime, 'md');

  utils.archiveMD(filePath, content);
}

async function run(timestamp) {
  const runTime = timestamp || Date.now();

  const sourceFiles = getSourceFiles(runTime);
  const data = utils.aggregate(sourceFiles);

  archiveJSON(runTime, data);

  const md = await renderMD(data);
  archiveMD(runTime, md);
}

module.exports = {
  getMonthlyDates,
  getSourceFiles,
  getFilePath,
  archiveJSON,
  renderMD,
  archiveMD,
  run,
};
