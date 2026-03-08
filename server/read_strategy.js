const fs = require('fs');
const { PDFParse } = require('pdf-parse');

async function readPdf() {
    try {
        const dataBuffer = fs.readFileSync('..\\Comprehensive Website Structure Strategy_for_Global AI Olympiad (1).pdf');
        const parser = new PDFParse({ data: dataBuffer });
        const data = await parser.getText();
        fs.writeFileSync('strategy_text.txt', data.text);
        console.log("PDF text extracted to strategy_text.txt");
    } catch (error) {
        console.error(error);
    }
}

readPdf();
