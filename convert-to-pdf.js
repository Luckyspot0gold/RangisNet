#!/usr/bin/env node

const fs = require('fs');
const puppeteer = require('puppeteer');
const { marked } = require('marked');

async function convertMarkdownToPDF(mdFile, pdfFile) {
    // Read the markdown file
    const markdown = fs.readFileSync(mdFile, 'utf8');
    
    // Convert markdown to HTML
    const html = marked(markdown);
    
    // Create full HTML document with styling
    const fullHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        @page {
            size: A4;
            margin: 2cm;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        h1 {
            color: #0066cc;
            border-bottom: 3px solid #0066cc;
            padding-bottom: 10px;
            margin-top: 30px;
            page-break-before: always;
        }
        h1:first-of-type {
            page-break-before: avoid;
        }
        h2 {
            color: #0088ff;
            margin-top: 25px;
            border-bottom: 2px solid #eee;
            padding-bottom: 5px;
        }
        h3 {
            color: #00aaff;
            margin-top: 20px;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 20px 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        th {
            background-color: #0066cc;
            color: white;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        code {
            background-color: #f4f4f4;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }
        pre {
            background-color: #f4f4f4;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
        }
        blockquote {
            border-left: 4px solid #0066cc;
            padding-left: 20px;
            margin: 20px 0;
            color: #666;
            font-style: italic;
        }
        ul, ol {
            margin: 15px 0;
            padding-left: 30px;
        }
        li {
            margin: 8px 0;
        }
        strong {
            color: #0066cc;
        }
        .emoji {
            font-size: 1.2em;
        }
        hr {
            border: none;
            border-top: 2px solid #eee;
            margin: 30px 0;
        }
        a {
            color: #0066cc;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
${html}
</body>
</html>
    `;
    
    // Launch browser and generate PDF
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(fullHtml);
    
    await page.pdf({
        path: pdfFile,
        format: 'A4',
        printBackground: true,
        margin: {
            top: '20mm',
            right: '20mm',
            bottom: '20mm',
            left: '20mm'
        }
    });
    
    await browser.close();
    console.log(`✅ PDF created: ${pdfFile}`);
}

// Convert pitch deck
convertMarkdownToPDF(
    '/workspaces/RangisNet/PITCH_DECK_RANGISNET.md',
    '/workspaces/RangisNet/PITCH_DECK_RANGISNET.pdf'
).then(() => {
    console.log('✅ All conversions complete!');
}).catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
});
