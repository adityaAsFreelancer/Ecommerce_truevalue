const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Category = require('./models/Category');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB for seeding...');

        // Clear existing data
        await User.deleteMany();
        await Product.deleteMany();
        await Category.deleteMany();

        // Create Admin User
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@truevalue.com',
            password: 'password123',
            role: 'admin'
        });
        console.log('✅ Admin user created');

        // Create Categories matched to frontend
        const categoryData = [
            { name: 'Fruits', description: 'Fresh seasonal fruits' },
            { name: 'Vegetables', description: 'Fresh vegetables' },
            { name: 'Dairy', description: 'Milk, cheese, and butter' },
            { name: 'Bakery', description: 'Freshly baked bread and cakes' },
            { name: 'Meat & Poultry', description: 'Fresh meat and chicken' },
            { name: 'Cooking Essentials', description: 'Oil, spices, and grains' },
            { name: 'Frozen Foods', description: 'Ready to eat frozen meals' },
            { name: 'Electronics', description: 'Gadgets and accessories' },
            { name: 'Women\'s Care', description: 'Personal care for women' },
            { name: 'Baby Products', description: 'Diapers and baby food' }
        ];

        const categories = await Category.insertMany(categoryData);
        console.log('✅ Categories created');

        // Create initial Products
        const products = [
            {
                name: 'Organic Apples',
                description: 'Sweet organic apples from Shimla.',
                price: 150,
                category: categories.find(c => c.name === 'Fruits')._id,
                vendor: admin._id,
                images: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6bccb'],
                stock: 100
            },
            {
                name: 'Fresh Bread',
                description: 'Whole wheat fresh bread.',
                price: 45,
                category: categories.find(c => c.name === 'Bakery')._id,
                vendor: admin._id,
                images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff'],
                stock: 20
            },
            {
                name: 'Milk Bottle',
                description: 'Pure farm fresh milk.',
                price: 60,
                category: categories.find(c => c.name === 'Dairy')._id,
                vendor: admin._id,
                images: ['https://images.unsplash.com/photo-1563636619-e91000f21fca'],
                stock: 50
            },
            {
                name: 'Wireless Buds',
                description: 'Noise cancelling wireless buds.',
                price: 1999,
                category: categories.find(c => c.name === 'Electronics')._id,
                vendor: admin._id,
                images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df'],
                stock: 30
            }
        ];

        await Product.insertMany(products);
        console.log('✅ Products created');

        console.log('🚀 Seeding completed successfully!');
        process.exit();
    } catch (err) {
        console.error('❌ Seeding failed!');
        console.error(err);
        process.exit(1);
    }
};

seedData();
