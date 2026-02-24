const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');
const Vendor = require('../models/Vendor');

dotenv.config();

// Static Data (Simplified for seeder - usually you'd read the .js files but since I can't import ES6 easily here, I'll define a subset)
const categoriesData = [
    { name: 'Vegetables', description: 'Fresh and organic vegetables', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e' },
    { name: 'Fruits', description: 'Fresh and sweet fruits', image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b' },
    { name: 'Meat & Poultry', description: 'High quality meats', image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f' },
    { name: 'Dairy', description: 'Fresh milk and dairy products', image: 'https://images.unsplash.com/photo-1550583724-125581f77833' },
    { name: 'Electronics', description: 'Modern gadgets and lights', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475' },
    { name: 'Personal Care', description: 'Health and hygiene', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571' }
];

const seedData = async () => {
    try {
        await connectDB();

        // 1. Clear existing data
        await Product.deleteMany();
        await Category.deleteMany();
        await User.deleteMany();
        await Vendor.deleteMany();

        console.log('Data Cleared...');

        // 2. Create Admin & Vendor User
        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@truevalue.com',
            password: 'password123',
            role: 'admin'
        });

        const vendorUser = await User.create({
            name: 'Store Owner',
            email: 'vendor@truevalue.com',
            password: 'password123',
            role: 'vendor'
        });

        // 3. Create Vendor Profile
        const vendor = await Vendor.create({
            user: vendorUser._id,
            storeName: 'TrueValue Global Store',
            description: 'Official supplier of premium groceries and goods.',
            status: 'active',
            isVerified: true,
            businessAddress: {
                address: 'Market St 101',
                city: 'Global City',
                state: 'State',
                zipCode: '101101'
            }
        });

        console.log('Users & Vendor Created...');

        // 4. Create Categories
        const createdCategories = await Category.insertMany(categoriesData);
        console.log('Categories Seeded...');

        // 5. Seed a few Products as samples
        const sampleProducts = [
            {
                name: "Fresh Organic Tomatoes - 1kg",
                description: "Locally grown, vine-ripened organic tomatoes.",
                price: 40,
                sku: 'TV-VG-001',
                images: ["https://images.unsplash.com/photo-1546470427-0d4db154ceb8"],
                category: createdCategories.find(c => c.name === 'Vegetables')._id,
                vendor: vendor._id,
                countInStock: 200,
                rating: 4.7
            },
            {
                name: "Fresh Onions - 2kg Pack",
                description: "Premium quality onions, essential for every kitchen.",
                price: 60,
                sku: 'TV-VG-002',
                images: ["https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb"],
                category: createdCategories.find(c => c.name === 'Vegetables')._id,
                vendor: vendor._id,
                countInStock: 150,
                rating: 4.8
            },
            {
                name: "LED Bulb - 9W - Pack of 4",
                description: "Energy-efficient LED bulbs with bright white light.",
                price: 299,
                sku: 'TV-EL-001',
                images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64"],
                category: createdCategories.find(c => c.name === 'Electronics')._id,
                vendor: vendor._id,
                countInStock: 50,
                rating: 4.7
            }
        ];

        await Product.insertMany(sampleProducts);
        console.log('Products Seeded...');

        console.log('Seeding Complete! 🚀');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedData();
