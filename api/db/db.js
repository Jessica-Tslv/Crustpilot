const mongoose = require("mongoose");
const seedDatabase = require("../seed.js");
const dotenv = require("dotenv");

dotenv.config();

/**
 * Uses the `MONGODB_TEST_URL` from the .env to connect to the test database
 * */
// async function connectToTestDatabase() {
// 	await seedDatabase(test_db = true)
// 	const mongoDbUrl = process.env.MONGODB_TEST_URL;
// 	if (!mongoDbUrl) {
// 		console.error(
// 			"No MONGODB_TEST_URL provided. Make sure there is a MONGODB_TEST_URL environment variable set. See the README for more details."
// 		);
// 		throw new Error("No connection string provided");
// 	}

// 	await mongoose.connect(mongoDbUrl);

// 	if (process.env.NODE_ENV !== "test") {
// 		console.log("Successfully connected to MongoDB");
// 	}
// }

async function connectToDatabase() {
  const mongoDbUrl = process.env.MONGODB_URL;

  if (!mongoDbUrl) {
    console.error(
      "No MongoDB url provided. Make sure there is a MONGODB_URL environment variable set. See the README for more details.",
    );
    throw new Error("No connection string provided");
  }

  await mongoose.connect(mongoDbUrl);

  if (process.env.NODE_ENV !== "test") {
    console.log("Successfully connected to MongoDB");
  }
}

module.exports = { connectToDatabase };
