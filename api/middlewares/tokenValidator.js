const JWT = require("jsonwebtoken");
require("dotenv").config();

/* 
    @Title: generateAccessToken
    @Desc: generateAccessToken that signs a users token whenever a user logins or registers to an account
    @Usage: takes in user id and and email as the payload and uses it to generate a token
*/

const generateAccessToken = (payload) =>
 JWT.sign(payload, process.env.JWT_SECRET, {
  expiresIn: "5m",
 });

/* 
    @Title: refreshToken
    @Desc: Automatically refreshes a token on user session
    @Usage: 
*/
const generateRefreshToken = (payload) =>
 JWT.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
  expiresIn: "5m",
 });

const decodeToken = async (token, next) => {
 return JWT.verify(token, process.env.JWT_SECRET, (error, payload) => {
  if (error) {
   return next({ message: "Unauthorized", error: error, status: 401 });
  }

  return payload;
 });
};

/* 
    @Title: verifyAccessToken
    @Desc: Takes in a Authorization Bearer Parameters inside the Auth Headers as a payload to verify if a user has authorized access
    @Usage: Used as a middleware as the main entry point for the secured route
*/

const verifyAccessToken = async (req, res, next) => {
 // If Authorization headers is not present
 if (!req.headers["authorization"]) {
  return next({ message: "Unauthorized", status: 401 });
 }

 const authHeader = req.headers["authorization"];
 // removes the word bearer
 const token = authHeader.split(" ")[1];

 // verify if token exists
 if (!token) return next({ message: "Unauthorized", status: 401 });

 // decode the token
 const payload = await decodeToken(token, next);
 req.user = payload;
 next();
};

module.exports = {
 generateAccessToken,
 generateRefreshToken,
 decodeToken,
 verifyAccessToken,
};
