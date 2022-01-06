const { body } = require("express-validator");

const validator = (type) => {
  switch (type) {
    case "signup":
      return [
        body("email").notEmpty().normalizeEmail().isEmail(),
        body("password").isString().isLength({ min: 8 }),
        body("name").notEmpty().isString(),
      ];
    case "signin":
      return [
        body("email").notEmpty().isLength({ min: 6 }),
        body("password").isString().isLength({ min: 8 }),
      ];
    case "verify":
      return [
        body("email").notEmpty().isLength({ min: 6 }),
        body("code").isString().isLength({ min: 6, max: 6 }),
      ];

    default:
      return [];
  }
};

module.exports = validator;
