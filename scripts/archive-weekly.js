/**
 * 归档（周榜）
 */
const fs = require('fs');
const dailyArchive = require('./archive-daily');

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

function getDailyArchiveFilePath(runTime) {
  return dailyArchive.getFilePath(runTime, 'json');
}

function getSourceFiles(runTime) {
  const dates = getWeeklyDates(runTime);
  return dates.map((date) => {
    return getDailyArchiveFilePath(date.getTime());
  }).filter((filePath) => {
    return fs.existsSync(filePath);
  });
}

function aggregate(sourceFiles) {
  // todo
}

function run(timestamp) {
  const runTime = timestamp || Date.now();

  // 获取本周7天数据文件
  const sourceFiles = getSourceFiles(runTime);

  // 聚合数据
  const data = aggregate(sourceFiles);

  console.log(data);

  // 归档 JSON

  // 归档 MD
}

module.exports = {
  getWeeklyDates,
  getDailyArchiveFilePath,
  getSourceFiles,
  aggregate,
  run,
};
