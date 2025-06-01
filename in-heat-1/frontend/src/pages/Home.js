import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./home.css";

function Home() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [user, setUser] = useState(null);
    const [cartMsg, setCartMsg] = useState("");

    // Filters
    const [searchTerm, setSearchTerm] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
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
                const list = Array.isArray(data) ? data : [];
                setProducts(list);
                setFilteredProducts(list);
                setLoading(false);
            })
            .catch(() => {
                setError("Error loading products");
                setLoading(false);
            });
    }, []);

    // Filter logic
    useEffect(() => {
        let result = [...products];

        if (searchTerm) {
            result = result.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (minPrice) {
            result = result.filter(product => product.price >= parseFloat(minPrice));
        }

        if (maxPrice) {
            result = result.filter(product => product.price <= parseFloat(maxPrice));
        }

        setFilteredProducts(result);
    }, [searchTerm, minPrice, maxPrice, products]);

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
                navigate("/carts"); // Redirect to cart after adding
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
                <h1>Welcome to Summer</h1>
                <p>Find the hottest deals on your favorite products!</p>
                {user && user.userType === "seller" && (
                    <Link to="/product" className="view-btn" style={{ marginTop: '1rem' }}>Manage My Products</Link>
                )}
            </header>

            <section className="home-featured">
                <h2>Featured Products</h2>

                {/* Filter Section */}
                <div className="filter-section">
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="filter-input"
                    />
                    <input
                        type="number"
                        placeholder="Min price"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="filter-input"
                    />
                    <input
                        type="number"
                        placeholder="Max price"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="filter-input"
                    />
                </div>

                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p style={{ color: 'red' }}>{error}</p>
                ) : (
                    <div className="product-grid">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map(product => (
                                <div className="product-card" key={product._id}>
                                    <img
                                        src={product.images && product.images.length > 0 ? product.images[0] : "/assets/product1.jpg"}
                                        alt={product.name}
                                    />
                                    <h3>{product.name}</h3>
                                    <p>${product.price?.toFixed(2)}</p>
                                    <Link to={`/product/${product._id}`} className="view-btn">View</Link>
                                    {(!user || user.userType === "buyer") && (
                                        <button className="add-to-cart" style={{ marginTop: '0.5rem' }} onClick={() => handleAddToCart(product)}>
                                            Add to Cart
                                        </button>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>No products found.</p>
                        )}
                    </div>
                )}

                {cartMsg && <p style={{ marginTop: '1rem', color: cartMsg === "Added to cart!" ? "green" : "red" }}>{cartMsg}</p>}
            </section>
        </div>
    );
}

export default Home;
