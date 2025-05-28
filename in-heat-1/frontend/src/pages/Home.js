import React, { useEffect, useState } from "react";
import "./home.css";

function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
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

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Welcome to In-Heat Treats</h1>
                <p>Find the hottest deals on your favorite products!</p>
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
                                <img src={product.image || "/assets/product1.jpg"} alt={product.name} />
                                <h3>{product.name}</h3>
                                <p>${product.price?.toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default Home;
