const app = require("./app");
const products = require("./data.js");
const cognito = require("./cognito");
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
  return res.status(200).end();
});

app.post("/auth/signup", validator("signup"), (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(422).json({ errors: result.array() });
  }

  const { email, password, name } = req.body;

  try {
    cognito.signUp(email, name, password);
    return res.status(201).end();
  } catch (error) {
    console.log(error);
    return res.status(500).end();
  }
});

app.listen();
