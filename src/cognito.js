const {
  CognitoIdentityProvider,
} = require("@aws-sdk/client-cognito-identity-provider");

const config = require("./config");

const crypto = require("crypto");

const cognitoIdentity = new CognitoIdentityProvider({ region: config.region });

const cognito = exports;

cognito.signIn = async () => {};

cognito.signUp = async (email, name, password) => {
  const params = {
    ClientId: config.clientId,
    Password: password,
    Username: email,
    SecretHash: hashSecret(config.clientSecret, email, config.clientId),
    UserAttributes: [
      {
        Name: "name",
        Value: name,
      },
    ],
  };

  try {
    const res = await cognitoIdentity.signUp(params);
    console.log("Signup success. Result: ", res);
  } catch (e) {
    console.log("Signup fail. Error: ", e);
  }
};

function hashSecret(clientSecret, username, clientId) {
  return crypto
    .createHmac("SHA256", clientSecret)
    .update(username + clientId)
    .digest("base64");
}
