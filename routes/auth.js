const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { register, login, updateUser } = require("../controllers/auth");
const { validateRequest } = require("../middlewares/requestValidator");
const verifyJwt = require("../middlewares/authMiddleware");

router.post(
  "/register",
  [
    check("name")
      .notEmpty()
      .withMessage("Name field is required")
      .isString()
      .withMessage("Name must be a string")
      .trim(),
    check("email", "Email is required")
      .isEmail()
      .withMessage("Must be a valid Email"),
    check(
      "password",
      "Password is required and must be at least 6 characters long"
    ).isLength({ min: 6 }),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const data = await register(name, email, password);
      res.send({ success: true, data: data });
    } catch (err) {
      res.send({ success: false, data: err.message });
    }
  }
);

router.post(
  "/login",
  [
    check("email", "Email is required")
      .isEmail()
      .withMessage("Must be a valid Email"),
    check("password", "Password is required"),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const data = await login(email, password);
      res.send({ success: true, data: data });
    } catch (err) {
      res.send({ success: false, data: err.message });
    }
  }
);

router.put(
  "/updateUser",
  verifyJwt,
  [
    check("name")
      .notEmpty()
      .withMessage("Name field is required")
      .isString()
      .withMessage("Name must be a string")
      .trim(),
    check("oldPassword").isString("Password field required"),
    check("newPassword").optional(),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { userId, name, oldPassword } = req.body;
      const newPassword = req.body.newPassword || null;
      console.log(userId, name, oldPassword, newPassword);
      const data = await updateUser(userId, name, oldPassword, newPassword);
      res.send({ success: true, data: data });
    } catch (err) {
      res.send({ success: false, data: err.message });
    }
  }
);

module.exports = router;
