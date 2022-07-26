const archiveDaily = require('../scripts/archive-daily');

const date = new Date();
const hours = date.getHours();

// 当天最后一次更新，避免 cron 延迟造成跨天
if (hours === 0) {
  date.setMinutes(-30);
}

archiveDaily.run(date.getTime());
