/**
 * 爬取榜单数据
 */
const axios = require('axios');
const path = require('path');
const { SOURCE_PATH } = require('./config');
const utils = require('./utils');

// 鉴别真正热搜（原列表会掺杂广告）
function isHotSearchItem(item) {
  if (!item) {
    return false;
  }
  return !!(item.raw_hot && item.onboard_time && item.word);
}

function trimHotSearchItem(item = {}) {
  const keys = ['raw_hot', 'num', 'word', 'onboard_time', 'rank', 'category'];
  const result = {};

  keys.forEach((key) => {
    if (item[key] !== undefined) {
      result[key] = item[key];
    }
  });

  return result;
}

function createAgent() {
  const headers = {
    accept: 'application/json, text/plain, */*',
    'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7,ja;q=0.6,ko;q=0.5',
    'client-version': 'v2.34.67',
    'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="101", "Google Chrome";v="101"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'server-version': 'v2022.07.15.2',
    traceparent: '00-2a4bbdb8459e3f70b376c1b13e786541-d96d319e15e0a7c0-00',
    'x-requested-with': 'XMLHttpRequest',
    'x-xsrf-token': 'qpGxyVSo3PR3Sq8Xh4c9IAi9',
    cookie: 'SUB=_2AkMVnKU3f8NxqwJRmP4TzGvjb4xywwzEieKjwFTsJRMxHRl-yT9kqkI9tRB6PhyL2Afa9peDRzuoDRuSNDvsYKEQD_aJ; SUBP=0033WrSXqPxfM72-Ws9jqgMF55529P9D9WhISzwZ1.52dsJPLAIieEju; XSRF-TOKEN=qpGxyVSo3PR3Sq8Xh4c9IAi9; WBPSESS=kErNolfXeoisUDB3d9TFHyljRUAZhHq5nbkr54GXqOxWqDwebRUdbbqBg-BJyvghUvtfAzavqqt5QZPkGt1P8QrRCUA_Z4tQtgqWtahYWtvzVkr-ebm4E4JwBycd7fCxWfBHmeBr8Tv34X_ETJAZL6INbEBO07IB_N73BCXhhpU=',
    Referer: 'https://weibo.com/newlogin?tabtype=search&openLoginLayer=0&url=https%3A%2F%2Fweibo.com%2F',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };

  const agent = axios.create({
    timeout: 10000,
    headers,
  });

  agent.interceptors.response.use((res) => {
    if (!res.data) {
      const error = new Error('响应体没有数据');
      error.response = res;
      return Promise.reject(error);
    }

    if (typeof res.data !== 'object') {
      const error = new Error('响应数据编码不合法');
      error.response = res;
      return Promise.reject(error);
    }

    if (res.data.ok !== 1) {
      const error = new Error(`请求处理错误：${res.data.ok}`);
      error.response = res;
      return Promise.reject(error);
    }

    return res.data.data;
  });

  return agent;
}

// 重试次数，事不过三
let attempts = 2;
function fetchHotSearchList() {
  const url = 'https://weibo.com/ajax/statuses/hot_band';
  const agent = createAgent();

  return agent.get(url)
    .catch((error) => {
      if (attempts > 0) {
        attempts -= 1;
        return fetchHotSearchList();
      }

      return Promise.reject(error);
    });
}

function getDailyDir(runTime) {
  const date = new Date(runTime);
  const datePath = [
    `${date.getFullYear()}`,
    `${date.getMonth() + 1}`.padStart(2, '0'),
    `${date.getDate()}`.padStart(2, '0'),
  ].join('/');

  const dir = path.resolve(SOURCE_PATH, datePath);
  return dir;
}

// 定义文件路径：$root/source/2022/07/18/1658074311206.json
function getFilePath(runTime) {
  const dir = getDailyDir(runTime);
  return `${dir}/${runTime}.json`;
}

function saveSourceData(runTime, data) {
  const filePath = getFilePath(runTime);

  utils.archiveJSON(filePath, {
    runTime,
    source: data,
  });
}

// 修剪源数据
function trimData(data) {
  const result = {
    band_list: [],
    hotgov: null,
  };

  if (data?.band_list) {
    result.band_list = data.band_list.filter((item) => {
      return isHotSearchItem(item);
    }).map((item) => {
      return trimHotSearchItem(item);
    });
  }

  if (data?.hotgov) {
    result.hotgov = trimHotSearchItem(data.hotgov);
  }

  return result;
}

// 工作
async function run(timestamp) {
  const runTime = timestamp || Date.now();

  // 请求数据
  let data = await fetchHotSearchList();

  // 修剪数据，过滤非热搜（不然太大）
  data = trimData(data);

  // 记录数据
  return saveSourceData(runTime, data);
}

module.exports = {
  isHotSearchItem,
  trimHotSearchItem,
  trimData,
  getFilePath,

  saveSourceData,

  run,
  getDailyDir,
};
