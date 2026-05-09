const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('Connection string host:', process.env.MONGO_URI?.split('@')[1]?.split('/')[0] || 'Not set');
    
    const con = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✓ MongoDB Connected:', con.connection.host);
  } catch (error) {
    console.error('\n❌ MongoDB Connection Error:');
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    console.error('Hostname:', error.hostname);
    console.error('\nTroubleshooting Tips:');
    console.error('1. Check IP whitelist in MongoDB Atlas (add your IP or use 0.0.0.0/0)');
    console.error('2. Verify MongoDB cluster is active (not paused)');
    console.error('3. Confirm MONGO_URI is correct in .env file');
    console.error('4. Check network/firewall connectivity\n');
    process.exit(1); // Exit with failure
  }
};

module.exports = connectDB;