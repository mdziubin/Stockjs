const User = require("../models/user.js");
const { use } = require("../routes/test.js");

module.exports = (req, res, next) => {
  User.findById(req.userId)
    .then((userDoc) => {
      if (userDoc.perm !== "admin") {
        const error = new Error("Permission denied");
        error.statusCode = 401;
        throw error;
      }
      next();
    })
    .catch((err) => {
      if (!err.status) {
        err.status = 500;
      }
      next(err);
    });
};
