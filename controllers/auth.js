const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.signUp = (req, res, next) => {
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  // Check for errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.status = 422;
    error.data = errors.array();
    throw error;
  }

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

exports.signIn = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;

  // Search db for email
  User.findOne({ email: email })
    .then((userDoc) => {
      if (!userDoc) {
        const error = new Error(`No user found with email: ${email}`);
        error.status = 401;
        throw error;
      }
      loadedUser = userDoc;
      // Verify password
      return bcrypt.compare(password, loadedUser.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Incorrect password");
        error.status = 401;
        throw error;
      }
      // Generate JWT
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString(),
        },
        process.env.JWT_PRIVATE_KEY,
        { expiresIn: "24h" }
      );
      res.status(200).json({ token: token, userId: loadedUser._id.toString() });
    })
    .catch((err) => {
      if (!err.status) {
        err.status = 500;
      }
      next(err);
    });
};
