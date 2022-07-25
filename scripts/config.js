/**
 * 配置
 */
const fs = require('fs');
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

// 创建目录
[
  SOURCE_PATH,
  ARCHIVE_PATH,
  ARCHIVE_DAILY_PATH,
  ARCHIVE_WEEKLY_PATH,
  ARCHIVE_MONTHLY_PATH,
  ARCHIVE_YEARLY_PATH,
  TEMPLATES_PATH,
].forEach((dir) => {
  fs.mkdirSync(dir, { recursive: true });
});

module.exports = {
  ARCHIVE_DAILY_PATH,
  ARCHIVE_WEEKLY_PATH,
  ARCHIVE_MONTHLY_PATH,
  ARCHIVE_YEARLY_PATH,
  SOURCE_PATH,
  TEMPLATES_PATH,
};
