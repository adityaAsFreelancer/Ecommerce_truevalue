const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Please add a coupon code'],
        unique: true,
        uppercase: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    discountType: {
        type: String,
        required: true,
        enum: ['percentage', 'fixed'],
        default: 'percentage'
    },
    discountValue: {
        type: Number,
        required: true
    },
    minOrderValue: {
        type: Number,
        default: 0
    },
    maxDiscount: {
        type: Number
    },
    expiryDate: {
        type: Date,
        required: true
    },
    usageLimit: {
        type: Number,
        default: null // null means unlimited
    },
    usedCount: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    vendorId: {
        type: String, // String ID of the vendor if specific
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Coupon', couponSchema);
