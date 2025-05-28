import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Product.css";

function Product() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [adding, setAdding] = useState(false);
    const [user, setUser] = useState(null);
    const [sellerProducts, setSellerProducts] = useState([]);
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        quantity: "",
        category: "",
        images: []
    });
    const [formMsg, setFormMsg] = useState("");
    const navigate = useNavigate();

    // Fetch user info
    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            setUser(null);
            setLoading(false);
            return;
        }
        fetch(`http://localhost:3001/users/${userId}`)
            .then(res => res.json())
            .then(data => {
                setUser(data);
                if (data.userType === "seller") {
                    fetch(`http://localhost:3002/products/seller/${userId}`)
                        .then(res => res.json())
                        .then(setSellerProducts)
                        .catch(() => setSellerProducts([]))
                        .finally(() => setLoading(false));
                } else {
                    setLoading(false);
                }
            })
            .catch(() => {
                setUser(null);
                setLoading(false);
            });
    }, []);

    // Fetch product if id is present (for buyer view)
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

    // Handle product form input
    const handleFormChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "images") {
            // Convert images to base64
            const file = files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onloadend = () => {
                setForm(f => ({ ...f, images: [reader.result] }));
            };
            reader.readAsDataURL(file);
        } else {
            setForm(f => ({ ...f, [name]: value }));
        }
    };

    // Handle product creation
    const handleProductCreate = async (e) => {
        e.preventDefault();
        setFormMsg("");
        const userId = localStorage.getItem("userId");
        if (!userId) {
            setFormMsg("You must be logged in as a seller.");
            return;
        }
        const payload = {
            sellerId: userId,
            name: form.name,
            description: form.description,
            images: form.images,
            price: Number(form.price),
            quantity: Number(form.quantity),
            category: form.category
        };
        try {
            const res = await fetch("http://localhost:3002/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (res.ok) {
                setFormMsg("Product added!");
                setForm({ name: "", description: "", price: "", quantity: "", category: "", images: [] });
                // Refresh seller products
                fetch(`http://localhost:3002/products/seller/${userId}`)
                    .then(res => res.json())
                    .then(setSellerProducts)
                    .catch(() => setSellerProducts([]));
            } else {
                setFormMsg(data.message || "Error adding product");
            }
        } catch (e) {
            setFormMsg("Error adding product");
        }
    };

    // Add to cart for buyers
    const handleAddToCart = async () => {
        setAdding(true);
        setMessage("");
        const userId = localStorage.getItem("userId");
        if (!userId) {
            setMessage("You must be logged in to add to cart.");
            setAdding(false);
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
                setMessage("Added to cart!");
            } else {
                setMessage(data.message || "Error adding to cart");
            }
        } catch (e) {
            setMessage("Error adding to cart");
        }
        setAdding(false);
    };

    // UI rendering
    if (loading) return (
        <div className="product-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div style={{ marginBottom: '1.5rem' }}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="spinner">
                    <circle cx="24" cy="24" r="20" stroke="#ff8c00" strokeWidth="6" strokeLinecap="round" strokeDasharray="90 60"/>
                </svg>
            </div>
            <div style={{ fontSize: '1.3rem', color: '#ff8c00', fontWeight: 'bold' }}>Loading product information...</div>
        </div>
    );
    if (error) return <div className="product-container" style={{ color: "red" }}>{error}</div>;

    // Seller view: product entry + their products
    if (user && user.userType === "seller") {
        return (
            <div className="product-container" style={{ flexDirection: 'column', alignItems: 'center' }}>
                <form className="product-entry-form" onSubmit={handleProductCreate} style={{
                    background: '#fffbe6',
                    borderRadius: '16px',
                    boxShadow: '0 2px 12px rgba(255,140,0,0.10)',
                    padding: '2rem',
                    maxWidth: '420px',
                    width: '100%',
                    margin: '2rem auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    alignItems: 'center'
                }}>
                    <h2 style={{ color: '#ff8c00', marginBottom: '1rem' }}>Add New Product</h2>
                    <div style={{ width: '100%' }}>
                        <label style={{ fontWeight: 'bold' }}>Product Name</label>
                        <input name="name" value={form.name} onChange={handleFormChange} placeholder="Product Name" required style={{ width: '100%' }} />
                    </div>
                    <div style={{ width: '100%' }}>
                        <label style={{ fontWeight: 'bold' }}>Description</label>
                        <textarea name="description" value={form.description} onChange={handleFormChange} placeholder="Description" required style={{ width: '100%' }} />
                    </div>
                    <div style={{ width: '100%', display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: 'bold' }}>Price</label>
                            <input name="price" type="number" min="0" value={form.price} onChange={handleFormChange} placeholder="Price" required style={{ width: '100%' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: 'bold' }}>Quantity</label>
                            <input name="quantity" type="number" min="0" value={form.quantity} onChange={handleFormChange} placeholder="Quantity" required style={{ width: '100%' }} />
                        </div>
                    </div>
                    <div style={{ width: '100%' }}>
                        <label style={{ fontWeight: 'bold' }}>Category</label>
                        <input name="category" value={form.category} onChange={handleFormChange} placeholder="Category" required style={{ width: '100%' }} />
                    </div>
                    <div style={{ width: '100%' }}>
                        <label style={{ fontWeight: 'bold' }}>Product Image</label>
                        <input name="images" type="file" accept="image/*" onChange={handleFormChange} style={{ width: '100%' }} />
                        {form.images && form.images.length > 0 && (
                            <img src={form.images[0]} alt="Preview" style={{ marginTop: '0.5rem', width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #eee' }} />
                        )}
                    </div>
                    <button type="submit" style={{ background: '#ff8c00', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.8rem 2rem', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '1rem' }}>Add Product</button>
                    {formMsg && <p style={{ marginTop: "1rem", color: formMsg === "Product added!" ? "green" : "red" }}>{formMsg}</p>}
                </form>
                <h2 style={{marginTop:'2rem'}}>Your Products</h2>
                <div className="product-grid">
                    {sellerProducts.length === 0 ? <p>No products yet.</p> : sellerProducts.map(prod => (
                        <div className="product-card" key={prod._id}>
                            <img src={prod.images && prod.images.length > 0 ? prod.images[0] : "/assets/product1.jpg"} alt={prod.name} />
                            <h3>{prod.name}</h3>
                            <p>${prod.price?.toFixed(2)}</p>
                            <p>Stock: {prod.quantity}</p>
                            <p>Category: {prod.category}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // For buyers, show a fallback or redirect
    if (user && user.userType === "buyer") {
        return <div className="product-container">Product details are not available here. Please browse products on the Home page.</div>;
    }

    // Buyer fallback: no product selected or not logged in
    return <div className="product-container">No product selected.</div>;
}

export default Product;
