const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    image: {
        type: String,
        default: 'no-photo.jpg'
    },
    parent: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Create category slug from the name
categorySchema.pre('save', async function () {
    this.slug = slugify(this.name, { lower: true });
});

module.exports = mongoose.model('Category', categorySchema);
