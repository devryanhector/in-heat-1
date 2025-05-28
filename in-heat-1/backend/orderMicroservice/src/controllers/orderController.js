const Order = require('../models/Order');
const fetch = require('node-fetch');

// Create new order from cart
const createOrder = async (req, res) => {
    try {
        const { userId, items, totalAmount } = req.body;
        
        // Validate and update product quantities first
        for (const item of items) {
            try {
                // Get current product quantity
                const productResponse = await fetch(`http://localhost:3002/products/${item.productId}`);
                const product = await productResponse.json();
                
                if (!product) {
                    return res.status(400).json({
                        message: `Product ${item.productId} not found`
                    });
                }
                
                if (product.quantity < item.quantity) {
                    return res.status(400).json({
                        message: `Insufficient quantity for product ${product.name}`
                    });
                }

                // Verify sellerId matches
                if (product.sellerId !== item.sellerId) {
                    return res.status(400).json({
                        message: `Invalid seller ID for product ${product.name}`
                    });
                }
                
                // Update product quantity
                const updateResponse = await fetch(`http://localhost:3002/products/${item.productId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        quantity: product.quantity - item.quantity,
                        sellerId: product.sellerId
                    })
                });
                
                if (!updateResponse.ok) {
                    throw new Error(`Failed to update product ${item.productId} quantity`);
                }
            } catch (error) {
                return res.status(500).json({
                    message: 'Error updating product quantities',
                    error: error.message
                });
            }
        }
        
        // Create the order after successful quantity updates
        const order = new Order({
            userId,
            items: items.map(item => ({
                productId: item.productId,
                sellerId: item.sellerId,
                quantity: item.quantity,
                price: item.price,
                name: item.name
            })),
            totalAmount,
            status: 'pending'
        });
        
        await order.save();

        // Publish order.created event
        const channel = req.app.get('channel');
        channel.publish('order_events', 'order.created', Buffer.from(JSON.stringify({
            orderId: order._id,
            userId,
            totalAmount,
            status: order.status
        })));

        res.status(201).json({
            message: 'Order created successfully',
            order
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating order',
            error: error.message
        });
    }
};

// Get order by ID
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        
        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }
        
        res.json(order);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching order',
            error: error.message
        });
    }
};

// Get user's order history
const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            userId: req.params.userId
        }).sort({ orderDate: -1 });
        
        res.json(orders);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching user orders',
            error: error.message
        });
    }
};

// Update order status
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        const order = await Order.findById(req.params.orderId);
        
        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }

        order.status = status;
        await order.save();

        // Publish order status event
        const channel = req.app.get('channel');
        channel.publish('order_events', `order.${status}`, Buffer.from(JSON.stringify({
            orderId: order._id,
            userId: order.userId,
            status
        })));

        res.json({
            message: 'Order status updated successfully',
            order
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating order status',
            error: error.message
        });
    }
};

// Get seller's orders
const getSellerOrders = async (req, res) => {
    try {
        const sellerId = req.params.sellerId;
        
        // Find orders that contain items from this seller
        const orders = await Order.find({
            'items.sellerId': sellerId
        }).sort({ orderDate: -1 });
        
        res.json(orders);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching seller orders',
            error: error.message
        });
    }
};

// Get all orders (admin only)
const getAllOrders = async (req, res) => {
    try {
        // Get admin user ID from header
        const adminId = req.headers['user-id'];
        if (!adminId) {
            return res.status(401).json({
                message: 'Unauthorized - User ID required'
            });
        }

        // Verify admin status by calling user service
        try {
            const userResponse = await fetch(`http://localhost:3001/users/${adminId}`);
            const userData = await userResponse.json();
            
            if (!userData || userData.userType !== 'admin') {
                return res.status(403).json({
                    message: 'Forbidden - Admin access required'
                });
            }
        } catch (error) {
            return res.status(500).json({
                message: 'Error verifying admin status',
                error: error.message
            });
        }

        // Get all orders sorted by date
        const orders = await Order.find().sort({ orderDate: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching all orders',
            error: error.message
        });
    }
};

module.exports = {
    createOrder,
    getOrderById,
    getUserOrders,
    updateOrderStatus,
    getSellerOrders,
    getAllOrders
}; 