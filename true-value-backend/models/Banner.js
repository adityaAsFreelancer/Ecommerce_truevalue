const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true
    },
    subtitle: String,
    image: {
        type: String,
        required: [true, 'Please add an image URL']
    },
    link: String,
    isActive: {
        type: Boolean,
        default: true
    },
    priority: {
        type: Number,
        default: 0
    },
    type: {
        type: String,
        enum: ['hero', 'offer', 'side'],
        default: 'hero'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Banner', bannerSchema);
