// import mongoose
const mongoose = require("mongoose");
const generate = require("../helpers/generate");


const forgotPasswordSchema = new mongoose.Schema(
  {
    email: String,
    otp: String,
    expireAt: {
      type: Date,
      // second (180s = 3p)
      expires: 180
    }
  },
  { timestamps: true }
);

const ForgotPassword = mongoose.model("ForgotPassword", forgotPasswordSchema, "forgot-password");


module.exports = ForgotPassword;
