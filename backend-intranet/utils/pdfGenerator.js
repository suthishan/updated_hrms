const PDFDocument = require('pdfkit');

exports.generateInternetAccessPDF = (res, request) => {
  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  doc.pipe(res);

  doc.fontSize(14).text('JAPFA – Internet Access Approval', { align: 'center' });
  doc.moveDown();

  doc.text(`Requester: ${request.requester_name}`);
  doc.text(`Department: ${request.department}`);
  doc.text(`Status: ${request.status}`);

  doc.moveDown();
  doc.text('Requested Websites:');

  request.form_data.websites.forEach((w, i) => {
    doc.text(`${i+1}. ${w.url} - ${w.purpose}`);
  });

  doc.end();
};
