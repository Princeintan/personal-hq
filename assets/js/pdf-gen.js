/**
 * HQ Engine - PDF Compiling Generation Engine
 * Generates vector PDF documents using native client computing power.
 */

function generateDocumentPDF(clientName, docType, amount, description) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const docID = 'DOC-' + Math.floor(100000 + Math.random() * 900000);
    const currentDate = new Date().toLocaleDateString('en-IN');

    // Structural Color Palette Configuration Matrix
    const primaryColor = [15, 23, 42];   // Midnight Navy Slate
    const secondaryColor = [100, 116, 139]; // Slate Gray Core

    // Header Architecture
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("ALCOOTYPE SYSTEM HQ", 15, 25);

    doc.setFontSize(14);
    doc.text(docType.toUpperCase(), 195, 25, { align: 'right' });

    // Metadata Construction Block
    doc.setTextColor(...primaryColor);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`Document Reference:`, 15, 55);
    doc.setFont("helvetica", "normal");
    doc.text(docID, 55, 55);

    doc.setFont("helvetica", "bold");
    doc.text(`Date of Execution:`, 15, 62);
    doc.setFont("helvetica", "normal");
    doc.text(currentDate, 55, 62);

    // Bill To Sub-Block
    doc.setFont("helvetica", "bold");
    doc.text("Billed Corporate Target:", 15, 75);
    doc.setFont("helvetica", "normal");
    doc.text(clientName, 15, 82);

    // Vector Table Generation Mapping
    doc.setFillColor(241, 245, 249);
    doc.rect(15, 95, 180, 10, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(15, 95, 195, 95);
    doc.line(15, 105, 195, 105);

    doc.setFont("helvetica", "bold");
    doc.text("Line Item Engineering Specifications Description", 18, 101);
    doc.text("Total (INR)", 192, 101, { align: 'right' });

    // Table Line Data Row Insertion
    doc.setFont("helvetica", "normal");
    doc.text(description, 18, 115, { maxWidth: 140 });
    
    const formattedAmount = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
    doc.setFont("helvetica", "bold");
    doc.text(formattedAmount, 192, 115, { align: 'right' });

    doc.line(15, 125, 195, 125);

    // Total Financial Summary Segment
    doc.setFontSize(12);
    doc.text("Aggregate Payable Position:", 130, 140);
    doc.text(formattedAmount, 192, 140, { align: 'right' });

    // Authorization Signature Area
    doc.setFontSize(9);
    doc.setTextColor(...secondaryColor);
    doc.setFont("helvetica", "normal");
    doc.text("This is an automated system generated transaction certificate requiring no physical signature.", 15, 280);

    // Direct Browser Download Action
    doc.save(`${docType}_${clientName.replace(/\s+/g, '_')}.pdf`);
}

window.generateDocumentPDF = generateDocumentPDF;