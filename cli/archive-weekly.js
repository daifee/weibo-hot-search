const archiveWeekly = require('../scripts/archive-weekly');

const date = new Date();

archiveWeekly.run(date.getTime());
