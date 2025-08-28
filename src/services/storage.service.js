const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

async function uploadImage(base64Image, fileName) {
  const response = await imagekit.upload({
    file: base64Image,
    fileName: fileName,
    folder: "ai-caption-project",
  });
  return response;
}

module.exports = {
  uploadImage,
};
