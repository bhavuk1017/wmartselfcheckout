import React from 'react';

function Cart({ cartItems }) {
    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + item.price, 0).toFixed(2);
    };

    return (
        <div className="card mb-4">
            <div className="card-header">
                <h5>Your Cart</h5>
            </div>
            <div className="card-body">
                {cartItems.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <>
                        {cartItems.map((item, index) => (
                            <div className="d-flex justify-content-between mb-2" key={index}>
                                <span>{item.name}</span>
                                <span>${item.price.toFixed(2)}</span>
                            </div>
                        ))}
                        <div className="d-flex justify-content-end">
                            <strong>Total: ${getTotalPrice()}</strong>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Cart;
