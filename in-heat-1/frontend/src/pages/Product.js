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
    const [editingId, setEditingId] = useState(null);
    const navigate = useNavigate();

    // Fetch user
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

    // Fetch product for buyer view
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

    const handleFormChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "images") {
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
            const url = editingId
                ? `http://localhost:3002/products/${editingId}`
                : "http://localhost:3002/products";
            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (res.ok) {
                setFormMsg(editingId ? "Product updated!" : "Product added!");
                setForm({ name: "", description: "", price: "", quantity: "", category: "", images: [] });
                setEditingId(null);
                const refreshUrl = `http://localhost:3002/products/seller/${userId}`;
                fetch(refreshUrl)
                    .then(res => res.json())
                    .then(setSellerProducts)
                    .catch(() => setSellerProducts([]));
            } else {
                setFormMsg(data.message || "Error saving product");
            }
        } catch (e) {
            setFormMsg("Error saving product");
        }
    };

    const handleEdit = (prod) => {
        setForm({
            name: prod.name,
            description: prod.description,
            price: prod.price,
            quantity: prod.quantity,
            category: prod.category,
            images: prod.images
        });
        setEditingId(prod._id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (prodId) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            const res = await fetch(`http://localhost:3002/products/${prodId}`, {
                method: "DELETE"
            });
            if (res.ok) {
                setSellerProducts(prev => prev.filter(p => p._id !== prodId));
            } else {
                alert("Error deleting product");
            }
        } catch {
            alert("Error deleting product");
        }
    };

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
        } catch {
            setMessage("Error adding to cart");
        }
        setAdding(false);
    };

    if (loading) return <div className="product-container">Loading...</div>;
    if (error) return <div className="product-container" style={{ color: "red" }}>{error}</div>;

    // Seller view
    if (user && user.userType === "seller") {
        return (
            <div className="product-container" style={{ flexDirection: 'column', alignItems: 'center' }}>
                <form className="product-entry-form" onSubmit={handleProductCreate}>
                    <h2>{editingId ? "Edit Product" : "Add New Product"}</h2>
                    <input name="name" value={form.name} onChange={handleFormChange} placeholder="Product Name" required />
                    <textarea name="description" value={form.description} onChange={handleFormChange} placeholder="Description" required />
                    <input name="price" type="number" min="0" value={form.price} onChange={handleFormChange} placeholder="Price" required />
                    <input name="quantity" type="number" min="0" value={form.quantity} onChange={handleFormChange} placeholder="Quantity" required />
                    <input name="category" value={form.category} onChange={handleFormChange} placeholder="Category" required />
                    <input name="images" type="file" accept="image/*" onChange={handleFormChange} />
                    {form.images && form.images[0] && (
                        <img src={form.images[0]} alt="Preview" style={{ maxHeight: "150px", marginTop: "10px" }} />
                    )}
                    <button type="submit">{editingId ? "Update Product" : "Add Product"}</button>
                    {formMsg && <p style={{ color: formMsg.includes("added") || formMsg.includes("updated") ? "green" : "red" }}>{formMsg}</p>}
                </form>
                <h2>Your Products</h2>
                <div className="product-grid">
                    {sellerProducts.length === 0 ? <p>No products yet.</p> : sellerProducts.map(prod => (
                        <div className="product-card" key={prod._id}>
                            <img src={prod.images?.[0] || "/assets/product1.jpg"} alt={prod.name} />
                            <h3>{prod.name}</h3>
                            <p>${prod.price?.toFixed(2)}</p>
                            <p>Stock: {prod.quantity}</p>
                            <p>Category: {prod.category}</p>
                            <button onClick={() => handleEdit(prod)}>Edit</button>
                            <button onClick={() => handleDelete(prod._id)} style={{ backgroundColor: "red", color: "white", marginTop: "5px" }}>Delete</button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Buyer view of single product
    if (user && user.userType === "buyer" && product) {
        return (
            <div className="product-container" style={{ alignItems: 'center', flexDirection: 'column' }}>
                <img src={product.images?.[0] || "/assets/product1.jpg"} alt={product.name} style={{ width: '100%', maxWidth: '400px', borderRadius: '12px' }} />
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <p><strong>Price:</strong> ${product.price?.toFixed(2)}</p>
                <p><strong>Stock:</strong> {product.quantity}</p>
                <p><strong>Category:</strong> {product.category}</p>
                <button onClick={handleAddToCart} disabled={adding}>{adding ? "Adding..." : "Add to Cart"}</button>
                {message && <p style={{ marginTop: "1rem", color: message.includes("Added") ? "green" : "red" }}>{message}</p>}
            </div>
        );
    }

    // Fallback for buyers without product
    if (user && user.userType === "buyer") {
        return <div className="product-container">Please select a product to view.</div>;
    }

    return <div className="product-container">No product selected or not logged in.</div>;
}

export default Product;
