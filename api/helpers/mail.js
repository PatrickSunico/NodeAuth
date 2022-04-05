const nodemailer = require("nodemailer");
require("dotenv").config();

exports.mailTransport = async () =>
 nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
   user: process.env.MAILTRAP_USERNAME,
   pass: process.env.MAILTRAP_PASSWORD,
  },
 });
