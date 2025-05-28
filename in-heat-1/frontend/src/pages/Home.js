import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./home.css";

function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [user, setUser] = useState(null);
    const [cartMsg, setCartMsg] = useState("");

    useEffect(() => {
        // Fetch user info if logged in
        const userId = localStorage.getItem("userId");
        if (userId) {
            fetch(`http://localhost:3001/users/${userId}`)
                .then(res => res.json())
                .then(setUser)
                .catch(() => setUser(null));
        }
        fetch("http://localhost:3002/products")
            .then(res => res.json())
            .then(data => {
                setProducts(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => {
                setError("Error loading products");
                setLoading(false);
            });
    }, []);

    const handleAddToCart = async (product) => {
        setCartMsg("");
        const userId = localStorage.getItem("userId");
        if (!userId) {
            setCartMsg("You must be logged in to add to cart.");
            return;
        }
        const payload = {
            userId,
            productId: product._id,
            sellerId: product.sellerId,
            quantity: 1,
            price: product.price,
            name: product.name
        };
        try {
            const res = await fetch("http://localhost:3003/cart/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (res.ok) {
                setCartMsg("Added to cart!");
            } else {
                setCartMsg(data.message || "Error adding to cart");
            }
        } catch (e) {
            setCartMsg("Error adding to cart");
        }
    };

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Welcome to In-Heat Treats</h1>
                <p>Find the hottest deals on your favorite products!</p>
                {user && user.userType === "seller" && (
                    <Link to="/product" className="view-btn" style={{marginTop:'1rem'}}>Manage My Products</Link>
                )}
            </header>
            <section className="home-featured">
                <h2>Featured Products</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p style={{ color: 'red' }}>{error}</p>
                ) : (
                    <div className="product-grid">
                        {products.map(product => (
                            <div className="product-card" key={product._id}>
                                <img
                                    src={product.images && product.images.length > 0 ? product.images[0] : "/assets/product1.jpg"}
                                    alt={product.name}
                                />
                                <h3>{product.name}</h3>
                                <p>${product.price?.toFixed(2)}</p>
                                <Link to={`/product/${product._id}`} className="view-btn">View</Link>
                                {(!user || user.userType === "buyer") && (
                                    <button className="add-to-cart" style={{marginTop:'0.5rem'}} onClick={() => handleAddToCart(product)}>
                                        Add to Cart
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                {cartMsg && <p style={{marginTop:'1rem', color: cartMsg === "Added to cart!" ? "green" : "red"}}>{cartMsg}</p>}
            </section>
        </div>
    );
}

export default Home;
