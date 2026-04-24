const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected: ', con.connection.host);
  } catch (error) {
    console.error('Error connecting to MongoDB: ', error);
    process.exit(1); // Exit with failure
  }
};

module.exports = connectDB;