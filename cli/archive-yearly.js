const archiveYearly = require('../scripts/archive-yearly');

const date = new Date();

archiveYearly.run(date.getTime());
