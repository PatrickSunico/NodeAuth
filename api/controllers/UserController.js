// Models
const User = require("../models/User");
const OneTimePassword = require("../models/OneTimePassword");

// JWT Token
const {
 generateAccessToken,
 generateRefreshToken,
} = require("../middlewares/tokenValidator");

// Helpers and Mail
const { generateOTP } = require("../helpers/helpers");
const { mailTransport } = require("../helpers/mail");

/*
    @title - Registers the user 
    @desc - Registers the user and saves it in the database, and store the refresh token inside the db 
    @usage - checks if the user exists if not save in the db and then send an access token and refresh token
    @statusCodes - 403 (returns Forbidden Request),
*/

const registerUser = async (req, res, next) => {
 const { first_name, last_name, email, password } = req.body;

 const user = await User.findOne({ email });
 // if user exists don't save
 if (user) return next({ message: "User Already Exists", status: 403 });

 // 1. Create a new User and store it
 const newUser = await User.create({ first_name, last_name, email, password });

 // 2. Setup token generators and the payload
 const payload = { id: newUser._id, email: newUser.email };
 const newAccessToken = await generateAccessToken(payload);
 const newRefreshToken = await generateRefreshToken(payload);

 // 3. update the user with a new refresh token
 const insert = await User.updateOne(
  { email: newUser.email },
  { refreshToken: newRefreshToken }
 );

 if (insert && newAccessToken && newRefreshToken) {
  res.status(200).json({
   accessToken: newAccessToken,
   refreshToken: newRefreshToken,
   userId: newUser._id,
  });
 }
};

/*
    @title - Login and Authenticate the user 
    @desc - Authenticates the user and sends back new access and refresh tokens
    @statusCodes 
    - 403 
*/

const loginUser = async (req, res, next) => {
 const { email, password } = req.body;

 // 1. check if user exists
 const user = await User.findOne({ email });
 if (!user) return next({ message: "User Does not Exists", status: 403 });

 // 2. Password Check
 const isMatched = await user.comparePassword(password);

 if (!isMatched) {
  return next({ message: "Invalid Email or Password", status: 403 });
 }

 // 3. JWT Sign token with id and email
 const payload = { id: user._id, email: user.email };
 const newAccessToken = await generateAccessToken(payload);
 const newRefreshToken = await generateRefreshToken(payload);

 // 4. store the new refreshToken in the DB
 const insert = await User.updateOne(
  { email: email },
  { refreshToken: newRefreshToken }
 );

 if (insert && newAccessToken && newRefreshToken) {
  res.status(200).json({
   message: "Success",
   status: 200,
   accessToken: newAccessToken,
   refreshToken: newRefreshToken,
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

/*
    @title - handles the refresh token 
    @desc -  whenever the token from the client side is expiring regenerate a new token
    @statusCodes -  403 (UnAuthorized)
*/

const handleRefreshToken = async (req, res, next) => {
 // 1. Take the refresh token from the client side check if it exists
 const { refreshToken } = req.body;

 if (!refreshToken) return next({ message: "Invalid Token", status: 401 });

 // 2. compare and authenticate if the token exists in the db or locally

 // 3. if everything is ok create a new access token and refresh token to user
 //  // take the access token from the user
 //  const { client_access_token } = req.body;
 //  // send error if there is no token or it's invalid
 //  if (!client_access_token && client_access_token === null) {
 //   return next({ message: "Invalid Token Unauthorized", status: 403 });
 //  }
 // if everything is ok create a new access token and refresh token to user
 //  const user = await User.findOne({ email });
 //  const payload = { id: newUser._id, email: newUser.email };
 //  const newRefreshToken = await refreshToken(payload);
 //  console.log(newRefreshToken);
 //  res.status(200).json({
 //   message: "Success",
 //   status: 200,
 //   token: newRefreshToken,
 //  });
};
module.exports = {
 registerUser,
 loginUser,
 accessDashboard,
 handleRefreshToken,
};
