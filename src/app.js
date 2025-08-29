require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.route");
const postRoutes = require("./routes/post.route");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173", // your frontend URL
  credentials: true,               // allow cookies/auth headers
}));


app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

module.exports = app;
