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

// 创建归档目录
function getArchiveDir(runTime) {
  const date = new Date(runTime);

  const dir = path.resolve(ARCHIVE_DAILY_PATH, `${date.getFullYear()}`);
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
  const filePath = getFilePath(runTime, 'json');
  utils.archiveJSON(filePath, data);
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

async function archiveMD(runTime, content) {
  const filePath = getFilePath(runTime, 'md');
  utils.archiveMD(filePath, content);
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
  const data = utils.aggregate(sourceFiles, utils.convertDataFromSpider);

  // 归档 json
  archiveJSON(runTime, data);

  // 渲染MD
  const md = await renderMD(data);
  // 归档 md
  archiveMD(runTime, md);

  // 同步到README.md
  copyToREADME(md);
}

module.exports = {
  getSourceFiles,
  getArchiveDir,
  getFilePath,
  archiveJSON,
  archiveMD,
  renderMD,
  run,
};
