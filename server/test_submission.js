const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testSubmission() {
    try {
        // 1. Get a team to submit for
        const teamsRes = await axios.get('http://localhost:5000/api/teams');
        const team = teamsRes.data[0];

        if (!team) {
            console.error('No teams found to test submission with. Run registration test first.');
            return;
        }

        console.log(`Testing submission for team: ${team.teamName} (${team._id})`);

        // 2. Prepare Form Data
        const form = new FormData();
        form.append('teamId', team._id.toString());
        form.append('category', 'Project');
        form.append('videoLink', 'https://youtube.com/test');

        // Use an existing file or a dummy one
        const pdfPath = path.join(__dirname, 'test.pdf');
        if (!fs.existsSync(pdfPath)) {
            fs.writeFileSync(pdfPath, '%PDF-1.4\n1 0 obj\n<< /Title (Sustainability Impact) /Keywords (Sustainability, Community Impact) >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF');
        }

        form.append('pdf', fs.createReadStream(pdfPath));

        const res = await axios.post('http://localhost:5000/api/submissions/submit', form, {
            headers: form.getHeaders()
        });

        console.log('SUBMISSION SUCCESS:', res.data);
    } catch (err) {
        console.error('SUBMISSION FAILURE:', err.response ? err.response.data : err.message);
    }
}

testSubmission();
