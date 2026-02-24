const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
        maxlength: [100, 'Name cannot be more than 100 characters']
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [2000, 'Description cannot be more than 2000 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    mrp: {
        type: Number,
        default: null
    },
    salePrice: {
        type: Number,
        default: null
    },
    discount: {
        type: Number,
        default: 0
    },
    images: [String],
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: true
    },
    vendor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    brand: {
        type: String,
        default: ''
    },
    countInStock: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isFeature: {
        type: Boolean,
        default: false
    },
    isDeal: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating must be at most 5'],
        default: 4.5
    },
    numReviews: {
        type: Number,
        default: 0
    },
    tags: [String],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Create product slug from the name
productSchema.pre('save', async function () {
    this.slug = slugify(this.name, { lower: true });
});

module.exports = mongoose.model('Product', productSchema);
