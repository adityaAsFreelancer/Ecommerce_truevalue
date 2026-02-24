const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    slug: {
        type: String,
        lowercase: true,
        unique: true
    },
    sku: {
        type: String,
        required: [true, 'SKU is required'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Product description is required']
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        default: 0
    },
    discountPrice: {
        type: Number,
        default: 0
    },
    images: [{
        type: String,
        required: true
    }],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Product category is required']
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: [true, 'Vendor is required']
    },
    variants: [
        {
            size: String,
            color: String,
            material: String,
            additionalPrice: { type: Number, default: 0 },
            stock: { type: Number, default: 0 }
        }
    ],
    countInStock: {
        type: Number,
        required: true,
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
    tags: [String],
    seo: {
        title: String,
        description: String,
        keywords: [String]
    },
    commissionRate: {
        type: Number, // Override vendor-level commission if needed
        default: null
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    salePrice: {
        type: Number,
        default: null
    },
    saleEndDate: {
        type: Date,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Middleware to create slug
productSchema.pre('validate', function (next) {
    if (this.name && !this.slug) {
        this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(7);
    }
    next();
});

// Indexes for better search performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
// Specialized Compound Indexes for High-Traffic Filtering
productSchema.index({ category: 1, isActive: 1, createdAt: -1 });
productSchema.index({ price: 1, rating: -1 });
productSchema.index({ 'seo.keywords': 1 }); // SEO discovery optimization

const SearchService = require('../utils/searchService');

// Sync to Search Engine after save
productSchema.post('save', async function (doc) {
    await SearchService.syncProduct(doc);
});

// Sync delete to Search Engine
productSchema.post('remove', async function (doc) {
    await SearchService.deleteProduct(doc._id);
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
