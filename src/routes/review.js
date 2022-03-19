const express = require("express")
const ReviewController = require("../app/controllers/ReviewController")
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../app/middlewares/verifyToken")

const router = express.Router()

router.post("/all", verifyTokenAndAdmin, ReviewController.getAllReviews)
router.post("/product/list", ReviewController.getReviewsByProductId)
router.post("/list", verifyToken, ReviewController.getReviewsByUserId)
router.post("/add", verifyToken, ReviewController.addReview)
router.post("/update", verifyToken, ReviewController.editReview)
router.post("/delete", verifyToken, ReviewController.deleteReview)

module.exports = router
