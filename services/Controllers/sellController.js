const { Double, ObjectId } = require("mongodb")
const Holding = require("../models/Holding")
const StockTransaction = require("../models/StockTransaction")
const Wallet = require("../models/Wallet")

const toNumber = (value) => (value && typeof value.toNumber === "function" ? value.toNumber() : Number(value))

const sellStock = async (req, res) => {
  try {
    const userIdValue = req.user?.userId
    if (!userIdValue || !ObjectId.isValid(userIdValue)) {
      return res.status(401).json({ error: "Authenticated user is required" })
    }

    const userId = new ObjectId(userIdValue)
    const stockSymbol = String(req.body.stockSymbol || "").trim().toUpperCase()
    const quantity = Number(req.body.quantity)
    const sellPrice = Number(req.body.sellPrice)
    const sellDate = req.body.sellDate ? new Date(req.body.sellDate) : new Date()

    if (!stockSymbol) return res.status(400).json({ error: "stockSymbol is required" })
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ error: "quantity must be a whole number greater than 0" })
    }
    if (!Number.isFinite(sellPrice) || sellPrice <= 0) {
      return res.status(400).json({ error: "sellPrice must be a positive number" })
    }
    if (Number.isNaN(sellDate.getTime())) {
      return res.status(400).json({ error: "sellDate must be a valid date" })
    }

    const holding = await Holding.findOne({ userId, stockSymbol })
    if (!holding) return res.status(400).json({ error: "You do not own this stock" })
    if (holding.quantity < quantity) {
      return res.status(400).json({ error: "Not enough quantity to sell", ownedQuantity: holding.quantity })
    }

    const wallet = await Wallet.findByUserId(userId)
    if (!wallet) return res.status(400).json({ error: "Wallet not found for user" })

    const totalValue = sellPrice * quantity
    const profitLoss = (sellPrice - toNumber(holding.purchasePrice)) * quantity
    const transaction = new StockTransaction({
      userId,
      stockSymbol,
      type: "sell",
      quantity,
      price: new Double(sellPrice),
      transactionDate: sellDate,
    })

    await wallet.deposit(totalValue)
    const remainingQuantity = holding.quantity - quantity
    if (remainingQuantity === 0) {
      await Holding.deleteOne({ _id: holding._id })
    } else {
      holding.quantity = remainingQuantity
      await holding.save()
    }
    await transaction.save()

    return res.json({
      message: "Sell executed successfully",
      holding: remainingQuantity === 0 ? null : { ...holding.toObject(), quantity: remainingQuantity },
      walletBalance: wallet.balance,
      transaction,
      profitLoss,
    })
  } catch (error) {
    console.error("sellStock error:", error)
    return res.status(500).json({ error: "Unable to complete sale" })
  }
}

module.exports = { sellStock }
