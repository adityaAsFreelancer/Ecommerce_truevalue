const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    orderItems: [
        {
            name: { type: String, required: true },
            qty: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            product: {
                type: mongoose.Schema.ObjectId,
                ref: 'Product',
                required: true
            }
        }
    ],
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    paymentMethod: {
        type: String,
        required: true
    },
    paymentResult: {
        id: String,
        status: String,
        update_time: String,
        email_address: String
    },
    status: {
        type: String,
        required: true,
        default: 'Pending',
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
    },
    itemsPrice: {
        type: Number,
        required: true,
        default: 0.0
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
    deliveryDetails: {
        baseCharge: Number,
        distanceCharge: Number,
        peakHourSurcharge: Number,
        distanceKm: Number,
        isPeakHour: Boolean
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
    // Discount Fields
    discountAmount: {
        type: Number,
        default: 0.0
    },
    couponCode: {
        type: String
    },
    // Logistics Fields
    shiprocketOrderId: String,
    shipmentId: String,
    awbCode: String,
    courierName: String,
    timeline: [
        {
            status: String,
            description: String,
            timestamp: { type: Date, default: Date.now }
        }
    ]
}, {
    timestamps: true
});

// Update status ENUM to include more states
orderSchema.path('status').options.enum = [
    'Pending',
    'Processing',
    'Shipped',
    'Out for Delivery',
    'Delivered',
    'Cancelled',
    'Return Requested',
    'Refunded'
];

module.exports = mongoose.model('Order', orderSchema);
