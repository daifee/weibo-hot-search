const fs = require('fs');

// 2022/07/17
function formatDateOne(timestamp) {
  const d = new Date(timestamp);

  return [
    d.getFullYear(),
    `${d.getMonth() + 1}`.padStart(2, '0'),
    `${d.getDate()}`.padStart(2, '0'),
  ].join('/');
}

// 2022/07/17 12:01:49
function formatDateTow(timestamp) {
  const d = new Date(timestamp);
  const ymd = [
    d.getFullYear(),
    `${d.getMonth() + 1}`.padStart(2, '0'),
    `${d.getDate()}`.padStart(2, '0'),
  ].join('/');

  const hms = [
    `${d.getHours()}`.padStart(2, '0'),
    `${d.getMinutes()}`.padStart(2, '0'),
    `${d.getSeconds()}`.padStart(2, '0'),
  ].join(':');

  return `${ymd} ${hms}`;
}

// 12:01
function formatDateThree(timestamp) {
  const d = new Date(timestamp);

  const hms = [
    `${d.getHours()}`.padStart(2, '0'),
    `${d.getMinutes()}`.padStart(2, '0'),
  ].join(':');

  return hms;
}

function formatDate(timestamp, type) {
  if (typeof timestamp !== 'number') {
    return '';
  }

  switch (type) {
    case 1:
      return formatDateOne(timestamp);
    case 2:
      return formatDateTow(timestamp);
    case 3:
      return formatDateThree(timestamp);
    default:
      return '';
  }
}

function readJSON(filePath) {
  const json = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(json);
}

function convertDataFromSpider(data) {
  let { runTime } = data;
  if (typeof runTime === 'string') {
    const d = new Date(runTime);
    runTime = d.getTime();
  }

  return {
    startTime: runTime,
    endTime: runTime,
    band_list: data.source?.band_list || [],
    hotgov_list: data.source?.hotgov ? [data.source?.hotgov] : [],
  };
}

function isDaily({ startTime, endTime }) {
  const differ = endTime - startTime;
  // 1000 * 60 * 60 * 24
  return differ < (1000 * 60 * 60 * 24);
}

// 聚合数据
function aggregate(sourceFiles, convertData) {
  const result = {
    startTime: Number.MAX_SAFE_INTEGER,
    endTime: 0,
    band_list: [],
    hotgov_list: [],
  };

  function mergeBandItem(originItem, newItem) {
    if (originItem.raw_hot < newItem.raw_hot) {
      // eslint-disable-next-line no-param-reassign
      originItem.raw_hot = newItem.raw_hot;
    }

    if (originItem.num < newItem.num) {
      // eslint-disable-next-line no-param-reassign
      originItem.num = newItem.num;
    }

    if (originItem.onboard_time > newItem.onboard_time) {
      // eslint-disable-next-line no-param-reassign
      originItem.onboard_time = newItem.onboard_time;
    }
  }

  function appendBand(item) {
    if (!appendBand.filterMap) {
      appendBand.filterMap = new Map();
    }

    const originItem = appendBand.filterMap.get(item.word);
    if (!originItem) {
      appendBand.filterMap.set(item.word, item);
      result.band_list.push(item);
      return;
    }

    // 合并
    mergeBandItem(originItem, item);
  }

  function appendHotgov(hotgov) {
    if (!appendHotgov.filterMap) {
      appendHotgov.filterMap = new Map();
    }

    const originItem = appendHotgov.filterMap.get(hotgov.word);
    if (!originItem) {
      result.hotgov_list.push(hotgov);
      appendHotgov.filterMap.set(hotgov.word, hotgov);
    }
  }

  // 聚合、去重
  for (let i = 0; i < sourceFiles.length; i += 1) {
    let data = readJSON(sourceFiles[i]);
    if (convertData) {
      data = convertData(data);
    }
    const {
      startTime,
      endTime,
      hotgov_list: hotgovList,
      band_list: bandList,
    } = data;

    bandList.forEach((item) => {
      appendBand(item);
    });

    hotgovList.forEach((item) => {
      appendHotgov(item);
    });

    // 时间
    if (result.startTime > startTime) {
      result.startTime = startTime;
    }

    if (result.endTime < endTime) {
      result.endTime = endTime;
    }
  }

  // 排序
  result.band_list.sort((a, b) => {
    const val = a.raw_hot - b.raw_hot;
    if (val === 0) {
      return 0;
    }

    if (val > 0) {
      return -1;
    }

    return 1;
  });

  return result;
}

function extractDir(filePath) {
  const fragments = filePath.split('/');
  fragments.pop();

  return fragments.join('/');
}

function createFileIfNotExist(filePath) {
  if (fs.existsSync(filePath)) {
    return true;
  }

  const dir = extractDir(filePath);
  fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(filePath, '', 'utf-8');
  return true;
}

function archiveJSON(filePath, data = {}) {
  createFileIfNotExist(filePath);

  const content = JSON.stringify(data, '', 2);
  fs.writeFileSync(filePath, content, { encoding: 'utf-8' });
}

function archiveMD(filePath, content = '') {
  createFileIfNotExist(filePath);

  fs.writeFileSync(filePath, content, { encoding: 'utf-8' });
}

module.exports = {
  formatDate,

  readJSON,
  aggregate,
  archiveJSON,
  archiveMD,

  extractDir,
  createFileIfNotExist,
  convertDataFromSpider,

  isDaily,
};
