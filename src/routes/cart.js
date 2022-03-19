const express = require("express")
const CartController = require("../app/controllers/CartController")
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../app/middlewares/verifyToken")

const router = express.Router()

router.post("/list", verifyToken, CartController.getCartsByUserId)
router.post("/all", verifyTokenAndAdmin, CartController.getAllCarts)
router.post("/delete-many", verifyToken, CartController.deleteManyCartItem)
router.post("/delete-all", verifyToken, CartController.deleteAllCartItem)
router.post("/delete", verifyToken, CartController.deleteCartItem)
router.post("/add", verifyToken, CartController.addToCart)
router.post("/update", verifyToken, CartController.updateCartItem)

module.exports = router
