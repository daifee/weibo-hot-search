const archiveDaily = require('../scripts/archive-daily');

const date = new Date();

/**
 * 两次执行归档
 * - 22:00: 今天热榜
 * - 08:00: 昨天热榜
 */
const hours = date.getHours();
if (hours === 8) {
  // 昨天
  date.setDate(date.getDate() - 1);
  archiveDaily.run(date.getTime());
} else if (hours === 22) {
  archiveDaily.run(date.getTime());
} else {
  // eslint-disable-next-line no-console
  console.log('不执行归档任务');
}
