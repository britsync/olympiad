const axios = require('axios');

const testData = {
    teamName: "REGISTRATION_TEST_" + Date.now(),
    type: "Team",
    category: "Project",
    projectIdea: "A testing vision for the sync protocol.",
    members: [
        { name: "LEGALL_TEST", email: "legal_test@gmail.com", role: "Tech" }
    ]
};

axios.post('http://localhost:5000/api/teams/register', testData)
    .then(res => {
        console.log('SUCCESS:', res.data);
        process.exit(0);
    })
    .catch(err => {
        console.error('FAILURE:', err.response ? err.response.data : err.message);
        process.exit(1);
    });
