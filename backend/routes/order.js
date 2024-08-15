const express = require('express');
const QRCode = require('qrcode');
const Product = require('../models/Product');

const router = express.Router();


router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('orders');
        res.json(user.orders);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;