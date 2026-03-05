const cron = require('node-cron');
const { runEmployeeSync } = require('../jobs/employee-sync.job');

// Run on 1st of every month at 02:00 AM
cron.schedule(process.env.EMPLOYEE_SYNC_CRON, async () => {
  console.log('Running PeopleStrong Employee Sync');
  await runEmployeeSync();
});
