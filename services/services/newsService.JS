// backend/services/newsServices.js
const axios = require("axios");

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_URL = `https://newsapi.org/v2/everything?q=stock%20market&apiKey=${NEWS_API_KEY}&pageSize=10`;

async function fetchMarketNews() {
  try {
    const { data } = await axios.get(NEWS_API_URL);
    return data.articles; // return articles array
  } catch (error) {
    console.error("❌ Error fetching news from NewsAPI:", error.message);
    throw new Error("Failed to fetch news");
  }
}

module.exports = { fetchMarketNews };
