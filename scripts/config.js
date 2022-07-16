/**
 * 配置
 */
const fs = require('fs');
const path = require('path');

const ARCHIVE_PATH = path.resolve('./', 'archives');
fs.mkdirSync(ARCHIVE_PATH, { recursive: true });

const SOURCE_PATH = path.resolve('./', 'source');
fs.mkdirSync(SOURCE_PATH, { recursive: true });

module.exports = {
  ARCHIVE_PATH,
  SOURCE_PATH,
};
