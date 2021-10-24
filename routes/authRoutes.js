const { Router } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { products } = require("../models/Product");
const { checkUser } = require("../middlewares/authMiddleware");

const router = Router();

const handleErrors = (err) => {
	let errors = { email: '', password: '' };

	if (err.message === 'Incorrect Email') {
		errors.email = err.message;
		return errors;
	}
	if (err.message === 'Incorrect Password') {
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

// wishlistdetails

const wishlistdetails = async (req, res) => {
	const { _id } = req.body;
	try {
		const user = await User.findById(_id);
		const count = user.wishlist.reduce((acc, val) => {
			acc[val] = acc[val] + 1 || 1;
			return acc;
		}, {});
		const keys = Object.keys(count);
		const wishlist = keys.map((e) => {
			const det = products.filter((product) => product.id === e)[0];
			det.count = count[e];
			return det;
		});

		res.status(200).json({ wishlist });
	} catch (e) {
		res.status(400).json({ e });
	}
};

// wishlistupdate

const wishlistUpdate = async (req, res) => {
	const { id, uid } = req.body;
	try {
		const user = await User.findById(uid);
		const wishlist = [...user.wishlist, id].filter(Boolean);
		await User.findOneAndUpdate({ _id: uid }, { wishlist });
		res.status(200).json(wishlist);
	} catch (e) {
		console.log({ e });
		res.status(400).json({ e });
	}
};

const wishlistpage = async (req, res) => {
	const { _id } = req.body;
	console.log(_id);
	const user = await User.findById(_id);
	var arr = [];
	user.wishlist.forEach((w) => {
		products.forEach((product) => {
			if (product.id === w) {
				arr.push(product);
			}
		});
	});
	res.json(arr);
};

const wishlistremove = async (req, res) => {
	const { _id, id } = req.body;
	console.log(_id, id);
	const user = await User.findById(_id);
	const filtered = user.wishlist.filter((w) => w._id !== id);
	res.json(filtered);
};

// cartDetails

const cartDetails = async (req, res) => {
  const { _id } = req.body;
  if (_id) {
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
  } else {
    return null;
  }
};

// cartUpdate

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
  if (_id) {
    try {
      const user = await User.findById(_id);
      const orders = user.orders.filter((e) => id !== e);
      await User.findOneAndUpdate({ _id }, { orders });
      res.status(200).json({ log: "success" });
    } catch (e) {
      console.log({ e });
      res.status(400).json({ e });
    }
  } else {
    res.send(null);
  }
};

//shop items
router.get("/single-product/:id", checkUser, (req, res) => {
  const findProduct = products.filter(
    (product) => product.id === req.params.id
  );
  res.render("single-product", { product: findProduct });
});
const signout = async (req, res) => {
	res.clearCookie('jwt');
	res.redirect('/');
};

router.post('/register', register_post);
router.post('/login', login_post);
router.post('/cartUpdate', checkUser, cartUpdate);
router.post('/cartDetails', cartDetails);
router.post('/remove', cartItemDelete);
router.post('/wishlistUpdate', checkUser, wishlistUpdate);
router.post('/wishlistdetails', checkUser, wishlistdetails);
router.post('/wishlistpage', checkUser, wishlistpage);
router.post('/wishlistremove', wishlistremove);
router.post('/signout', signout);

module.exports = router;
