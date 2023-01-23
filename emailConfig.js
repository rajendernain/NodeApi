const express = require("express");
const constants = require("./constants.js");
const nodemailer = require("nodemailer");

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: constants.EMAIL_HOST,
    port: constants.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: constants.EMAIL_USER, // generated ethereal user
      pass: constants.EMAIL_PASS, // generated ethereal password
    },
});



  module.exports = {transporter:transporter} 