/*
    title:  user routes
    usage: Main User API Routes
*/

const router = require("express").Router();

/*
    title: Joi Validators
    desc: validators for specific schemas
*/
const { validateBody, authSchema } = require("../middlewares/schemaValidator");

/* 
    title: Lists of API Controllers 
    desc: Controllers that handles all api endpoint routes
*/

const {
 registerUser,
 loginUser,
 accessDashboard,
} = require("../controllers/UserController");

/* 
    title: verifyAccessToken
    desc: verifies and decodes the Auth Bearer token as a middleware if it is a valid token for Authorization
*/

const { verifyAccessToken } = require("../middlewares/tokenValidator");

/*
    @title - User Sign up Route
    @desc - Endpoint for User Registratrion
    @usage - validateBody checks the body schema first if valid, use HOF handles errors globally
*/
router.route("/signup").post(validateBody(authSchema), registerUser);

/*
    @title - User Sign In Route
    @desc - Endpoint for User Authentication
    @usage - validateBody checks the body schema first if valid, use HOF handles errors globally
*/
router.route("/signin").post(loginUser);

/*
    @title - Dashboard Route
    @desc - Endpoint for User Dashboard
    @usage - validateBody checks the body schema first if valid, use HOF handles errors globally
*/
router.route("/dashboard").get(verifyAccessToken, accessDashboard);

module.exports = router;
