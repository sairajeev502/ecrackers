const express = require("express");
const mongoose = require("mongoose");

const app = express();

require("dotenv").config();

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.json());
app.set("view engine", "ejs");

//const dbURI = process.env.MONGODB_URI
//mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true, useFindAndModify: false })
//.then(_ =>
//app.listen(PORT, () => {
//console.log(`Server is running on port ${PORT}`);
//})
//)
//.catch(err => console.log(err))

app.get("/", (_, res) => res.render("index"));
