const fs = require('fs');
const path = require('path');

function getFilePathsFromDir(dir) {
  const fileNames = fs.readdirSync(dir, 'utf-8');

  return fileNames.map((fileName) => {
    return path.resolve(dir, fileName);
  });
}

module.exports = {
  getFilePathsFromDir,
};
