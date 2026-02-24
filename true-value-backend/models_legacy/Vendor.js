const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    storeName: {
        type: String,
        required: [true, 'Store name is required'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Store description is required']
    },
    logo: {
        type: String,
        default: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    businessAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true }
    },
    totalEarned: {
        type: Number,
        default: 0
    },
    totalRefunded: {
        type: Number,
        default: 0
    },
    pendingRefunds: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    },
    commissionRate: {
        type: Number,
        default: 10 // Global default percentage for this vendor
    },
    accountBalance: {
        type: Number,
        default: 0
    },
    bankDetails: {
        accountNumber: String,
        ifscCode: String,
        bankName: String,
        accountHolderName: String
    },
    payoutHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payout'
    }],
    status: {
        type: String,
        enum: ['pending', 'active', 'suspended'],
        default: 'pending'
    }
}, {
    timestamps: true
});

const Vendor = mongoose.model('Vendor', vendorSchema);
module.exports = Vendor;
