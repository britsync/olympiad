const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function convert() {
    try {
        console.log('Launching browser...');
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();

        const htmlPath = path.join(__dirname, '..', 'SUBMISSION_TEMPLATE.html');
        const pdfPath = path.join(__dirname, '..', 'WAQAR_SUBMISSION.pdf');

        console.log('Reading HTML from:', htmlPath);
        const htmlContent = fs.readFileSync(htmlPath, 'utf8');
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        console.log('Generating PDF...');
        await page.pdf({
            path: pdfPath,
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px'
            }
        });

        console.log('PDF_GENERATED_SUCCESSFULLY: ' + pdfPath);
        await browser.close();
    } catch (error) {
        console.error('PDF_GENERATION_ERROR:', error);
        process.exit(1);
    }
}

convert();
