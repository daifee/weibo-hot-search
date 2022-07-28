/**
 * 发微博
 */
const archiveDaily = require('./archive-daily');
const utils = require('./utils');

// agent 配置

// user 配置

// agent

// 生成微博内容

function generateDailyContent(data) {
  const date = new Date(data.startTime);
  const bandList = data.band_list.map((item, index) => {
    const rank = index + 1;
    return `${rank}. #${item.word}# `;
  }).join('\n');

  const hotgovList = data.hotgov_list.map((item, index) => {
    const rank = index + 1;
    return `${rank}. #${item.word}# `;
  }).join('\n');

  const content = `今天微博热搜榜（${utils.formatDate(date.getTime(), 1)}）
更新时间：${utils.formatDate(data.startTime, 2)}~${utils.formatDate(data.endTime, 2)}
热搜：
${bandList}

正能量：
${hotgovList}`;

  return content;
}

// 发微博
function sendDaily(timestamp) {
  const filePath = archiveDaily.getFilePath(timestamp, 'json');
  const data = utils.readJSON(filePath);

  // 生成内容
  const content = generateDailyContent(data);

  console.log(content);
}

// 发微博（昨天）

module.exports = {
  generateDailyContent,
  sendDaily,
};
