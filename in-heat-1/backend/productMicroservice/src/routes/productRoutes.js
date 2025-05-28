const express = require('express');
const router = express.Router();
const {
    createProduct,
    getAllProducts,
    searchProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getProductsBySeller
} = require('../controllers/productController');

// Create new product (seller only)
router.post('/', createProduct);

// Get all products
router.get('/', getAllProducts);

// Search products
router.get('/search', searchProducts);

// Get product by ID
router.get('/:productId', getProductById);

// Update product (seller only)
router.put('/:productId', updateProduct);

// Delete product (seller only)
router.delete('/:productId', deleteProduct);

// Get products by seller
router.get('/seller/:sellerId', getProductsBySeller);

module.exports = router; 