// src/components/PaymentPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Spinner, Table, Button, Alert, Card, Container } from 'react-bootstrap';
import { jsPDF } from 'jspdf';

const PaymentPage = ({ userId, cartItems, totalAmount, setCartItems }) => {
    const [orders, setOrders] = useState([]);
    const [paymentCompleted, setPaymentCompleted] = useState(false);
    const [loading, setLoading] = useState(false);

    // Fetch orders function defined in the component's scope
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://wmartselfcheckout.onrender.com/api/payment/finalize-payment', {
                params: { userId },
            });
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const finalizePayment = async () => {
        try {
            const response = await axios.post('https://wmartselfcheckout.onrender.com/api/payment/finalize-payment', {
                userId,
                products: cartItems,
                totalAmount,
            });

            setPaymentCompleted(true);
            setCartItems([]);
            fetchOrders(); // Call fetchOrders after payment to refresh orders
        } catch (error) {
            console.error('Error finalizing payment:', error);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchOrders();
        }
    }, [userId, paymentCompleted]);

    const generatePDFReceipt = (order) => {
        const doc = new jsPDF();
        
        // Header
        doc.setFontSize(18);
        doc.text("Walmart Self-Checkout Receipt", 20, 20);
      
        // Separator line
        doc.setLineWidth(0.5);
        doc.line(20, 25, 190, 25);
      
        // Order Details
        doc.setFontSize(12);
        doc.text(`Date: ${new Date(order.date).toLocaleDateString()}`, 20, 35);
        doc.text(`Time: ${new Date(order.date).toLocaleTimeString()}`, 140, 35);
        doc.text(`User ID: ${userId}`, 20, 45);
        
        // Items Purchased
        doc.setFontSize(14);
        doc.text("Items Purchased:", 20, 55);
        
        // Item details (with better alignment)
        doc.setFontSize(12);
        let y = 65;
        order.products.forEach(item => {
          doc.text(item.name, 20, y);
          doc.text(`$${item.price.toFixed(2)}`, 160, y, { align: 'right' });
          y += 10;
        });
      
        // Total Amount
        y += 10;
        doc.setFontSize(14);
        doc.text("Total Amount:", 20, y);
        doc.setFontSize(12);
        doc.text(`$${order.totalAmount.toFixed(2)}`, 160, y, { align: 'right' });
      
        // Footer
        doc.setFontSize(10);
        doc.text("Thank you for shopping with us!", 20, y + 20);
        doc.text("Visit again at www.walmart.com", 20, y + 30);
        
        // Save the PDF
        doc.save('receipt.pdf');
      };
      

    return (
        <Container className="mt-5">
            <Card className="mb-5">
                <Card.Body>
                    <h2 className="mb-4">Proceed to Payment</h2>
                    {!paymentCompleted ? (
                        <div>
                            <h4>Total Amount: ${totalAmount}</h4>
                            <Button variant="success" className="mt-3" onClick={finalizePayment}>
                                Finalize Payment
                            </Button>
                        </div>
                    ) : (
                        <Alert variant="success">
                            <h4>Payment Completed!</h4>
                        </Alert>
                    )}
                </Card.Body>
            </Card>

            <Card>
                <Card.Header as="h1">Your Orders</Card.Header>
                <Card.Body>
                    {loading ? (
                        <div className="text-center">
                            <Spinner animation="border" variant="primary" />
                            <p>Loading orders...</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <Alert variant="info">
                            <p>No orders yet</p>
                        </Alert>
                    ) : (
                        <Table striped bordered hover responsive className="mt-4">
                            <thead>
                                <tr>
                                    <th>Order Date</th>
                                    <th>Items</th>
                                    <th>Total Price</th>
                                    <th>Download Receipt</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order._id}>
                                        <td>{new Date(order.date).toLocaleDateString()}</td>
                                        <td>
                                            <ul className="list-unstyled">
                                                {order.products.map(product => (
                                                    <li key={product._id}>
                                                        {product.name} - ${product.price.toFixed(2)}
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                        <td>${order.totalAmount.toFixed(2)}</td>
                                        <td>
                                            <Button variant="primary" onClick={() => generatePDFReceipt(order)}>
                                                Download PDF
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default PaymentPage;
