const express = require('express');
const router = express.Router();
const {
    createOrder,
    getOrderById,
    getUserOrders,
    updateOrderStatus,
    getSellerOrders,
    getAllOrders
} = require('../controllers/orderController');

// Create new order from cart
router.post('/create', createOrder);

// Get all orders (admin only)
router.get('/', getAllOrders);

// Get order by ID
router.get('/:orderId', getOrderById);

// Get user's order history
router.get('/user/:userId', getUserOrders);

// Get seller's orders
router.get('/seller/:sellerId', getSellerOrders);

// Update order status
router.put('/:orderId/status', updateOrderStatus);

module.exports = router; 