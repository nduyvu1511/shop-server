const express = require("express")
const CategoryController = require("../app/controllers/CategoryController")
const { verifyTokenAndAdmin } = require("../app/middlewares/verifyToken")

const router = express.Router()

router.get("/list", CategoryController.list)
router.post("/delete", verifyTokenAndAdmin, CategoryController.deleteCategory)
router.post("/add", verifyTokenAndAdmin, CategoryController.addCategory)
router.post("/update", verifyTokenAndAdmin, CategoryController.editCategory)

module.exports = router
