// Models
const User = require("../models/User");
const OneTimePassword = require("../models/OneTimePassword");

// JWT Token
const {
 generateToken,
 refreshToken,
} = require("../middlewares/tokenValidator");
const { generateOTP } = require("../helpers/helpers");
const { mailTransport } = require("../helpers/mail");

/*
    @title - Registers the user 
    @desc - Registers the user and saves it in the database, and generates an otp for registration
    @usage - checks if the user exists if not save in the db
    @statusCodes - 403 (returns Forbidden Request),
*/

const registerUser = async (req, res, next) => {
 const { first_name, last_name, email, password } = req.body;

 const user = await User.findOne({ email });
 // if user exists don't save

 if (user) return next({ message: "User Already Exists", status: 403 });

 //  Create a new User
 const newUser = new User({
  first_name,
  last_name,
  email,
  password,
 });

 const payload = { id: newUser._id, email: newUser.email };
 const signedToken = await generateToken(payload);

 // step 1. store an otp to the db
 const otp = await generateOTP();

 const storeOtp = new OneTimePassword({
  owner: newUser._id,
  otp: otp,
 });

 //1. store otp first
 await storeOtp.save();
 //2. save user to DB
 await newUser.save();

 // 3. get the user ID

 if (signedToken) {
  res.status(200).json({ token: signedToken, userId: newUser._id });
 }
};

/*
    @title - Login and Authenticate the user 
    @desc - Authenticates the user and sends back a token
    @statusCodes 
    - 422 (returns Unprocessable Entity Invalid Params)
*/

const loginUser = async (req, res, next) => {
 console.log(req.body);
 const { email, password } = req.body;

 // check if user exists
 const user = await User.findOne({ email });
 if (!user) return next({ message: "User Does not Exists", status: 403 });

 // Password Check
 const isMatched = await user.comparePassword(password);

 if (!isMatched) {
  return next({ message: "Invalid Email or Password", status: 403 });
 }

 // JWT Sign token with id and email
 const payload = { id: user._id, email: user.email };
 const signedToken = await generateToken(payload);
 //  const signedRefreshToken = await refreshToken(payload);

 if (signedToken) {
  res.status(200).json({
   message: "Success",
   status: 200,
   token: signedToken,
  });
 }
};

/*
    @title - Authorized Private Route 
    @desc -  uses a middleware verifyAccessToken to Check if the user is authorized to access this route
    @statusCodes -  401 (UnAuthorized)
*/

const accessDashboard = async (req, res, next) => {
 res.status(200).json({ message: "Success", status: 200 });
};

module.exports = { registerUser, loginUser, accessDashboard };
