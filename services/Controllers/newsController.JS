const { fetchMarketNews } = require("../services/newsService.Js");

async function getMarketNews(req, res) {
  try {
    const news = await fetchMarketNews();
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: error.message || "Server error" });
  }
}

module.exports = { getMarketNews };
