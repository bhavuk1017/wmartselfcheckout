import React from 'react';
import { useNavigate } from 'react-router-dom';

function Checkout({ userId, cartItems, total}) {
    const navigate = useNavigate(); // Hook for navigation

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            alert('Your cart is empty. Please add items to your cart before proceeding.');
        } else {
            // Navigate to the payment page with the total amount passed as state
            navigate('/payment', { state: { userId, cartItems, total } });
        }
    };


    return (
        <div className="card">
            <div className="card-header">
                <h5>Checkout</h5>
            </div>
            <div className="card-body">
                <div className="d-flex justify-content-end mb-3">
                    <strong>Total: ${total}</strong>
                </div>
                <button className="btn btn-warning btn-block" onClick={handleCheckout}>
                    Proceed to Payment
                </button>
            </div>
        </div>
    );
}

export default Checkout;
