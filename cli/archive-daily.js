const archiveDaily = require('../scripts/archive-daily');

const date = new Date();

archiveDaily.run(date.getTime());
