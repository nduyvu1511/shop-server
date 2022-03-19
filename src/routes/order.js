const express = require("express")
const OrderController = require("../app/controllers/OrderController")
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../app/middlewares/verifyToken")

const router = express.Router()

router.post("/add", verifyToken, OrderController.AddOrder)
router.post("/list", verifyToken, OrderController.getOrdersByUser)
router.post("/detail", verifyToken, OrderController.getOrderDetail)
router.post("/all", verifyTokenAndAdmin, OrderController.getAllOrders)
router.post("/statistical", verifyTokenAndAdmin, OrderController.getStatistical)
router.post("/delete", verifyTokenAndAdmin, OrderController.deleteOrder)
router.post("/update", verifyTokenAndAdmin, OrderController.updateOrder)

module.exports = router
