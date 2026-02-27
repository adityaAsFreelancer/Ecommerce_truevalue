const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
dotenv.config();
const connectDB = require('./config/db');
connectDB();
const authRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const marketingRoutes = require('./routes/marketingRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const errorHandler = require('./middleware/errorMiddleware');
const app = express();
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(helmet());
app.use(xss());
app.use(hpp());
app.use(cors());
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 1000
});
app.use(limiter);
const paymentRoutes = require('./routes/paymentRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/marketing', marketingRoutes);
app.use('/api/notifications', notificationRoutes);
app.get('/', (req, res) => {
    res.send('True Value API Rebuilt with Mongoose...');
});
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is in use. Killing and restarting...`);
        process.exit(1);
    } else {
        console.error(`❌ Server Error: ${err.message}`);
    }
});
process.on('unhandledRejection', (err, promise) => {
    console.log(`❌ Unhandled Rejection: ${err.message}`);
});
