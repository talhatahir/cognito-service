const jwt = require("jsonwebtoken");
const jwkToPem = require("jwk-to-pem");
const fetch = require("node-fetch");
const config = require("./config");

const auth = exports;
let pems = {};

auth.init = async () => {
  const URL = `https://cognito-idp.${config.region}.amazonaws.com/${config.userPoolId}/.well-known/jwks.json`;

  try {
    const response = await fetch(URL);
    if (response.status !== 200) {
      throw `request not successful`;
    }

    const data = await response.json();
    const { keys } = data;
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      const key_id = key.kid;
      const modulus = key.n;
      const exponent = key.e;
      const key_type = key.kty;
      const jwk = { kty: key_type, n: modulus, e: exponent };
      const pem = jwkToPem(jwk);
      pems[key_id] = pem;
    }

    console.log("got all pems");
  } catch (error) {
    console.log("cannot get pems");
    console.log(error);
  }
};

auth.verifyToken = (req, res, next) => {
  const token = req.header("Auth");

  if (token == null) {
    res.status(401).end();
  } else {
    let decodeJwt = jwt.decode(token, { complete: true });

    if (!decodeJwt) {
      res.status(401).end();
    }

    let kid = decodeJwt.header.kid;
    let pem = pems[kid];
    if (!pem) {
      res.status(401).end();
    }

    jwt.verify(token, pem, (err, payload) => {
      if (err) {
        res.status(401).end();
      }
      next();
    });
  }
};
