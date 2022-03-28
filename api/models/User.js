const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

/*
    @title - User Schema
    @desc - sets up the blueprint of data for the model 
    @usage - defined data types first_name, last_name, email, and password
*/

const userSchema = new mongoose.Schema({
 first_name: {
  type: String,
  required: true,
 },
 last_name: {
  type: String,
  required: true,
 },
 email: {
  type: String,
  unique: true,
  required: true,
 },
 password: {
  type: String,
  required: true,
 },
});

/*
    @title - pre hooks and the usage of save Middleware  
    @desc - before dates gets saved to the db check if any data type has changed
    @usage - salts and hashes the password before saving to the db
*/
userSchema.pre("save", async function (next) {
 // this refers to userSchema
 if (this.isModified("password")) {
  const salt = 10;
  const hash = await bcrypt.hash(this.password, salt);
  this.password = hash;
 }
 next();
});

/*
    @title - Password Checker
    @desc - checks if the password and hash password is equivalent
    @usage - uses comparePassword method via bcrypt to check if plaintext pw and hashed password is the same
*/

userSchema.methods.comparePassword = async function (password) {
 const result = await bcrypt.compareSync(password, this.password);
 return result;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
