const express = require("express");
const bodyParser = require("body-parser");
const logger = require("./logger.middleware");

const app = express();

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
