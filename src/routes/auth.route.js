const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getUser,
  logout,
} = require("../controllers/auth.controllers");

router.post("/register", register);

router.post("/login", login);

router.get("/user", getUser);

router.get("/logout", logout);

module.exports = router;
