const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    orderItems: [
        {
            name: { type: String, required: true },
            qty: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            vendor: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Vendor',
                required: true
            },
            commission: {
                type: Number,
                default: 0
            }
        }
    ],
    billingDetails: {
        name: String,
        email: String,
        phone: String
    },
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true }
    },
    paymentMethod: {
        type: String,
        required: true,
        default: 'Razorpay'
    },
    paymentResult: {
        id: { type: String }, // Razorpay Payment ID
        orderId: { type: String }, // Razorpay Order ID
        signature: { type: String }, // Razorpay Signature
        status: { type: String },
        update_time: { type: String },
        email_address: { type: String }
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    totalCommission: {
        type: Number,
        default: 0
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false
    },
    paidAt: {
        type: Date
    },
    isDelivered: {
        type: Boolean,
        required: true,
        default: false
    },
    deliveredAt: {
        type: Date
    },
    status: {
        type: String,
        default: 'Processing',
        enum: ['Pending', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Refunded']
    },
    logistics: {
        shipmentId: { type: String }, // Shiprocket shipment_id
        orderId: { type: String },    // Shiprocket order_id
        awbCode: { type: String },    // Air Waybill Number
        courierName: { type: String },
        labelUrl: { type: String },
        manifestUrl: { type: String }
    },
    timeline: [
        {
            status: { type: String },
            description: { type: String },
            timestamp: { type: Date, default: Date.now }
        }
    ],
    dimensions: {
        length: { type: Number, default: 0.5 }, // in cm
        width: { type: Number, default: 0.5 },
        height: { type: Number, default: 0.5 },
        weight: { type: Number, default: 0.5 } // in kg
    }
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
