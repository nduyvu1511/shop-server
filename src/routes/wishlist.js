const express = require("express")
const WishlistController = require("../app/controllers/WishlistController")
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../app/middlewares/verifyToken")

const router = express.Router()

router.post("/add", verifyToken, WishlistController.addToWishlist)
router.post("/list", verifyToken, WishlistController.getWishlistsByUserId)
router.post("/all", verifyTokenAndAdmin, WishlistController.getAllWishlists)
router.post("/delete", verifyToken, WishlistController.deleteWishlist)

module.exports = router
