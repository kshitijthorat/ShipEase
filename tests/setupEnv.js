// Set NODE_ENV to test BEFORE loading anything
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'testsecret';
process.env.PORT = 5001;

// Load .env file
require('dotenv').config({ override: true });

// Override MongoDB URI to use in-memory database for tests
delete process.env.MONGO_URI;
delete process.env.TEST_MONGO_URI;
