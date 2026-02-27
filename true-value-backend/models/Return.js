const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Order'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            qty: { type: Number, required: true },
            price: { type: Number, required: true },
            vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true }
        }
    ],
    reason: {
        type: String,
        required: [true, 'Please provide a reason for return']
    },
    status: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Approved', 'Rejected', 'Pickup Scheduled', 'Received', 'Refund Initiated', 'Completed']
    },
    refundId: { type: String }, // Razorpay Refund ID
    refundAmount: { type: Number, required: true },
    adminNotes: String,
    vendorNotes: String,
    images: [String] // Evidence images
}, {
    timestamps: true
});

const Return = mongoose.model('Return', returnSchema);
module.exports = Return;
