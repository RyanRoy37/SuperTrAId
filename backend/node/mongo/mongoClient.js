const mongoose = require('mongoose');

const connectMongo = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    dbName: 'supertraid_user'
  });
  console.log('MongoDB connected');
};

module.exports = connectMongo;
