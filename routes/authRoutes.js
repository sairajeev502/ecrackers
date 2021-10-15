const { Router } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = Router();

const handleErrors = (err) => {
  let errors = { email: "", password: "" };

  if (err.message === "Incorrect Email") {
    errors.email = err.message;
    return errors;
  }

  if (err.message === "Incorrect Password") {
    errors.password = err.message;
    return errors;
  }

  return errors;
};

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) =>
  jwt.sign({ id }, "ecrackers-digitran", {
    expiresIn: maxAge,
  });

const register_post = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    res.status(201).json({ user });
  } catch (err) {
    res.status(400).json({ err });
  }
};

const admin_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await User.login(email, password);
    if (admin) {
      const token = createToken(admin._id);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(200).json({ student: admin._id });
    } else {
      throw Error("You are not allowed");
    }
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

router.post("/register", register_post);
router.post("/admin", admin_post);

module.exports = router;
