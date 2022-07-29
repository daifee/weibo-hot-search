/**
 * 发微博
 */
const archiveDaily = require('./archive-daily');
const utils = require('./utils');

// agent 配置

// user 配置

// agent

// 发微博
function send(content) {
  // TODO
  console.log(content);
}

/**
 * 渲染日榜内容
 * @param {object} data
 * @returns Promise<String>
 */
async function renderDailyContent(data) {
  const date = new Date(data.startTime);
  const bandList = data.band_list.map((item, index) => {
    const rank = index + 1;
    return `${rank}. #${item.word}# （热度：${item.raw_hot}）`;
  }).join('\n');

  const hotgovList = data.hotgov_list.map((item, index) => {
    const rank = index + 1;
    return `${rank}. ${item.word} `;
  }).join('\n');

  const content = `微博热搜——日榜（${utils.formatDate(date.getTime(), 1)}）
更新时间：${utils.formatDate(data.startTime, 3)} ~ ${utils.formatDate(data.endTime, 3)}
热搜列表：
${bandList}

正能量列表：
${hotgovList}`;

  return content;
}

/**
 * 生成日榜内容
 * @param {number} timestamp
 * @returns Promise<String>
 */
function generateDailyContent(timestamp) {
  // 读取数据
  const filePath = archiveDaily.getFilePath(timestamp, 'json');
  const data = utils.readJSON(filePath);

  // 渲染内容
  return renderDailyContent(data);
}

// 发微博
async function sendDaily(timestamp) {
  const content = await generateDailyContent(timestamp);
  send(content);
}

// 发微博（昨天）
function sendYesterday() {
  const date = new Date();
  date.setDate(date.getDate() - 1);

  sendDaily(date.getTime());
}

// 发微博（今天）
function sendToday() {
  const date = new Date();

  sendDaily(date.getTime());
}

module.exports = {
  renderDailyContent,
  generateDailyContent,
  sendYesterday,
  sendToday,
};
