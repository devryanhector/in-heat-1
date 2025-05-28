import React, { useEffect, useState } from "react";
import "./Cart.css";

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            setError('You are not logged in.');
            setLoading(false);
            return;
        }
        fetch(`http://localhost:3003/cart/${userId}`)
            .then(res => res.json())
            .then(data => {
                setCartItems(data.items || []);
                setLoading(false);
            })
            .catch(() => {
                setError('Error loading cart.');
                setLoading(false);
            });
    }, []);

    const handleQuantityChange = (id, newQty) => {
        setCartItems((items) =>
            items.map((item) =>
                item.productId === id ? { ...item, quantity: Math.max(1, newQty) } : item
            )
        );
        // TODO: Send update to backend
    };

    const handleRemove = (id) => {
        setCartItems((items) => items.filter((item) => item.productId !== id));
        // TODO: Send remove to backend
    };

    const totalPrice = cartItems.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
        0
    );

    if (loading) return <div className="cart-container">Loading...</div>;
    if (error) return <div className="cart-container" style={{color:'red'}}>{error}</div>;

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
                                <img src={item.image || "/assets/product1.jpg"} alt={item.name} />
                                <div className="cart-item-info">
                                    <h3>{item.name}</h3>
                                    <p>${item.price?.toFixed(2)}</p>
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) =>
                                            handleQuantityChange(item.productId, parseInt(e.target.value))
                                        }
                                    />
                                    <button onClick={() => handleRemove(item.productId)}>Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="cart-total">
                        <h3>Total: ${totalPrice.toFixed(2)}</h3>
                        <button className="checkout-btn" onClick={() => alert("Proceed to checkout")}>
                            Proceed to Checkout
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Cart;
