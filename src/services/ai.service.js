const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function captionGen(base64ImageFile) {
  const contents = [
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64ImageFile,
      },
    },
    { text: "Caption this image." },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: contents,
    config: {
      systemInstruction:
        "You are a captioning AI. Generate a caption for the image. Generate a caption that is creative and contextually relevant and on the topic of the image. Keep it short and at the last use some emojis and hashtags.",
    },
  });
  return response;
}

module.exports = {
  captionGen,
};
