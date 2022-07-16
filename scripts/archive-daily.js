/**
 * 归档（日榜）
 */
const fs = require('fs');
const path = require('path');
const spider = require('./spider');

// 获取当天所有数据文件
function getDailySourceFilePaths(timestamp) {
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

// 聚合数据

module.exports = {
  getDailySourceFilePaths,
};
