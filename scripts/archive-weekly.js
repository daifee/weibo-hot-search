/**
 * 归档（周榜）
 */
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const dailyArchive = require('./archive-daily');
const utils = require('./utils');

const { ARCHIVE_WEEKLY_PATH, TEMPLATES_PATH } = require('./config');

function setMonday(date) {
  while (date.getDay() !== 1) {
    const d = date.getDate();
    date.setDate(d - 1);
  }

  return date;
}

// 通过本周每天对应的时间对象
function getWeeklyDates(runTime) {
  const result = [];
  let date = new Date(runTime);

  do {
    result.unshift(date);
    date = new Date(date.getTime());
    date.setDate((date.getDate() - 1));
  } while (date.getDay() !== 0); // 周日

  return result;
}

function getSourceFiles(runTime) {
  const dates = getWeeklyDates(runTime);

  return dates.map((date) => {
    return dailyArchive.getFilePath(date.getTime(), 'json');
  }).filter((filePath) => {
    return fs.existsSync(filePath);
  });
}

function getArchiveDir(runTime) {
  const date = new Date(runTime);
  const dir = path.resolve(ARCHIVE_WEEKLY_PATH, `${date.getFullYear()}`);
  return dir;
}

// 每周周一
function getFilePath(runTime, ext) {
  const dir = getArchiveDir(runTime);
  const date = new Date(runTime);
  setMonday(date);
  const temp = [
    `${date.getMonth() + 1}`.padStart(2, '0'),
    `${date.getDate()}`.padStart(2, '0'),
  ].join('-');
  const filePath = path.resolve(dir, `${temp}.${ext}`);
  return filePath;
}

function archiveJSON(runTime, data = {}) {
  const filePath = getFilePath(runTime, 'json');
  utils.archiveJSON(filePath, data);
}

function renderMD(data) {
  return new Promise((resolve, reject) => {
    const tplPath = path.resolve(TEMPLATES_PATH, 'archive-weekly.md.ejs');
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

function archiveMD(runTime, content) {
  const filePath = getFilePath(runTime, 'md');

  utils.archiveMD(filePath, content);
}

async function run(timestamp) {
  const runTime = timestamp || Date.now();

  // 获取本周7天数据文件
  const sourceFiles = getSourceFiles(runTime);

  // 聚合数据
  const data = utils.aggregate(sourceFiles);

  // 归档 JSON
  archiveJSON(runTime, data);

  // 渲染 MD
  const md = await renderMD(data);

  // 归档 MD
  archiveMD(runTime, md);
}

module.exports = {
  getWeeklyDates,
  getSourceFiles,
  setMonday,
  getArchiveDir,
  getFilePath,
  archiveJSON,

  renderMD,
  archiveMD,
  run,
};
