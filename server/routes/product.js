const express = require('express');
const QRCode = require('qrcode');
const Product = require('../models/Product');

const router = express.Router();

// Create Product and QR Code
router.post('/add', async (req, res) => {
    const { name, price } = req.body;
    try {
        const qrCodeData = JSON.stringify({ name, price });
        const qrCode = await QRCode.toDataURL(qrCodeData);

        const newProduct = new Product({ name, price, qrCode });
        await newProduct.save();
        res.status(201).json({ message: 'Product added', qrCode });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get Products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
