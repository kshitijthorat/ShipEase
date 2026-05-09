const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
let usingMemoryServer = false;
let connectedDbName = null;

const getRealTestUri = () => process.env.TEST_MONGO_URI;

exports.connect = async () => {
  const realUri = getRealTestUri();

  if (realUri) {
    const dbName = process.env.TEST_DB_NAME || 'shipease_test';
    await mongoose.connect(realUri, { dbName });
    connectedDbName = dbName;
    usingMemoryServer = false;
    return;
  }

  mongoServer = await MongoMemoryServer.create();
  const memoryUri = mongoServer.getUri();
  await mongoose.connect(memoryUri);
  usingMemoryServer = true;
};

exports.closeDatabase = async () => {
  if (mongoose.connection.readyState !== 0) {
    if (usingMemoryServer || process.env.TEST_DROP_DATABASE === 'true') {
      await mongoose.connection.dropDatabase();
    }
    await mongoose.connection.close();
  }

  if (mongoServer) {
    await mongoServer.stop();
    mongoServer = null;
  }
};

exports.clearDatabase = async () => {
  if (mongoose.connection.readyState === 0) return;

  if (!usingMemoryServer && connectedDbName !== 'shipease_test') {
    throw new Error(
      `Refusing to clear database "${connectedDbName}". Set TEST_DB_NAME=shipease_test for test runs.`
    );
  }

  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};
