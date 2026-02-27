const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const resetAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        let user = await User.findOne({ email: 'admin@truevalue.com' });
        if (!user) {
            console.log('Admin not found, creating one...');
            user = new User({
                name: 'Admin',
                email: 'admin@truevalue.com',
                password: 'password123',
                role: 'admin'
            });
        } else {
            console.log('Admin found, updating...');
            user.password = 'password123';
            user.role = 'admin';
        }

        await user.save();
        console.log('✅ Admin user updated/created: admin@truevalue.com / password123');

        mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

resetAdmin();
