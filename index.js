const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const {
  checkUser,
  localProducts,
  //userCartItems,
} = require("./middlewares/authMiddleware");
const app = express();

if (process.env.NODE_ENV !== "production") require("dotenv").config();

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs");

mongoose
	.connect(dbURI, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => console.log('DATABASE CONNECTED'))
	.catch((err) => console.log(err));
app.get('/', checkUser, localProducts, (_, res) => res.render('index'));
app.get('/about-us', (_, res) => res.render('about-us'));
app.get('/contact', checkUser, (_, res) => res.render('contact'));
app.get('/faq', (_, res) => res.render('faq'));
app.get('/index-3', (_, res) => res.render('index-3'));

app.get('/login-login', (_, res) => res.render('login-login'));
app.get('/login-register', (_, res) => res.render('login-register'));
app.get('/vendor-login', (_, res) => res.render('vendor-login'));
app.get('/vendor-register', (_, res) => res.render('vendor-register'));
app.get('/admin-login', (_, res) => res.render('admin-login'));
app.get('/my-profile', (_, res) => res.render('my-profile'));

app.get("/blog-3-column", (_, res) => res.render("blog-3-column"));
app.get("/blog-audio-format", (_, res) => res.render("blog-audio-format"));
app.get("/blog-details-left-sidebar", (_, res) =>
  res.render("blog-details-left-sidebar")
);
app.get("/blog-gallery-format", (_, res) => res.render("blog-gallery-format"));
app.get("/blog-left-sidebar", (_, res) => res.render("blog-left-sidebar"));
app.get("/blog-list", (_, res) => res.render("blog-list"));
app.get("/blog-list-left-sidebar", (_, res) =>
  res.render("blog-list-left-sidebar")
);
app.get("/blog-video-format", (_, res) => res.render("blog-video-format"));

app.get('/checkout', (_, res) => res.render('checkout'));
app.get('/compare', (_, res) => res.render('compare'));
app.get('/wishlist', checkUser, (_, res) => res.render('wishlist'));
app.get('/shop-left-sidebar', checkUser, localProducts, (_, res) =>
	res.render('shop-left-sidebar')
);
app.get("/shop-list", (_, res) => res.render("shop-list"));
app.get("/shopping-cart", (_, res) => res.render("shopping-cart"));

app.get("/404", (_, res) => res.render("404"));
app.get("/single-product-sale", (_, res) => res.render("single-product-sale"));
app.get("/single-product-tab-style-top", (_, res) =>
  res.render("single-product-tab-style-top")
);

app.use(authRoutes);
