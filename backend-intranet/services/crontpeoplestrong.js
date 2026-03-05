const axios = require('axios');

const PEOPLESTRONG_URL =process.env.PEOPLESTRONG_BASE_URL
//   'https://japfaindia.peoplestrong.com/api/integrationframework/outbound';

exports.fetchEmployeeMaster = async ({ token, apiKey }) => {
  const response = await axios.post(
    `${PEOPLESTRONG_URL}?flag=2&integrationName=Employee%20Master%20Data`,
    {
      integrationMasterName: process.env.PEOPLESTRONG_INTEGRATION_NAME,
      startFromTop: true
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.PEOPLESTRONG_ACCESS_TOKEN}`,
        apikey: process.env.PEOPLESTRONG_API_KEY,
        'Content-Type': 'application/json'
      },
      timeout: 60000
    }
  );

  return response.data;
};
