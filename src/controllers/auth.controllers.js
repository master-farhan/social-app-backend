const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");

async function register(req, res) {
  const { username, password } = req.body;

  const isUserAvailable = await userModel.findOne({ username });

  if (isUserAvailable) {
    return res.status(409).json({ error: "User already exists" });
  }

  const newUser = new userModel({ username, password: await bcrypt.hash(password, 10) });
  newUser
    .save()
    .then(() => {
      const token = jwt.sign(
        { id: newUser._id, username: newUser.username },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // dev এ false, production এ true
        sameSite: "None", // cross-origin এর জন্য mandatory
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(201).json({ message: "User registered successfully" });
    })
    .catch((err) => {
      res.status(500).json({ error: "User registration failed" });
    });
}

async function login(req, res) {
  const { username, password } = req.body;

  const user = await userModel.findOne({ username });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // dev এ false, production এ true
      sameSite: "none", // cross-origin এর জন্য mandatory
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ message: "Login successful" });
  } else {
    res.status(401).json({ error: "Incorrect password" });
  }
}

async function getUser(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await userModel.findById(decoded.id).select("-password -__v");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
      },
    });
  });
}

async function logout(req, res) {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
}

module.exports = {
  register,
  login,
  getUser,
  logout,
};
