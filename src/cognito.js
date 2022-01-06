const {
  CognitoIdentityProvider,
} = require("@aws-sdk/client-cognito-identity-provider");

const config = require("./config");

const crypto = require("crypto");

const cognitoIdentity = new CognitoIdentityProvider({ region: config.region });

const cognito = exports;

cognito.signIn = async (email, password) => {
  const params = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: config.clientId,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
      SECRET_HASH: hashSecret(email),
    },
  };

  try {
    const res = await cognitoIdentity.initiateAuth(params);
    console.log("SignIn success. Result: ", res);
    return true;
  } catch (e) {
    console.log("SignIn fail. Error: ", e);
    return false;
  }
};

cognito.signUp = async (email, name, password) => {
  const params = {
    ClientId: config.clientId,
    Password: password,
    Username: email,
    SecretHash: hashSecret(email),
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

cognito.verifyAccount = async (email, code) => {
  const params = {
    ClientId: config.clientId,
    ConfirmationCode: code,
    Username: email,
    SecretHash: hashSecret(email),
  };

  try {
    const res = await cognitoIdentity.confirmSignUp(params);
    console.log("Verification success. Result: ", res);
  } catch (e) {
    console.log("Verification failed Error: ", e);
  }
};

function hashSecret(username) {
  return crypto
    .createHmac("SHA256", config.clientSecret)
    .update(username + config.clientId)
    .digest("base64");
}
