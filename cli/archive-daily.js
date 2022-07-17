const archiveDaily = require('../scripts/archive-daily');

// 互联网访问高峰时段
const RUN_HOURS = [
  8,
  12,
  19,
  22,
  0,
];

const date = new Date();
const hours = date.getHours();

if (RUN_HOURS.includes(hours)) {
  // 避免 cron 延迟
  if (hours === 0) {
    date.setMinutes(-30);
  }

  archiveDaily.run(date.getTime());
} else {
  // eslint-disable-next-line no-console
  console.log('不执行归档任务');
}
