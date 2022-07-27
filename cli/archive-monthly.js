const archiveMonthly = require('../scripts/archive-monthly');

const date = new Date();

archiveMonthly.run(date.getTime());
