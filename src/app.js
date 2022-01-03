const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const logger = (req, res, next) => {
  console.log(req.url);
  console.log(req.params);
  console.log(req.query);
  next();
};

//To parse URL encoded data
app.use(bodyParser.urlencoded({ extended: true }));

//To parse json data
app.use(bodyParser.json());

// execute your middleware for all requests
app.use(logger);

app.listen(3000, () => {
  console.log("Example app listening at port:3000");
});

module.exports = app;
