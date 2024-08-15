const express = require('express');
const Order = require('../models/Order');
const User = require('../models/User');

const router = express.Router();

// Route to finalize payment
router.post('/finalize-payment', async (req, res) => {
    const { userId, products, totalAmount } = req.body;
    try {
        const newOrder = new Order({
            user: userId,
            products,
            totalAmount,
            paymentStatus: 'completed',
            date: new Date() 

        });

        await newOrder.save();

        await User.findByIdAndUpdate(userId, { $push: { orders: newOrder._id } });

        res.status(201).json({ message: 'Order placed successfully', order: newOrder });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route to fetch orders
router.get('/finalize-payment', async (req, res) => {
    const { userId } = req.query; // Retrieving userId from the query parameters
    try {
        const user = await User.findById(userId).populate({
            path: 'orders',
            options: {
                sort: { date: -1 }  // Sort by date in descending order (latest first)
            }
        });
        res.json(user.orders);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;