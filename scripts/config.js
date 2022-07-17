/**
 * 配置
 */
const fs = require('fs');
const path = require('path');

// 归档、数据源目录（避免git跟踪测试生成文件）
const basePath = process.env.NODE_ENV === 'test' ? './temp' : './';

// 源数据目录
const SOURCE_PATH = path.resolve(basePath, 'source');
fs.mkdirSync(SOURCE_PATH, { recursive: true });

const ARCHIVE_PATH = path.resolve(basePath, 'archives');

// 日榜归档目录
const ARCHIVE_DAILY_PATH = path.resolve(ARCHIVE_PATH, 'daily');
fs.mkdirSync(ARCHIVE_DAILY_PATH, { recursive: true });

// 周榜归档目录
const ARCHIVE_WEEKLY_PATH = path.resolve(ARCHIVE_PATH, 'weekly');
fs.mkdirSync(ARCHIVE_WEEKLY_PATH, { recursive: true });

// 月榜归档目录
const ARCHIVE_MONTHLY_PATH = path.resolve(ARCHIVE_PATH, 'monthly');
fs.mkdirSync(ARCHIVE_MONTHLY_PATH, { recursive: true });

// 年榜归档目录
const ARCHIVE_YEARLY_PATH = path.resolve(ARCHIVE_PATH, 'yearly');
fs.mkdirSync(ARCHIVE_YEARLY_PATH, { recursive: true });

// 模板目录
const TEMPLATES_PATH = path.resolve('./', 'scripts/templates');

module.exports = {
  ARCHIVE_DAILY_PATH,
  SOURCE_PATH,
  TEMPLATES_PATH,
};
