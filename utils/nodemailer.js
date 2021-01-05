"use strict";
var mongoose = require("mongoose");
const { mainNewUser } = require("../registration");
const nodemailer = require("nodemailer");
const express = require("express");
const passwordreset = express();
// user: process.env.EMAIL_APP_USER,
// pass: process.env.EMAIL_APP_PASS,
module.exports = function (agenda) {
  passwordreset.post("/", async (req, res) => {
    const users_email = req.body.email_to_reset;
    if (!req || !users_email)
      return res.json({
        err: true,
        sent: false,
        message: "Please provide needed information to continue!",
      });
    var key = mongoose.Types.ObjectId();
    mainNewUser
      .findOne({
        email: users_email,
      })
      .select({
        email: 1,
      })
      .then(async (foundUser) => {
        if (foundUser) {
          passwordResettingEmailing();
        } else {
          return res.json({
            err: true,
            sent: false,
            message: "Sorry no account was found with this email!",
          });
        }
      });
    // async..await is not allowed in global scope, must use a wrapper
    async function passwordResettingEmailing() {
      const output = `
        <p>Hello Chappie team here,</p>

        <h3>Password reset for email: ${users_email}</h3>

        <p>copy this key <strong>${key}</strong>  to reset your account</p>

        <p>paste in the box needed to reset</p>

        <p>click on reset password and thats all to be done</p>
        
        <h3>After 5 minutes this key will be invalid!</h3>

        <p>if you didn't ask to reset your password, you can ignore this email.</p>

        <p>Thanks,</p>

        <p>Your Chappie team</p>
        
    `;
      let transporter = await nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "email here",
          pass: "password here",
        },
      });
      transporter.verify(function (error, success) {
        if (error) {
          console.log(error);
          return res.json({
            err: true,
            sent: false,
            data: "Sorry connection problem please retry again!",
          });
        } else {
          // send mail with defined transport object
          transporter.sendMail(
            {
              from: '"Chappie team 👻" <peacecoderchappie@gmail.com>', // sender address
              to: `${users_email}`, // list of receivers
              subject: "Reset your password for Chappie", // Subject line
              text: "Hello from Chappie?", // plain text body
              html: output, // html body
            },
            (err, result) => {
              if (err) {
                console.log(err);
                return res.json({
                  err: true,
                  sent: false,
                  data: "Sorry key not sent to email please retry again!",
                });
              }
              mainNewUser
                .findOneAndUpdate(
                  {
                    email: users_email,
                  },
                  {
                    $set: {
                      timed_password_reset_key: key,
                      timed_password_reset_key_expired: false,
                    },
                  },
                  {
                    multi: true,
                    new: true,
                    upsert: true,
                    useFindAndModify: false,
                  }
                )
                .then(async (value) => {
                  if (value) {
                    const data = {
                      users_email,
                      agendaId: `${key}_${users_email}`,
                    };
                    await agenda.start();
                    await agenda
                      .create("updatepasswordkey", data)
                      .unique({ "data.agendaId": data.agendaId })
                      .schedule("in 5 minutes")
                      .save();

                    res.json({
                      err: false,
                      sent: true,
                    });
                  } else {
                    return res.json({
                      err: true,
                      sent: false,
                      data: "Sorry no account was found with this email!",
                    });
                  }
                })
                .catch((err) =>
                  console.log(
                    "Error while trying to set new password key on reset",
                    err
                  )
                );
            }
          );
        }
      });
    }
  });
  return passwordreset;
};
