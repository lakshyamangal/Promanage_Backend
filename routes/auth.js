const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { register, login, updateUser } = require("../controllers/auth");
const { validateRequest } = require("../middlewares/requestValidator");
const verifyJwt = require("../middlewares/authMiddleware");

router.post(
  "/register",
  [
    check("name", "Name is required").isString(),
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
      res.send({ success: "true", data: data });
    } catch (err) {
      res.send({ success: "false", data: err.toString() });
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
      res.send({ success: "true", data: data });
    } catch (err) {
      res.send({ success: "false", data: err.toString() });
    }
  }
);

router.put(
  "/updateUser",
  verifyJwt,
  [
    check("name").isString("Name field required").escape(),
    check("oldPassword").isString("Password field required"),
    check("newPassword").optional(),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { userId, name, oldPassword } = req.body;
      const newPassword = req.body.newPassword || null;

      const data = await updateUser(userId, name, oldPassword, newPassword);
      res.send({ success: "true", data: data });
    } catch (err) {
      res.send({ success: "false", data: err.toString() });
    }
  }
);

module.exports = router;
