/**
 * HQ Engine - Client-Side HTML/CSS LaTeX-Style Compiler
 * Compiles custom form data into high-end professional typography PDFs instantly.
 */

function generateDocumentPDF(clientName, docType, amount, description) {
    const docID = 'DOC-' + Math.floor(100000 + Math.random() * 900000);
    const currentDate = new Date().toLocaleDateString('en-IN', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
    const cleanAmount = parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 });

    // 1. YOUR CUSTOM LATEX-STYLE STRUCTURAL TEMPLATE
    // You can modify this HTML structure and styling rules whenever you want to change your design.
    const compiledTemplateHtml = `
        <style>
            @media print {
                @page {
                    size: A4;
                    margin: 20mm 15mm 20mm 15mm;
                }
                body {
                    background: #ffffff;
                    color: #0f172a;
                    font-family: 'Times New Roman', Times, serif;
                    font-size: 11pt;
                    line-height: 1.5;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
            }
            
            .latex-container {
                width: 100%;
                margin: 0 auto;
            }

            /* Corporate Header System */
            .latex-header {
                display: table;
                width: 100%;
                margin-bottom: 8mm;
            }
            .header-left {
                display: table-cell;
                width: 60%;
                vertical-align: top;
            }
            .header-right {
                display: table-cell;
                width: 40%;
                text-align: right;
                vertical-align: top;
            }
            .brand-title {
                font-size: 18pt;
                font-weight: bold;
                letter-spacing: 0.5px;
                color: #0f172a;
                margin: 0;
            }
            .brand-subtitle {
                font-size: 10pt;
                color: #64748b;
                margin-top: 1mm;
            }
            .doc-type {
                font-size: 16pt;
                font-weight: bold;
                color: #0f172a;
                margin: 0;
                text-transform: uppercase;
            }
            .meta-text {
                font-size: 10pt;
                color: #475569;
                margin-top: 1mm;
            }

            /* Divider Line matching LaTeX \hrule */
            .latex-hrule {
                border: 0;
                border-top: 1.5px solid #0f172a;
                margin: 4mm 0 8mm 0;
            }

            /* Target Metadata metadata box */
            .client-section {
                margin-bottom: 12mm;
            }
            .section-label {
                font-size: 9pt;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: #64748b;
                font-weight: bold;
                margin-bottom: 2mm;
            }
            .client-name {
                font-size: 13pt;
                font-weight: bold;
                color: #0f172a;
            }

            /* Financial Itemized Data Grid Matrix */
            .latex-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 4mm;
            }
            .latex-table th {
                border-top: 1.5px solid #0f172a;
                border-bottom: 1px solid #0f172a;
                padding: 3mm 2mm;
                font-weight: bold;
                text-align: left;
                font-size: 10pt;
            }
            .latex-table td {
                padding: 4mm 2mm;
                font-size: 11pt;
                vertical-align: top;
            }
            .text-right {
                text-align: right !important;
            }
            .row-total {
                border-top: 1px solid #0f172a;
                border-bottom: 1.5px solid #0f172a;
                font-weight: bold;
            }
            
            /* Footer System matching LaTeX fancyhdr */
            .latex-footer {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                border-top: 0.5px solid #cbd5e1;
                padding-top: 2mm;
                font-size: 8pt;
                color: #64748b;
                text-align: center;
            }
        </style>

        <div class="latex-container">
            <div class="latex-header">
                <div class="header-left">
                    <div class="brand-title">ALCOOTYPE SYSTEMS PVT. LTD.</div>
                    <div class="brand-subtitle">Engineering Systems & Prototyping HQ</div>
                </div>
                <div class="header-right">
                    <div class="doc-type">${docType}</div>
                    <div class="meta-text">Ref: <b>${docID}</b></div>
                    <div class="meta-text">Date: ${currentDate}</div>
                </div>
            </div>

            <div class="latex-hrule"></div>

            <div class="client-section">
                <div class="section-label">Billed Target Organization:</div>
                <div class="client-name">${clientName}</div>
            </div>

            <div class="section-label">Financial Specifications Breakdown:</div>
            <table class="latex-table">
                <thead>
                    <tr>
                        <th>Engineering Line-Item Specifications Description</th>
                        <th class="text-right" style="width: 25%;">Total (INR)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${description}</td>
                        <td class="text-right" style="font-weight: bold;">${cleanAmount}</td>
                    </tr>
                    <tr class="row-total">
                        <td>Aggregate Payable Position</td>
                        <td class="text-right">INR ${cleanAmount}</td>
                    </tr>
                </tbody>
            </table>

            <div class="latex-footer">
                This is an automated system transaction blueprint generated via your secure personal HQEngine.
            </div>
        </div>
    `;

    // 2. COMPILING AND TRIGGERING RUNNER
    const canvas = document.getElementById('print-compiler-canvas');
    canvas.innerHTML = compiledTemplateHtml;

    // Open a temporary, isolated window canvas to force print clean vector graphics
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    printWindow.document.write(`
        <html>
        <head>
            <title>${docType}_${docID}</title>
            <style>
                body { margin: 0; padding: 0; }
            </style>
        </head>
        <body>
            ${compiledTemplateHtml}
            <script>
                // Auto-execute system print layout compilation once resources settle
                window.onload = function() {
                    window.print();
                    setTimeout(function() { window.close(); }, 500);
                };
            <\/script>
        </body>
        </html>
    `);
    printWindow.document.close();
}

window.generateDocumentPDF = generateDocumentPDF;