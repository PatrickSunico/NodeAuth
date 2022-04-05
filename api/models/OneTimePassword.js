const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

/*
    @title - Token Schema
    @desc - sets up the blueprint of data for the model 
    @usage - defined data types first_name, last_name, email, and password
*/
const OneTimePasswordSchema = new mongoose.Schema({
 owner: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
 },
 otp: {
  type: String,
  required: true,
 },

 createdAt: {
  type: Date,
  expires: 3600, // will delete token after 60 mins
  default: Date.now(), // will be assigned whenever a user created an account
 },
});

/*
    @title - pre hooks and the usage of save Middleware  
    @desc - before data gets saved to the db check if any data type has changed
    @usage - salts and hashes the otp before saving to the db
*/

OneTimePasswordSchema.pre("save", async function (next) {
 if (this.isModified("otp")) {
  const salt = 10;
  const hash = await bcrypt.hash(this.otp, salt);
  this.otp = hash;
 }
 next();
});

/*
    @title - OTP Checker
    @desc - checks if the otp and hash otp is equivalent
    @usage - uses comparePassword method via bcrypt to check if plaintext otp and hashed otp is the same
*/
OneTimePasswordSchema.methods.comparePassword = async function (otp) {
 const result = await bcrypt.compareSync(otp, this.otp);
 return result;
};

const OneTimePassword = mongoose.model(
 "OneTimePassword",
 OneTimePasswordSchema
);

module.exports = OneTimePassword;
