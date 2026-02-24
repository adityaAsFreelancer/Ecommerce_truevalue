const axios = require('axios');

class SMSService {
    constructor() {
        this.apiKey = process.env.TWILIO_AUTH_TOKEN || 'mock_token';
        this.accountSid = process.env.TWILIO_ACCOUNT_SID || 'mock_sid';
        this.fromNumber = process.env.TWILIO_PHONE_NUMBER || '+1234567890';
    }

    async sendSMS(to, message) {
        // This is a placeholder for real Twilio/Vonage integration
        console.log(`[SMS MOCK] Sending to ${to}: ${message}`);

        // Example Twilio integration logic (commented out):
        /*
        try {
            const client = require('twilio')(this.accountSid, this.apiKey);
            await client.messages.create({
                body: message,
                from: this.fromNumber,
                to: to
            });
            return true;
        } catch (error) {
            console.error('SMS Send Failed:', error.message);
            return false;
        }
        */

        return true;
    }

    // High-priority templates
    async sendOrderAlert(phone, orderId) {
        const msg = `True Value: Your order #${orderId} is confirmed! Track here: http://localhost:3000/orders/${orderId}`;
        return await this.sendSMS(phone, msg);
    }

    async sendShippingAlert(phone, orderId, courier) {
        const msg = `True Value: Order #${orderId} has been shipped via ${courier}!`;
        return await this.sendSMS(phone, msg);
    }
}

module.exports = new SMSService();
