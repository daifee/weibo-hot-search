/**
 * 配置
 */
const path = require('path');

// 归档、数据源目录（避免git跟踪测试生成文件）
const basePath = process.env.NODE_ENV === 'test' ? './temp' : './';

// 源数据目录
const SOURCE_PATH = path.resolve(basePath, 'source');
/**
 * 归档目录
 */
const ARCHIVE_PATH = path.resolve(basePath, 'archives');
// 日榜归档目录
const ARCHIVE_DAILY_PATH = path.resolve(ARCHIVE_PATH, 'daily');
// 周榜归档目录
const ARCHIVE_WEEKLY_PATH = path.resolve(ARCHIVE_PATH, 'weekly');
// 月榜归档目录
const ARCHIVE_MONTHLY_PATH = path.resolve(ARCHIVE_PATH, 'monthly');
// 年榜归档目录
const ARCHIVE_YEARLY_PATH = path.resolve(ARCHIVE_PATH, 'yearly');
// 模板目录
const TEMPLATES_PATH = path.resolve('./', 'scripts/templates');

// 最新榜单
const LATEST_DAILY = path.resolve(basePath, 'latest-daily.md');
const LATEST_WEEKLY = path.resolve(basePath, 'latest-weekly.md');
const LATEST_MONTHLY = path.resolve(basePath, 'latest-monthly.md');
const LATEST_YEARLY = path.resolve(basePath, 'latest-yearly.md');

module.exports = {
  ARCHIVE_DAILY_PATH,
  ARCHIVE_WEEKLY_PATH,
  ARCHIVE_MONTHLY_PATH,
  ARCHIVE_YEARLY_PATH,
  SOURCE_PATH,
  TEMPLATES_PATH,

  LATEST_DAILY,
  LATEST_WEEKLY,
  LATEST_MONTHLY,
  LATEST_YEARLY,
};
