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
  const { firstName, lastName, email } = req.body;

  try {
    const user = await User.create({
      firstName,
      lastName,
      email,
    });

    res.status(201).json({ user });
  } catch (err) {
    if (err.message.includes("duplicate")) {
      res.status(400).json({ error: "Phone no. already registered" });
    }
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

router.get("/register", register_get);
router.post("/register", register_post);
router.get("/admin", admin_get);
router.post("/admin", admin_post);
router.post("/message", message_post);
router.post("/studedit", checkAdmin, studedit_post);
router.post("/all", checkAdmin, allStudents);
router.post("/batch", batchDetails);
router.post("/closebatch", checkAdmin, batchEdit);
router.post("/reregister", reRegister);

module.exports = router;
