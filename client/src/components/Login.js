import React, { useState } from 'react';
import { Button, Form, Container, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('https://wmartselfcheckout.onrender.com/api/users/login', { username, password });
            if (response.status === 200) {
                // Save token to local storage or state
                localStorage.setItem('authToken', response.data.token);
                onLogin(); // Call the onLogin function passed from App
            }
        } catch (err) {
            setError(err.response.data.error || 'Error logging in. Please try again.');
        }
    };

    return (
        <Container className="mt-5">
            <div className="d-flex justify-content-center">
                <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                    <div className="card-header">
                        <h5>Login</h5>
                    </div>
                    <div className="card-body">
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="formUsername">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formPassword" className="mt-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="mt-3" block>
                                Login
                            </Button>
                        </Form>
                        <div className="mt-3 text-center">
                            <span>Don't have an account? </span>
                            <Link to="/register" className="btn btn-link">
                                Register
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}

export default Login;
