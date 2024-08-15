const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const orderRoutes= require('./routes/order');
const paymentRoutes=require('./routes/payment');
require('dotenv').config();
const app = express();
const corsOptions = {
    origin: "https://wmartselfcheckout-frontend.onrender.com", // frontend URI (ReactJS)
}
app.use(express.json());
app.use(cors(corsOptions));


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/payment', paymentRoutes);
// app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
