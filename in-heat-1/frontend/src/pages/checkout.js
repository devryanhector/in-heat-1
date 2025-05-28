import React, { useState } from "react";
import "./checkout.css";

function Checkout() {
    const [form, setForm] = useState({
        fullName: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
        paymentMethod: "credit-card",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Integrate payment processing and order submission
        alert("Order submitted! Thank you.");
    };

    return (
        <div className="checkout-container">
            <h2>Checkout</h2>
            <form className="checkout-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Address</label>
                    <input
                        type="text"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>City</label>
                    <input
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Postal Code</label>
                    <input
                        type="text"
                        name="postalCode"
                        value={form.postalCode}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Country</label>
                    <input
                        type="text"
                        name="country"
                        value={form.country}
                        onChange={handleChange}
                        required
                    />
                </div>

                <h3>Payment Method</h3>

                <div className="form-group">
                    <label>
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="credit-card"
                            checked={form.paymentMethod === "credit-card"}
                            onChange={handleChange}
                        />
                        Credit Card
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="paypal"
                            checked={form.paymentMethod === "paypal"}
                            onChange={handleChange}
                        />
                        PayPal
                    </label>
                </div>

                {form.paymentMethod === "credit-card" && (
                    <>
                        <div className="form-group">
                            <label>Card Number</label>
                            <input
                                type="text"
                                name="cardNumber"
                                value={form.cardNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group half">
                                <label>Expiry Date</label>
                                <input
                                    type="text"
                                    name="expiryDate"
                                    value={form.expiryDate}
                                    onChange={handleChange}
                                    placeholder="MM/YY"
                                    required
                                />
                            </div>

                            <div className="form-group half">
                                <label>CVV</label>
                                <input
                                    type="text"
                                    name="cvv"
                                    value={form.cvv}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </>
                )}

                <button type="submit" className="submit-btn">
                    Place Order
                </button>
            </form>
        </div>
    );
}

export default Checkout;
