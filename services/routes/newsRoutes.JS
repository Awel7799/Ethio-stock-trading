const express = require("express");
const { getMarketNews } = require("../controllers/newsController.Js");

const router = express.Router();

router.get("/", getMarketNews);

module.exports = router;
