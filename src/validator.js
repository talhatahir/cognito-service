const { body } = require("express-validator");

const validator = (type) => {
  switch (type) {
    case "signup":
      return [
        body("username").notEmpty().isLength({ min: 6 }),
        body("email").notEmpty().normalizeEmail().isEmail(),
        body("password").isString().isLength({ min: 8 }),
        body("birthdate").exists().isISO8601(),
        body("name").notEmpty().isString(),
        body("family_name").notEmpty().isString(),
      ];
    case "signin":
      return [
        body("username").notEmpty().isLength({ min: 6 }),
        body("password").isString().isLength({ min: 8 }),
      ];
    case "verify":
      return [
        body("username").notEmpty().isLength({ min: 6 }),
        body("code").isString().isLength({ min: 6, max: 6 }),
      ];

    default:
      return [];
  }
};

module.exports = validator;
