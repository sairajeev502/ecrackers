const { Router } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { products } = require("../models/Product");
const { checkUser } = require("../middlewares/authMiddleware");

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
      console.log({ user: user._id });
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
    const count = user.orders.reduce((acc, val) => {
      acc[val] = acc[val] + 1 || 1;
      return acc;
    }, {});
    const keys = Object.keys(count);
    const orders = keys.map((e) => {
      const det = products.filter((product) => product.id === e)[0];
      det.count = count[e];
      return det;
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
    const orders = [...user.orders, id].filter(Boolean);
    await User.findOneAndUpdate({ _id }, { orders });
    res.status(200).json(orders);
  } catch (e) {
    console.log({ e });
    res.status(400).json({ e });
  }
};

const cartItemDelete = async (req, res) => {
  const { id, _id } = req.body;

  try {
    const user = await User.findById(_id);
    const orders = user.orders.filter((e) => id !== e);
    await User.findOneAndUpdate({ _id }, { orders });
    res.status(200).json({ log: "success" });
  } catch (e) {
    console.log({ e });
    res.status(400).json({ e });
  }
};
//shop items
router.get("/single-product/:id", checkUser, (req, res) => {
  //console.log("Id is" + req.params.id );
  var findProduct=products.filter((product)=> {
    if(product.id===req.params.id){
      return product
    }else{
      return
    }
  });
  //console.log(findProduct);
  res.render("single-product", { product : findProduct })
});


router.post("/register", register_post);
router.post("/login", login_post);
router.post("/cartUpdate", cartUpdate);
router.post("/cartDetails", cartDetails);
router.post("/remove", cartItemDelete);

module.exports = router;
