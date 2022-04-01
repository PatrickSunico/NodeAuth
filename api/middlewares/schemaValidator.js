const Joi = require("joi");

/*
    @title - Validate body request
    @desc - a validator for predefined schemas listed below will take in a schema object based on what is defined
    @usage - Function that takes in a schema and validates the body then returns whether there is an error or not

*/

const validateBody = (schema) => {
 return async (req, res, next) => {
  const result = await schema.validate(req.body, {
   abortEarly: false,
  });

  // if Error
  if (result.error) {
   next(result.error);
  }

  if (!req.value) req.value = {};
  req.value["body"] = result.value;

  next();
 };
};

/*
    @title - Auth Schema Validation Object
    @usage - This is where you defined values that are required whenever a user signs up a new account

*/

const authSchema = Joi.object().keys({
 first_name: Joi.string().trim().required(),
 last_name: Joi.string().trim().required(),
 email: Joi.string().email({
  minDomainSegments: 2,
  tlds: { allow: ["com", "net"] },
 }),
 password: Joi.string().required(),
 repeat_password: Joi.any()
  .equal(Joi.ref("password"))
  .required()
  .label("Password's")
  .messages({ "any.only": "{{#label}} does not match" }),
});

const loginSchema = Joi.object().keys({
 email: Joi.string().email({
  minDomainSegments: 2,
  tlds: { allow: ["com", "net"] },
 }),
 password: Joi.string().required(),
});

module.exports = {
 authSchema,
 loginSchema,
 validateBody,
};
