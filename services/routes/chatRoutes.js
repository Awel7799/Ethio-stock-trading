const express = require("express");
const { getStockAdvice } = require("../Controllers/chatController");

const router = express.Router();
router.post("/advice", getStockAdvice);

module.exports = router;
