// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{
        name: String,
        price: Number,
       
    }],
    totalAmount: Number,
    paymentStatus: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
