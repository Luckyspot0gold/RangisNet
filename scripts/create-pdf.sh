#!/bin/bash

# Convert markdown to HTML
cat > /tmp/pitch_deck.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Rangi's Net - Multi-Sensory Economic Cognition System</title>
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
        hr {
            border: none;
            border-top: 2px solid #eee;
            margin: 30px 0;
        }
    </style>
</head>
<body>
EOF

# Convert markdown to HTML and append
pandoc /workspaces/RangisNet/PITCH_DECK_RANGISNET.md -t html >> /tmp/pitch_deck.html

cat >> /tmp/pitch_deck.html << 'EOF'
</body>
</html>
EOF

# Convert HTML to PDF
wkhtmltopdf --enable-local-file-access --page-size A4 --margin-top 20mm --margin-right 20mm --margin-bottom 20mm --margin-left 20mm /tmp/pitch_deck.html /workspaces/RangisNet/PITCH_DECK_RANGISNET.pdf

echo "✅ PDF created successfully!"
