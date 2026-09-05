const express = require("express");
const { getMarketNews } = require("../Controllers/newsController.JS");

const router = express.Router();

router.get("/", getMarketNews);

module.exports = router;
