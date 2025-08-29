const postModel = require("../models/post.model");
const captionGen = require("../services/ai.service").captionGen;
const uploadImage = require("../services/storage.service").uploadImage;
const { v4: uuid } = require("uuid");

async function createPost(req, res) {
  const file = req.file;

  const base64Image = new Buffer.from(file.buffer).toString("base64");
  const caption = await captionGen(base64Image);

  const result = await uploadImage(base64Image, `${uuid()}`);

  const post = new postModel({
    caption: caption,
    imageUrl: result.url,
    user: req.user._id,
  });
  await post.save();
  res.status(201).json({ caption, imageUrl: result.url, user: req.user._id });
}

async function getMyPosts(req, res) {
  const posts = await postModel.find({ user: req.user._id });
  res.status(200).json(posts);
}

async function getAllPosts(req, res) {
  const posts = await postModel.find();
  res.status(200).json(posts);
}

module.exports = {
  createPost,
  getMyPosts,
  getAllPosts,
};
