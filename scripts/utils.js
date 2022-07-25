const fs = require('fs');

// 鉴别真正热搜（原列表会掺杂广告）
function isHotSearch(item) {
  return !!(item.raw_hot && item.onboard_time);
}

function trimHotSearchItem(item = {}) {
  return {
    raw_hot: item.raw_hot,
    num: item.num,
    word: item.word,
    onboard_time: item.onboard_time,
    rank: item.rank,
    category: item.category,
  };
}

function formatDateOne(timestamp) {
  const d = new Date(timestamp);

  return [
    d.getFullYear(),
    `${d.getMonth() + 1}`.padStart(2, '0'),
    `${d.getDate()}`.padStart(2, '0'),
  ].join('/');
}

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

function formatDate(timestamp, type) {
  if (typeof timestamp !== 'number') {
    return '';
  }

  switch (type) {
    case 1:
      return formatDateOne(timestamp);
    case 2:
      return formatDateTow(timestamp);
    default:
      return '';
  }
}

function readJSON(filePath) {
  const json = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(json);
}

// 聚合数据
function aggregate(sourceFiles) {
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
    const data = readJSON(sourceFiles[i]);
    const { band_list: bandList, hotgov } = data.source;
    bandList.forEach((item) => {
      appendBand(item);
    });

    appendHotgov(hotgov);

    // 时间
    const { runTime } = data;
    if (result.startTime > runTime) {
      result.startTime = runTime;
    }

    if (result.endTime < runTime) {
      result.endTime = runTime;
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

function archiveJSON(filePath, data = {}) {
  const content = JSON.stringify(data, '', 2);
  fs.writeFileSync(filePath, content, 'utf-8');
}

function archiveMD(filePath, content = '') {
  fs.writeFileSync(filePath, content, 'utf-8');
}

module.exports = {
  isHotSearch,
  trimHotSearchItem,
  formatDate,

  readJSON,
  aggregate,
  archiveJSON,
  archiveMD,
};
