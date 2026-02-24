const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const count = await User.countDocuments();
        console.log(`Total users: ${count}`);

        const users = await User.find().select('+password');
        users.forEach(u => {
            console.log(`- Email: ${u.email}, Role: ${u.role}, PasswordHashed: ${u.password.substring(0, 10)}...`);
        });

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkUsers();
