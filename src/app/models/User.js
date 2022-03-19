const mongoose = require("mongoose")

const validateEmail = (email) =>
  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)

const validatePassword = (pw) =>
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(pw)

const User = new mongoose.Schema(
  {
    user_name: { type: String, required: true, unique: true },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validateEmail, "Email address is invalid!"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "please fill a valid email address",
      ],
    },
    avatar: { type: String },
    password: {
      type: String,
      required: true,
      // validate: [
      //   validatePassword,
      //   "Minimum eight characters, at least one letter and one number!",
      // ],
      // match: [
      //   /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
      //   "please fill a valid email address",
      // ],
    },
    is_admin: { type: Boolean, default: false },
  },
  { timestamps: true }
)

module.exports = mongoose.model("User", User)
