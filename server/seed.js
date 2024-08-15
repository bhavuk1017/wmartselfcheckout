const mongoose = require('mongoose');
const QRCode = require('qrcode'); // Ensure this line is included
const fs = require('fs'); // For file system operations
const path = require('path'); // For path operations
const Product = require('./models/Product');

mongoose.connect('mongodb://localhost:27017/self_checkout', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const seedProducts = async () => {
    try {
        await Product.deleteMany({}); // Clear existing data

        const products = [
            { name: 'Product A', price: 10.99 },
            { name: 'Product B', price: 5.49 },
            { name: 'Product C', price: 7.99 }
        ];

        for (const product of products) {
            const qrCodeData = JSON.stringify({ name: product.name, price: product.price });
            const qrCodePath = path.join(__dirname, 'qr_codes', `${product.name.replace(/\s+/g, '_')}.png`);
            
            // Generate QR code as PNG and save to file system
            await QRCode.toFile(qrCodePath, qrCodeData);

            // Save the file path to the database
            await Product.create({ ...product, qrCode: qrCodePath });
        }

        console.log('Database seeded');
        mongoose.disconnect();
    } catch (error) {
        console.error('Error seeding database:', error);
        mongoose.disconnect();
    }
};

// Ensure the 'qr_codes' directory exists
if (!fs.existsSync(path.join(__dirname, 'qr_codes'))) {
    fs.mkdirSync(path.join(__dirname, 'qr_codes'));
}

seedProducts();
