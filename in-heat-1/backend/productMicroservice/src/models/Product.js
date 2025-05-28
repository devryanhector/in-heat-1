const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    sellerId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    images: [{
        type: String,  // Will store base64 image URLs
        required: false
    }],
    price: {
        type: Number,
        required: true,
        min: 0
    },
    quantity: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
productSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Add text index for search functionality
productSchema.index({
    name: 'text',
    description: 'text',
    category: 'text'
});

module.exports = mongoose.model('Product', productSchema); 