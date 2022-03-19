const express = require("express")
const ProductController = require("../app/controllers/ProductController")
const upload = require("../app/middlewares/upload")
const { verifyTokenAndAdmin } = require("../app/middlewares/verifyToken")

const router = express.Router()

router.get("/list", ProductController.getProducts)
router.get("/:id", ProductController.getOneProduct)
router.post("/add", verifyTokenAndAdmin, ProductController.addProduct)
router.post("/update", verifyTokenAndAdmin, ProductController.editProduct)
router.post("/delete", verifyTokenAndAdmin, ProductController.deleteProduct)

module.exports = router
