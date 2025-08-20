const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const getStockAdvice = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    // Call Gemini 2.0 Flash model from Google AI Studio
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        contents: [
          {
            parts: [{ text: question }]
          }
        ]
      },
      {
        params: { key: process.env.gemini_API_KEY }, // API key from AI Studio
        headers: { "Content-Type": "application/json" },
        timeout: 30000 // 30 seconds
      }
    );

    // Extract the text from Gemini's response
    const generated =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from model";

    res.json({
      answer: generated,
    });

  } catch (error) {
    console.error(
      "Error fetching from Gemini API:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch data from Gemini API" });
  }
};

module.exports = { getStockAdvice };
