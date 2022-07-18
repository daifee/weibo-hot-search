/**
 * 归档（周榜）
 */

// 通过本周每天对应的时间对象
function getWeeklyDates(runTime) {
  const result = [];
  let date = new Date(runTime);

  do {
    result.unshift(date);
    date = new Date(date.getTime());
    date.setDate((date.getDate() - 1));
  } while (date.getDay() !== 0); // 周日

  return result;
}

module.exports = {
  getWeeklyDates,
};
