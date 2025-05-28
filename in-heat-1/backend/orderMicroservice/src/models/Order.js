const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true
    },
    sellerId: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    name: {
        type: String,
        required: true
    }
});

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    items: [orderItemSchema],
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'confirmed', 'completed'],
        default: 'pending'
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
orderSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Order', orderSchema); 