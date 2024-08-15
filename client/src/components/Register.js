import React, { useState } from 'react';
import { Button, Form, Container, Alert } from 'react-bootstrap';
import axios from 'axios';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('https://wmartselfcheckout.onrender.com/api/users/register', { username, password });
            if (response.status === 201) {
                setSuccess('Registration successful! You can now log in.');
                setUsername('');
                setPassword('');
            }
        } catch (err) {
            // Check if the error is due to a response or network issue
            if (err.response) {
                // The server responded with a status code outside the range of 2xx
                setError(`Error: ${err.response.data.error || 'An unexpected error occurred.'}`);
            } else if (err.request) {
                // The request was made but no response was received
                setError('Error: No response from server. Please check your network connection.');
            } else {
                // Something happened in setting up the request
                setError(`Error: ${err.message}`);
            }
        }
    };

    return (
        <Container className="mt-5">
            <div className="d-flex justify-content-center">
                <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                    <div className="card-header">
                        <h5>Register</h5>
                    </div>
                    <div className="card-body">
                        {error && <Alert variant="danger">{error}</Alert>}
                        {success && <Alert variant="success">{success}</Alert>}
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
                            <Button variant="primary" type="submit" className="mt-3">
                                Register
                            </Button>
                        </Form>
                    </div>
                </div>
            </div>
        </Container>
    );
}

export default Register;
