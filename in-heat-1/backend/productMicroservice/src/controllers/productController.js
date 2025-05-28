const Product = require('../models/Product');
const fetch = require('node-fetch');

// Create new product
const createProduct = async (req, res) => {
    try {
        // Validate if images are provided in base64 format
        if (req.body.images) {
            // Ensure images is an array
            const images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
            
            // Validate each image is a valid base64 string
            for (const image of images) {
                if (!isValidBase64(image)) {
                    return res.status(400).json({
                        message: 'Invalid image format. Images must be in base64 format.'
                    });
                }
            }
        }

        const product = new Product(req.body);
        await product.save();

        // Publish product.created event
        const channel = req.app.get('channel');
        channel.publish('product_events', 'product.created', Buffer.from(JSON.stringify({
            productId: product._id,
            sellerId: product.sellerId,
            name: product.name,
            price: product.price,
            quantity: product.quantity,
            images: product.images
        })));

        res.status(201).json({
            message: 'Product created successfully',
            productId: product._id
        });
    } catch (error) {
        res.status(400).json({
            message: 'Error creating product',
            error: error.message
        });
    }
};

// Helper function to validate base64 string
const isValidBase64 = (str) => {
    if (!str || typeof str !== 'string') return false;
    
    // Check if string starts with data:image format
    if (!str.startsWith('data:image/')) return false;
    
    // Extract the base64 part
    const base64Regex = /^data:image\/[a-z]+;base64,/;
    const base64Data = str.replace(base64Regex, '');
    
    try {
        // Check if it can be decoded as base64
        return btoa(atob(base64Data)) === base64Data;
    } catch (err) {
        return false;
    }
};

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({ quantity: { $gt: 0 } });
        res.json(products);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching products',
            error: error.message
        });
    }
};

// Search products
const searchProducts = async (req, res) => {
    try {
        const { query, sellerUsername, category, minPrice, maxPrice } = req.query;
        let searchQuery = { quantity: { $gt: 0 } };  // Only show products with quantity > 0

        // If searching by seller username
        if (sellerUsername) {
            // First get the seller's ID from the user service
            try {
                const userServiceResponse = await fetch(`http://localhost:3001/users/search?username=${sellerUsername}`);
                const userData = await userServiceResponse.json();
                
                if (userData && userData.userId) {
                    searchQuery.sellerId = userData.userId;
                } else {
                    return res.json([]); // Return empty if seller not found
                }
            } catch (error) {
                console.error('Error fetching seller data:', error);
                return res.status(500).json({
                    message: 'Error fetching seller data',
                    error: error.message
                });
            }
        }

        // If searching by product text
        if (query) {
            searchQuery.$text = { $search: query };
        }

        // Add category filter if provided
        if (category) {
            searchQuery.category = category;
        }

        // Add price range filter if provided
        if (minPrice !== undefined || maxPrice !== undefined) {
            searchQuery.price = {};
            if (minPrice !== undefined) searchQuery.price.$gte = Number(minPrice);
            if (maxPrice !== undefined) searchQuery.price.$lte = Number(maxPrice);
        }

        const products = await Product.find(
            searchQuery,
            query ? { score: { $meta: 'textScore' } } : {}
        ).sort(query ? { score: { $meta: 'textScore' } } : { createdAt: -1 });

        res.json(products);
    } catch (error) {
        res.status(500).json({
            message: 'Error searching products',
            error: error.message
        });
    }
};

// Get product by ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching product',
            error: error.message
        });
    }
};

// Update product
const updateProduct = async (req, res) => {
    try {
        // Validate if images are provided in base64 format
        if (req.body.images) {
            // Ensure images is an array
            const images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
            
            // Validate each image is a valid base64 string
            for (const image of images) {
                if (!isValidBase64(image)) {
                    return res.status(400).json({
                        message: 'Invalid image format. Images must be in base64 format.'
                    });
                }
            }
        }

        const product = await Product.findOneAndUpdate(
            {
                _id: req.params.productId,
                sellerId: req.body.sellerId // Ensure seller owns the product
            },
            req.body,
            { new: true }
        );

        if (!product) {
            return res.status(404).json({
                message: 'Product not found or unauthorized'
            });
        }

        // Publish product.updated event
        const channel = req.app.get('channel');
        channel.publish('product_events', 'product.updated', Buffer.from(JSON.stringify({
            productId: product._id,
            sellerId: product.sellerId,
            name: product.name,
            price: product.price,
            quantity: product.quantity,
            images: product.images
        })));

        res.json({
            message: 'Product updated successfully',
            product
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating product',
            error: error.message
        });
    }
};

// Delete product
const deleteProduct = async (req, res) => {
    try {
        const userId = req.headers['user-id'];
        if (!userId) {
            return res.status(401).json({
                message: 'Unauthorized - User ID required'
            });
        }

        // Check if user is admin
        try {
            const userResponse = await fetch(`http://localhost:3001/users/${userId}`);
            const userData = await userResponse.json();
            
            // If admin, allow deletion of any product
            if (userData.userType === 'admin') {
                const product = await Product.findByIdAndDelete(req.params.productId);
                
                if (!product) {
                    return res.status(404).json({
                        message: 'Product not found'
                    });
                }

                // Publish product.deleted event
                const channel = req.app.get('channel');
                channel.publish('product_events', 'product.deleted', Buffer.from(JSON.stringify({
                    productId: product._id,
                    sellerId: product.sellerId
                })));

                return res.json({
                    message: 'Product deleted successfully'
                });
            }
        } catch (error) {
            console.error('Error checking user type:', error);
        }

        // If not admin, check if user is the seller
        const product = await Product.findOneAndDelete({
            _id: req.params.productId,
            sellerId: userId
        });

        if (!product) {
            return res.status(404).json({
                message: 'Product not found or unauthorized'
            });
        }

        // Publish product.deleted event
        const channel = req.app.get('channel');
        channel.publish('product_events', 'product.deleted', Buffer.from(JSON.stringify({
            productId: product._id,
            sellerId: product.sellerId
        })));

        res.json({
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting product',
            error: error.message
        });
    }
};

// Get products by seller
const getProductsBySeller = async (req, res) => {
    try {
        const products = await Product.find({
            sellerId: req.params.sellerId
        });
        
        res.json(products);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching seller products',
            error: error.message
        });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    searchProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getProductsBySeller
}; 