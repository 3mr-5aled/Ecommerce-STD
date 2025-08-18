const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server-core");

/* global beforeAll, afterAll, afterEach */

let mongoServer;

// Setup test database
beforeAll(async () => {
  // Start MongoDB Memory Server
  mongoServer = await MongoMemoryServer.create();
  const MONGO_URI = mongoServer.getUri();

  // Connect mongoose to the in-memory database
  await mongoose.connect(MONGO_URI);
});

// Clean up after tests
afterAll(async () => {
  await mongoose.connection.close();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

// Clean database between tests
afterEach(async () => {
  const { collections } = mongoose.connection;
  const deletePromises = Object.values(collections).map((collection) =>
    collection.deleteMany({})
  );
  await Promise.all(deletePromises);
});
