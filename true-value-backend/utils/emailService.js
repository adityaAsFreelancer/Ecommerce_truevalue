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
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 24px; color: #333;">
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="display: inline-block; padding: 20px; background: #2e7d32; color: white; border-radius: 20px; font-weight: 900; font-style: italic;">TV</div>
            <h1 style="color: #1a1a1a; margin-top: 20px; letter-spacing: -1px;">Order Confirmed!</h1>
        </div>
        
        <p style="font-size: 16px; line-height: 1.6;">Hi <strong>${order.user.name}</strong>,</p>
        <p style="font-size: 16px; line-height: 1.6;">Good news! Your order <strong>#${order._id}</strong> has been received and is currently being prepared. We are working to get it to you within <strong>10-20 minutes</strong>.</p>
        
        <div style="background: #fafafa; padding: 25px; border-radius: 20px; margin: 30px 0;">
            <h3 style="margin-top: 0; color: #2e7d32; text-transform: uppercase; font-size: 12px; letter-spacing: 2px;">Order Summary</h3>
            <table style="width: 100%; border-collapse: collapse;">
                ${order.orderItems.map(item => `
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                            <span style="font-weight: bold;">${item.name}</span> <br/>
                            <span style="font-size: 12px; color: #888;">Qty: ${item.qty}</span>
                        </td>
                        <td style="text-align: right; padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">
                            ₹${(item.price * item.qty).toLocaleString()}
                        </td>
                    </tr>
                `).join('')}
                <tr>
                    <td style="padding: 20px 0 0; font-weight: 900; font-size: 18px;">Total Amount</td>
                    <td style="padding: 20px 0 0; text-align: right; font-weight: 900; font-size: 18px; color: #2e7d32;">
                        ₹${order.totalPrice.toLocaleString()}
                    </td>
                </tr>
            </table>
        </div>

        <p style="font-size: 14px; color: #666; text-align: center;">You will receive another update as soon as your order is out for delivery.</p>
        <hr style="border: none; border-top: 1px solid #f0f0f0; margin: 30px 0;" />
        <p style="text-align: center; font-size: 12px; color: #aaa; margin-bottom: 0;">&copy; 2026 True Value. All rights reserved.</p>
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
