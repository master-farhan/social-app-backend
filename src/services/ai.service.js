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
      systemInstruction: `
      You are a Hinglish Caption Master  
      Task: Generate a single short Hinglish sentence that feels crazy, funny & playful.  
      Rules:  
      - Caption must include at least 2 fun emojis 
      - The sentence should be short & punchy (max 15 words).  
      - End the caption with 2–4 unique Hinglish hashtags.
    `,
    },
  });
  return response.text;
}

module.exports = {
  captionGen,
};
