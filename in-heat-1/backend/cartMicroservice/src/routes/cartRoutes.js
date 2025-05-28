const express = require('express');
const router = express.Router();
const {
    addToCart,
    removeFromCart,
    updateCartItem,
    getCart,
    clearCart
} = require('../controllers/cartController');

// Add item to cart
router.post('/add', addToCart);

// Remove item from cart
router.post('/remove', removeFromCart);

// Update item quantity
router.put('/update', updateCartItem);

// Get cart by user ID
router.get('/:userId', getCart);

// Clear cart
router.delete('/:userId', clearCart);

module.exports = router; 