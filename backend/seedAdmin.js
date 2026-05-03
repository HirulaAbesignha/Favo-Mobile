const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    // 1. Connect to the database
    if (!process.env.MONGODB_URI || process.env.MONGODB_URI === 'your_mongodb_atlas_connection_string') {
      console.error('❌ Error: Please update your MONGODB_URI in the backend/.env file first!');
      process.exit(1);
    }
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // 2. Check if admin already exists
    const adminEmail = 'test@favo.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log('⚠️ Admin user already exists! You can log in with:');
      console.log(`Email: ${adminEmail}`);
      process.exit(0);
    }

    // 3. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);

    // 4. Create the user
    await User.create({
      name: 'Favo Admin',
      email: adminEmail,
      password: hashedPassword,
      phone: '0000000000', // Required field
      role: 'admin',
    });

    console.log('🎉 Admin user created successfully!');
    console.log(`Email: ${adminEmail}`);
    console.log('Password: 123456');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
};

seedAdmin();
