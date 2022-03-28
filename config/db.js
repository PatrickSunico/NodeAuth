const mongoose = require("mongoose");
const connectMongoDB = async () => {
 try {
  await mongoose.connect(process.env.MONGO_URI, {
   dbName: process.env.DB_NAME,
   useNewUrlParser: true,
   useUnifiedTopology: true,
  });
  console.log("MongoDB Connected");
 } catch (error) {
  process.exit(1);
 }
};

module.exports = connectMongoDB;
