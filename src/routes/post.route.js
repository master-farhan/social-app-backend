const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const postController = require("../controllers/post.controllers");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  upload.single("image"),
  postController.createPost
);

module.exports = router;
