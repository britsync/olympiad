const fs = require('fs');
const pdf = require('pdf-parse');
const path = require('path');

async function extract() {
    const dir = process.cwd();
    console.log('Starting extraction with pdf-parse@1.1.1');

    const targetFiles = [
        { pattern: 'GAIO Investor Profile.pdf', dest: 'investor_profile_extracted.txt' },
        { pattern: 'Comprehensive Website Structure Strategy', dest: 'strategy_extracted.txt' }
    ];

    for (const target of targetFiles) {
        const items = fs.readdirSync(dir);
        const found = items.find(f => f.includes(target.pattern));
        if (found) {
            console.log(`Processing: ${found}`);
            const dataBuffer = fs.readFileSync(path.join(dir, found));
            try {
                const data = await pdf(dataBuffer);
                fs.writeFileSync(path.join(dir, target.dest), data.text);
                console.log(`SUCCESS: ${target.dest}`);
            } catch (e) {
                console.error(`Error parsing ${found}:`, e.message);
            }
        }
    }
    console.log('PDF_EXTRACTION_COMPLETE');
}

extract();
