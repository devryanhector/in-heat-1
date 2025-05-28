const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
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

const cartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    items: [cartItemSchema],
    totalAmount: {
        type: Number,
        default: 0
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp and calculate total amount before saving
cartSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    this.totalAmount = this.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
    next();
});

module.exports = mongoose.model('Cart', cartSchema); 