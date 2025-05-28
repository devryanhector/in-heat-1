import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Product.css";

function Product() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        fetch(`http://localhost:3002/products/${id}`)
            .then((res) => res.json())
            .then((data) => {
                if (data && data.name) {
                    setProduct(data);
                } else {
                    setError("Product not found");
                }
                setLoading(false);
            })
            .catch(() => {
                setError("Error fetching product");
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="product-container">Loading...</div>;
    if (error) return <div className="product-container" style={{ color: "red" }}>{error}</div>;
    if (!product) return <div className="product-container">Product not found</div>;

    return (
        <div className="product-container">
            <img src={product.image || "/assets/product1.jpg"} alt={product.name} className="product-image" />
            <div className="product-info">
                <h1>{product.name}</h1>
                <p className="product-price">${product.price?.toFixed(2)}</p>
                <p>{product.description}</p>
                <button className="add-to-cart">Add to Cart</button>
            </div>
        </div>
    );
}

export default Product;
