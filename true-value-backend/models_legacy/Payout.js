const mongoose = require('mongoose');

const payoutSchema = new mongoose.Schema({
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'INR'
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending'
    },
    transactionId: String,
    bankReference: String,
    paidAt: Date,
    notes: String
}, {
    timestamps: true
});

const Payout = mongoose.model('Payout', payoutSchema);
module.exports = Payout;
