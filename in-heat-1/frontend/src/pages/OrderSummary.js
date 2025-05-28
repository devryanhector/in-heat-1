import React from 'react';
import './orderSummary.css';

function OrderSummary() {
    return (
        <div className="order-summary-container">
            <h2>Order Summary</h2>
            <ul>
                <li>Item 1 - $25.00</li>
                <li>Item 2 - $15.00</li>
            </ul>
            <p>Total: $40.00</p>
        </div>
    );
}

export default OrderSummary;