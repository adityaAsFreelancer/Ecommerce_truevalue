const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateInvoice = (order, filePath) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });

        doc.pipe(fs.createWriteStream(filePath));

        // Header
        doc.fontSize(25).text('TRUE VALUE', { align: 'center', color: '#2e7d32' });
        doc.fontSize(10).text('Multi-Vendor Marketplace Invoicing System', { align: 'center' });
        doc.moveDown();

        // Order Info
        doc.fontSize(12).text(`Invoice Number: INV-${order.id.toString().padStart(6, '0')}`);
        doc.text(`Order Date: ${new Date(order.createdAt).toLocaleDateString()}`);
        doc.text(`Status: ${order.status}`);
        doc.moveDown();

        // Customer Details
        doc.text(`Customer Name: ${order.user ? order.user.name : order.name}`);
        doc.text(`Email: ${order.user ? order.user.email : order.email}`);
        doc.text(`Shipping Address: ${order.address}, ${order.city}, ${order.state}, ${order.postalCode}`);
        doc.moveDown();

        // Table Header
        const tableTop = 250;
        doc.font('Helvetica-Bold');
        doc.text('Item', 50, tableTop);
        doc.text('Qty', 300, tableTop);
        doc.text('Price', 400, tableTop);
        doc.text('Total', 500, tableTop);
        doc.moveDown();
        doc.font('Helvetica');

        // Items
        let y = tableTop + 25;
        order.orderItems.forEach(item => {
            doc.text(item.name, 50, y);
            doc.text(item.qty.toString(), 300, y);
            doc.text(`INR ${item.price}`, 400, y);
            doc.text(`INR ${item.price * item.qty}`, 500, y);
            y += 20;
        });

        // Totals
        doc.moveDown();
        doc.fontSize(14).font('Helvetica-Bold').text(`Total Amount: INR ${order.totalPrice}`, { align: 'right' });

        doc.fontSize(10).font('Helvetica').text('Tax Inclusive. This is a computer-generated invoice.', 50, y + 50, { align: 'center' });

        doc.end();

        doc.on('finish', () => resolve(filePath));
        doc.on('error', (err) => reject(err));
    });
};

module.exports = { generateInvoice };
