const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.use(express.json());

const corsOptions = { origin: false };
app.use(cors(corsOptions));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://www.sunrise-continent.online/");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Authorization, Content-Type, Accept, Cookie"
  );
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH");
  next();
});

// use router - index.js
const route = require("./app/routes")
route(app);

module.exports = app;