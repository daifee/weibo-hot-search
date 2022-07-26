const fs = require('fs');
const path = require('path');

function getFilePathsFromDir(dir) {
  const fileNames = fs.readdirSync(dir, 'utf-8');

  return fileNames.map((fileName) => {
    return path.resolve(dir, fileName);
  });
}

function cleanTempDir() {
  fs.rmSync('./temp', {
    recursive: true,
    force: true,
  });

  fs.mkdirSync('./temp', { recursive: true });
}

// cleanTempDir();
// cleanTempDir();
// cleanTempDir();
// cleanTempDir();

module.exports = {
  getFilePathsFromDir,
  cleanTempDir,
};
