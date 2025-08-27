const postModel = require("../models/post.model");
const captionGen = require("../services/ai.service").captionGen;

async function createPost(req, res) {
  const file = req.file;
  console.log("file", file);

  const base64ImageFile = new Buffer.from(file.buffer).toString("base64");
  const caption = await captionGen(base64ImageFile);

  res.json({ caption: caption.candidates[0].content.parts[0].text });
}

module.exports = {
  createPost,
};
