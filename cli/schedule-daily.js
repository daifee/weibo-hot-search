/**
 * 发布微博
 */
const weibo = require('../scripts/weibo');

const date = new Date();

const hours = date.getHours();

// 早上回顾昨天榜单
if (hours === 8) {
  weibo.sendYesterday();
} else {
  weibo.sendToday();
}
