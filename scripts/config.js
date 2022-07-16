/**
 * 配置
 */
const fs = require('fs');
const path = require('path');

const basePath = process.env.NODE_ENV === 'test' ? './temp' : './';

const ARCHIVE_PATH = path.resolve(basePath, 'archives');
fs.mkdirSync(ARCHIVE_PATH, { recursive: true });

const SOURCE_PATH = path.resolve(basePath, 'source');
fs.mkdirSync(SOURCE_PATH, { recursive: true });

module.exports = {
  ARCHIVE_PATH,
  SOURCE_PATH,
};
