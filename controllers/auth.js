const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.signUp = (req, res, next) => {
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  // Encrypt password
  bcrypt
    .hash(password, 12)
    .then((hashedPass) => {
      // Save user to Db
      const user = new User({ email: email, name: name, password: hashedPass });
      return user.save();
    })
    .then((user) => {
      // Return a confirmation
      res.status(201).json({ message: "Signup successful", userId: user.id });
    })
    .catch((err) => {
      console.log(err);
    });
};
