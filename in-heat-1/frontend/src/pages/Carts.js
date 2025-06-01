import React, { useEffect, useState } from "react";
import "./Carts.css";

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [confirming, setConfirming] = useState(false);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            setError('You are not logged in.');
            setLoading(false);
            return;
        }

        fetch(`http://localhost:3003/cart/${userId}`)
            .then(res => res.json())
            .then(async data => {
                const items = data.items || [];
                const itemsWithDetails = await Promise.all(items.map(async (item) => {
                    try {
                        const res = await fetch(`http://localhost:3002/products/${item.productId}`);
                        const product = await res.json();
                        return {
                            ...item,
                            quantity: item.quantity || 1,
                            image: product.images?.[0] || "/assets/product1.jpg",
                            name: product.name || item.name,
                            price: product.price || item.price,
                            maxStock: product.stock || 99
                        };
                    } catch (err) {
                        console.error("Product fetch error:", err);
                        return {
                            ...item,
                            quantity: item.quantity || 1,
                            image: "/assets/product1.jpg"
                        };
                    }
                }));
                setCartItems(itemsWithDetails);
                setLoading(false);
            })
            .catch(err => {
                console.error("Cart fetch error:", err);
                setError('Error loading cart.');
                setLoading(false);
            });
    }, []);

    const totalPrice = cartItems.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
        0
    );

    const handleConfirmOrder = async () => {
        setConfirming(true);
        setMessage("");
        const userId = localStorage.getItem('userId');
        if (!userId) {
            setMessage('You are not logged in.');
            setConfirming(false);
            return;
        }

        const payload = {
            userId,
            items: cartItems.map(({ image, ...rest }) => rest),
            totalAmount: totalPrice
        };

        try {
            const res = await fetch("http://localhost:3004/orders/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (res.ok) {
                setMessage("Order confirmed!");
                setCartItems([]);
            } else {
                setMessage(data.message || "Error confirming order");
            }
        } catch (e) {
            console.error("Order confirmation error:", e);
            setMessage("Error confirming order");
        }
        setConfirming(false);
    };

    if (loading) return <div className="cart-container">Loading...</div>;
    if (error) return <div className="cart-container" style={{ color: 'red' }}>{error}</div>;

    return (
        <div className="cart-container">
            <h2>Your Shopping Cart</h2>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    <div className="cart-items">
                        {cartItems.map((item) => (
                            <div className="cart-item" key={item.productId}>
                                <img src={item.image} alt={item.name} />
                                <div className="cart-item-info">
                                    <h3>{item.name}</h3>
                                    <p>Price: ${item.price?.toFixed(2)}</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span>Quantity:</span>
                                        <input
                                            type="number"
                                            min={1}
                                            max={item.maxStock || 99}
                                            value={item.quantity}
                                            onChange={e => {
                                                const newQty = Math.max(1, Math.min(Number(e.target.value), item.maxStock || 99));
                                                setCartItems(prev => prev.map(ci => ci.productId === item.productId ? { ...ci, quantity: newQty } : ci));
                                            }}
                                            style={{ width: '60px' }}
                                        />
                                    </div>
                                    <p>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                                    <button
                                        style={{
                                            background: '#ff4444',
                                            color: 'white',
                                            border: 'none',
                                            padding: '0.5rem 0.75rem',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            marginTop: '0.5rem'
                                        }}
                                        onClick={async () => {
                                            const userId = localStorage.getItem('userId');
                                            if (!userId) {
                                                setMessage('You are not logged in.');
                                                return;
                                            }
                                            try {
                                                const res = await fetch('http://localhost:3003/cart/remove', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ userId, productId: item.productId })
                                                });
                                                const data = await res.json();
                                                if (res.ok) {
                                                    setCartItems(prev => prev.filter(ci => ci.productId !== item.productId));
                                                    setMessage('Item removed from cart.');
                                                } else {
                                                    setMessage(data.message || 'Error removing item');
                                                }
                                            } catch (err) {
                                                console.error("Remove item error:", err);
                                                setMessage('Error removing item');
                                            }
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="cart-total">
                        <h3>Total: ${totalPrice.toFixed(2)}</h3>
                        <button className="checkout-btn" onClick={handleConfirmOrder} disabled={confirming}>
                            {confirming ? "Placing..." : "Place Order"}
                        </button>
                        {message && (
                            <p style={{ marginTop: '1rem', color: message === "Order confirmed!" ? "green" : "red" }}>
                                {message}
                            </p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default Cart;
