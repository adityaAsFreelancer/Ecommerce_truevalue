const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Coupon code is required'],
        unique: true,
        uppercase: true,
        trim: true
    },
    discountType: {
        type: String,
        required: true,
        enum: ['percentage', 'fixed']
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
        type: Number, // Applicable for percentage discounts
        default: null
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
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        default: null // null means global platform-wide coupon
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Method to check if coupon is valid
couponSchema.methods.isValid = function () {
    return this.isActive && new Date() < this.expiryDate && (this.usageLimit === null || this.usedCount < this.usageLimit);
};

const Coupon = mongoose.model('Coupon', couponSchema);
module.exports = Coupon;
