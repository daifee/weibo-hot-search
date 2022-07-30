/**
 * 发布微博
 */
const weibo = require('../scripts/weibo');

const date = new Date();

const hours = date.getHours();
let now = true;
// 早上回顾昨天榜单
if (hours === 8) {
  date.setDate(date.getDate() - 1);
  now = false;
}
// 发微博
weibo.sendDaily(date.getTime(), now);
