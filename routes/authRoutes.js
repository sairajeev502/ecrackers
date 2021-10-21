const { Router } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { products } = require("../models/Product");

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
  jwt.sign({ id }, "ecrackers digitran", {
    expiresIn: maxAge,
  });

const register_post = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ user });
  } catch (err) {
    res.status(400).json({ err });
  }
};

const login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    if (user) {
      const token = createToken(user._id);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(200).json({ user: user._id });
    } else {
      throw Error("Wrong credentials");
    }
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ err: errors });
  }
};

const cartDetails = async (req, res) => {
  const { _id } = req.body;

  try {
    const user = await User.findById(_id);
    const orders = user.orders.map((e) => {
      return products.filter((product) => product.id === e)[0];
    });

    res.status(200).json({ orders });
  } catch (e) {
    res.status(400).json({ e });
  }
};

const cartUpdate = async (req, res) => {
  const { id, uid: _id } = req.body;

  try {
    const user = await User.findById(_id);
    const orders = [...new Set([...user.orders, id].filter(Boolean))];
    await User.findOneAndUpdate({ _id }, { orders });
    res.status(200).json(orders);
  } catch (e) {
    console.log({ e });
    res.status(400).json({ e });
  }
};

router.post("/register", register_post);
router.post("/login", login_post);
router.post("/cartUpdate", cartUpdate);
router.post("/cartDetails", cartDetails);

module.exports = router;
