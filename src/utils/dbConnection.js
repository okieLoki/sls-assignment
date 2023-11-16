const mongoose = require('mongoose');

let cachedConnection = null;

const uri = 'mongodb+srv://royu49:rajbeer11@cluster0.mczazx6.mongodb.net/?retryWrites=true&w=majority';

async function connect() {
  if (cachedConnection === null) {
    try {
      const connection = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      cachedConnection = connection;
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error;
    }
  }

  return cachedConnection;
}

module.exports = connect;
