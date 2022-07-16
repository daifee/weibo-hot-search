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
  };
}

module.exports = {
  isHotSearch,
  trimHotSearchItem,
};
