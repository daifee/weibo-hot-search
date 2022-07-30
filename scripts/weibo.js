/**
 * 发微博
 */
const axios = require('axios');
const archiveDaily = require('./archive-daily');
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

/**
 * 渲染日榜内容（限制5000个字符）
 * Text too long, please input text less than 5000 characters!
 * @param {object} data
 * @returns Promise<String>
 */
async function renderDailyContent(data, type) {
  const titleMap = {
    today: '今天',
    yesterday: '昨天',
  };
  const title = titleMap[type] || '';

  const date = new Date(data.startTime);
  const bandList = data.band_list
    .slice(0, 100)
    .map((item, index) => {
      const rank = index + 1;
      return `${rank}. #${item.word}# （热度：${item.raw_hot}）`;
    }).join('\n');

  const content = `${title}微博热搜——哪条热搜有关注价值？
数据时间段：${utils.formatDate(date.getTime(), 1)}（${utils.formatDate(data.startTime, 3)} ~ ${utils.formatDate(data.endTime, 3)}）

${bandList}`;

  return content;
}

/**
 * 生成日榜内容
 * @param {number} timestamp
 * @returns Promise<String>
 */
function generateDailyContent(timestamp, type) {
  // 读取数据
  const filePath = archiveDaily.getFilePath(timestamp, 'json');
  const data = utils.readJSON(filePath);

  // 渲染内容
  return renderDailyContent(data, type);
}

// 发微博
async function sendDaily(timestamp, type) {
  const content = await generateDailyContent(timestamp, type);
  return send(content);
}

// 发微博（昨天）
function sendYesterday() {
  const date = new Date();
  date.setDate(date.getDate() - 1);

  return sendDaily(date.getTime(), 'yesterday');
}

// 发微博（今天）
function sendToday() {
  const date = new Date();

  return sendDaily(date.getTime(), 'today');
}

module.exports = {
  renderDailyContent,
  generateDailyContent,
  sendYesterday,
  sendToday,
};
