const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async (options) => {
    const mailOptions = {
        from: `True Value <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.html,
        attachments: options.attachments || []
    };

    await transporter.sendMail(mailOptions);
};

// Templates
const getOrderConfirmationTemplate = (order) => `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
        <h2 style="color: #2e7d32;">Order Confirmed!</h2>
        <p>Hi ${order.user.name},</p>
        <p>Thank you for shopping with True Value. Your order <strong>#${order.id}</strong> has been received and is being processed.</p>
        <hr/>
        <h3>Order Summary</h3>
        <ul>
            ${order.orderItems.map(item => `<li>${item.name} x ${item.qty} - ₹${item.price * item.qty}</li>`).join('')}
        </ul>
        <p><strong>Total Price: ₹${order.totalPrice}</strong></p>
        <hr/>
        <p>We'll notify you once your items are shipped.</p>
        <p>Team True Value</p>
    </div>
`;

const getShippingUpdateTemplate = (order) => `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
        <h2 style="color: #1976d2;">Order Shipped!</h2>
        <p>Hi ${order.user ? order.user.name : order.name},</p>
        <p>Great news! Your order <strong>#${order.id}</strong> is on its way.</p>
        <p><strong>Courier:</strong> ${order.courierName || 'Partner Courier'}</p>
        <p><strong>AWB Code:</strong> ${order.awbCode || 'N/A'}</p>
        <hr/>
        <p>You can track your order in the "My Orders" section of your profile.</p>
        <p>Team True Value</p>
    </div>
`;

module.exports = {
    sendEmail,
    getOrderConfirmationTemplate,
    getShippingUpdateTemplate
};
