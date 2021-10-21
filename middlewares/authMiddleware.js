const jwt = require("jsonwebtoken");
const User = require("../models/User");
const products = require("../models/Product");

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, "ecrackers digitran", async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.locals.user = null;
        next();
      } else {
        console.log(decodedToken);
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

const localProducts = async (req, res, next) => {
  //const newUsers = await User.find({ isVerified: false });
  res.locals.products = products;
  next();
};

module.exports = { checkUser, localProducts };
