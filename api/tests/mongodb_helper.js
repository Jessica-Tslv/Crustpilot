const mongoose = require("mongoose");
const { connectToDatabase } = require("../db/db");
const seedDatabase = require("../seed");

beforeAll(async () => {
  await seedDatabase();
  await connectToDatabase();
});

afterAll(async () => {
  await mongoose.connection.close(true);
});
