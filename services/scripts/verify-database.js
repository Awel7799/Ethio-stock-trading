require('dotenv').config();

const mongoose = require('mongoose');

const models = [
  require('../models/User'),
  require('../models/Wallet'),
  require('../models/WalletTransaction'),
  require('../models/Holding'),
  require('../models/StockTransaction'),
  require('../models/PerformanceSnapshot'),
];

async function verifyDatabase() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set in services/.env');
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
  });

  const database = mongoose.connection.db;
  const collections = await database.listCollections().toArray();

  console.log(`Connected to database: ${database.databaseName}`);
  console.log(`MongoDB host: ${mongoose.connection.host}`);

  for (const Model of models) {
    await Model.createIndexes();
    const count = await Model.countDocuments();
    console.log(`${Model.modelName}: ${count} document(s), collection "${Model.collection.name}"`);
  }

  const collectionNames = new Set(collections.map((collection) => collection.name));
  console.log(`Existing collections before verification: ${collectionNames.size}`);
  console.log('Database verification completed without inserting documents.');
}

verifyDatabase()
  .catch((error) => {
    console.error(`Database verification failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });