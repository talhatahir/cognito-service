const app = require("./app");
const products = require("./data.js");
const { validationResult } = require("express-validator");

const validator = require("./validator");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/products", (req, res) => {
  res.json(products);
});

app.post("/auth/signin", validator("signin"), (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(422).json({ errors: result.array() });
  }
  const { username, password } = req.body;

  res.send("Sign In start");
});

app.post("/auth/signup", (req, res) => {
  res.send("Sign up start");
});

app.listen();
