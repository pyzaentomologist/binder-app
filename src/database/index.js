const mongoose = require("mongoose");
const logger = require("../logger");
mongoose.Promise = global.Promise;

async function connectToDatabase() {
  try {
    const connectionString = process.env.DATABASE_URL;
    await mongoose.connect(connectionString, { useNewUrlParser: true });
    logger.info("Connected to Mongoose");
  } catch {
    logger.error(error);
  }
}

module.exports = connectToDatabase;
