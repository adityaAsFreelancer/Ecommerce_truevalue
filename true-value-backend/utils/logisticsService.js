const axios = require('axios');
const ErrorResponse = require('../utils/errorHandler');

class ShiprocketService {
    constructor() {
        this.baseUrl = 'https://apiv2.shiprocket.in/v1/external';
        this.token = null;
    }

    // Authenticate with Shiprocket
    async authenticate() {
        try {
            const response = await axios.post(`${this.baseUrl}/auth/login`, {
                email: process.env.SHIPROCKET_EMAIL,
                password: process.env.SHIPROCKET_PASSWORD
            });
            this.token = response.data.token;
            return this.token;
        } catch (error) {
            console.error('Shiprocket Auth Error:', error.response?.data || error.message);
            throw new Error('Logistics authentication failed');
        }
    }

    // Push Order to Shiprocket
    async createOrder(orderData) {
        if (!this.token) await this.authenticate();

        try {
            const response = await axios.post(`${this.baseUrl}/orders/create/adhoc`, orderData, {
                headers: { Authorization: `Bearer ${this.token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Shiprocket Order Creation Error:', error.response?.data || error.message);
            throw new Error('Failed to push order to logistics provider');
        }
    }

    // Generate AWB
    async generateAWB(shipmentId) {
        if (!this.token) await this.authenticate();

        try {
            const response = await axios.post(`${this.baseUrl}/courier/assign/awb`, {
                shipment_id: shipmentId
            }, {
                headers: { Authorization: `Bearer ${this.token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Shiprocket AWB Error:', error.response?.data || error.message);
            throw new Error('Failed to generate AWB');
        }
    }

    // Get Tracking Details
    async getTracking(awbCode) {
        if (!this.token) await this.authenticate();

        try {
            const response = await axios.get(`${this.baseUrl}/courier/track/awb/${awbCode}`, {
                headers: { Authorization: `Bearer ${this.token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Shiprocket Tracking Error:', error.response?.data || error.message);
            return null;
        }
    }
}

module.exports = new ShiprocketService();
