import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import ProductScanner from './components/ProductScanner';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Login from './components/Login';
import Register from './components/Register';
import PaymentPage from './components/PaymentPage';
import { getUserIdFromToken } from './utils/auth'; // Ensure correct path


function App() {
    const [cartItems, setCartItems] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        if (isAuthenticated) {
            const id = getUserIdFromToken(); // Retrieve userId from token
            setUserId(id);
            console.log(id);
        }
    }, [isAuthenticated]);

    const handleAddToCart = (product) => {
        if (product && product.price) {
            setCartItems(prevItems => [...prevItems, product]);
        }
    };
    
    useEffect(() => {
        console.log("Cart Items Updated: ", cartItems);
    }, [cartItems]);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
        setUserId(null); // Clear userId on logout
    };

    return (
        <Router>
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                    <Link className="navbar-brand" to="/">Walmart Self-Checkout</Link>
                    {isAuthenticated && (
                        <Link className="btn btn-outline-light" to="/logout">Logout</Link>
                    )}
                </nav>
                <div className="container mt-4">
                    <Routes>
                        <Route path="/payment" element={<PaymentPage userId={userId} cartItems={cartItems} totalAmount={cartItems.reduce((total, item) => total + item.price, 0).toFixed(2)} setCartItems={setCartItems} />} />
                        
                        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
                        <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />
                        <Route path="/logout" element={<LogoutRedirect onLogout={handleLogout} />} />
                        <Route path="/" element={isAuthenticated ? (
                            <>
                                <ProductScanner onAddToCart={handleAddToCart} />
                                <Cart cartItems={cartItems} />
                                <Checkout userId={userId} cartItems={cartItems} total={cartItems.reduce((total, item) => total + item.price, 0).toFixed(2)} />
                            </>
                        ) : (
                            <Navigate to="/login" />
                        )} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

// A simple component that handles the logout and redirects to the login page
function LogoutRedirect({ onLogout }) {
    useEffect(() => {
        onLogout();
    }, [onLogout]);

    return <Navigate to="/login" />;
}

export default App;
