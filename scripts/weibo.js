/**
 * 发微博
 */
const axios = require('axios');
const archiveDaily = require('./archive-daily');
const archiveWeekly = require('./archive-weekly');
const archiveMonthly = require('./archive-monthly');
const utils = require('./utils');

// 依赖环境变量
const {
  WEIBO_COOKIE,
  WEIBO_XSRF_TOKEN,
} = process.env;

// 发微博
function send(content) {
  if (!WEIBO_COOKIE || !WEIBO_XSRF_TOKEN) {
    return Promise.reject(new Error('缺少微博账户权限参数'));
  }

  // eslint-disable-next-line no-param-reassign
  content = encodeURIComponent(content);

  return axios({
    url: 'https://weibo.com/ajax/statuses/update',
    method: 'POST',
    data: `content=${content}&pic_id=&visible=0&share_id=&media=%7B%7D&vote=%7B%7D&approval_state=0`,

    headers: {
      'x-xsrf-token': WEIBO_XSRF_TOKEN,
      cookie: WEIBO_COOKIE,

      // 浏览器
      accept: 'application/json, text/plain, */*',
      'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7,ja;q=0.6,ko;q=0.5',
      'content-type': 'application/x-www-form-urlencoded',
      'sec-ch-ua': '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      Referer: 'https://weibo.com/',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  }).then((res) => {
    if (res?.data?.ok !== 1) {
      const message = `${res.data?.message}(${res.data?.ok})`;
      return Promise.reject(new Error(message));
    }
    return res;
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.log('send error: ', error.message);
    return Promise.reject(error);
  });
}

function renderList(data) {
  const bandList = data.band_list
    .slice(0, 100)
    .map((item, index) => {
      const rank = index + 1;

      const flag = index === 0 ? '#' : '';

      return `${rank}. ${flag}${item.word}${flag} （热度：${item.raw_hot}）`;
    }).join('\n');

  return bandList;
}

function renderDesc(data) {
  if (utils.isDaily(data)) {
    return `统计时间段：${utils.formatDate(data.startTime, 1)}（${utils.formatDate(data.startTime, 3)} ~ ${utils.formatDate(data.endTime, 3)}）`;
  }
  return `统计时间段：${utils.formatDate(data.startTime, 3)} ~ ${utils.formatDate(data.endTime, 3)}`;
}

function renderTitle(prefix) {
  const title = `${prefix || ''}微博热搜榜——你认为哪条关注价值最大？`;
  return title;
}

async function renderContent(data, prefixTitle) {
  const title = renderTitle(prefixTitle);
  const desc = renderDesc(data);
  const bandList = renderList(data);

  const content = [
    title,
    '\n',
    '\n',
    desc,
    '\n',
    '\n',
    bandList,
  ].join('');

  return content;
}

/**
 * 生成日榜内容
 * @param {number} timestamp
 * @returns Promise<String>
 */
function generateDailyContent(timestamp, prefixTitle) {
  // 读取数据
  const filePath = archiveDaily.getFilePath(timestamp, 'json');
  const data = utils.readJSON(filePath);

  // 渲染内容
  return renderContent(data, prefixTitle);
}

function generateWeeklyContent(timestamp, prefixTitle) {
  const filePath = archiveWeekly.getFilePath(timestamp, 'json');
  const data = utils.readJSON(filePath);
  return renderContent(data, prefixTitle);
}

function generateMonthlyContent(timestamp, prefixTitle) {
  const filePath = archiveMonthly.getFilePath(timestamp, 'json');
  const data = utils.readJSON(filePath);
  return renderContent(data, prefixTitle);
}

// 发微博
async function sendDaily(timestamp, now) {
  const prefixTitle = now ? '今天' : '昨天';

  const content = await generateDailyContent(timestamp, prefixTitle);
  return send(content);
}

// 发微博（本周）
async function sendWeekly(timestamp, now) {
  const prefixTitle = now ? '本周' : '上周';

  const content = await generateWeeklyContent(timestamp, prefixTitle);

  return send(content);
}

// 发微博（上月）
async function sendMonthly(timestamp) {
  const ss = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  const date = new Date(timestamp);
  const prefixTitle = ss[date.getMonth()];
  const content = await generateMonthlyContent(timestamp, prefixTitle);
  return send(content);
}

module.exports = {
  renderContent,
  generateDailyContent,
  generateWeeklyContent,
  generateMonthlyContent,
  sendDaily,
  sendWeekly,
  sendMonthly,
};
