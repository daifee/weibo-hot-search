/**
 * 爬取榜单数据
 */
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const { SOURCE_PATH } = require('./config');

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
  }, (error) => {
    console.error(error);
    return Promise.reject(error);
  });

  return agent;
}

function fetchHotSearchList() {
  const url = 'https://weibo.com/ajax/statuses/hot_band';
  const agent = createAgent();

  return agent.get(url);
}

function getDataFilePath(runTime) {
  const date = new Date(runTime);
  const datePath = [
    `${date.getFullYear()}`,
    `${date.getMonth() + 1}`.padStart(2, '0'),
    `${date.getDate()}`.padStart(2, '0'),
  ].join('/');

  const dir = path.resolve(SOURCE_PATH, datePath);

  fs.mkdirSync(dir, { recursive: true });

  return `${dir}/${runTime}.json`;
}

function saveSourceData(runTime, data) {
  const json = JSON.stringify({
    runTime: (new Date(runTime)).toString(),
    source: data,
  }, '', 2);
  const filePath = getDataFilePath(runTime);
  fs.writeFileSync(filePath, json, 'utf-8');
}

// 工作
async function run() {
  const runTime = Date.now();

  // 请求数据
  const data = await fetchHotSearchList();

  // 记录数据
  saveSourceData(runTime, data);
}

module.exports = {
  run,
};
