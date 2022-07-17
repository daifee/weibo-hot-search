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

module.exports = {
  isHotSearch,
  trimHotSearchItem,
  formatDate,
};
