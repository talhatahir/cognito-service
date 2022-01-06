const { validationResult } = require("express-validator");
const app = require("./app");
const products = require("./data.js");
const cognito = require("./cognito");
const validator = require("./validator");
const auth = require("./auth.middleware");

auth.init();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/auth/signin", validator("signin"), (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(422).json({ errors: result.array() });
  }
  const { email, password } = req.body;

  cognito.signIn(email, password).then((response) => {
    if (response) {
      return res.status(200).end();
    } else {
      return res.status(500).end();
    }
  });
});

app.post("/auth/signup", validator("signup"), (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(422).json({ errors: result.array() });
  }

  const { email, password, name } = req.body;

  cognito.signUp(email, name, password).then((response) => {
    if (response) {
      return res.status(201).end();
    } else {
      return res.status(500).end();
    }
  });
});

app.post("/auth/verify", validator("verify"), (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(422).json({ errors: result.array() });
  }

  const { email, code } = req.body;

  cognito.verifyAccount(email, code).then((response) => {
    if (response) {
      return res.status(200).end();
    } else {
      return res.status(500).end();
    }
  });
});

app.use(auth.verifyToken).get("/auth/products", (req, res) => {
  res.json(products);
});

app.listen();
