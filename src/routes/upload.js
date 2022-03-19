const express = require("express")
const { verifyTokenAndAdmin } = require("../app/middlewares/verifyToken")
const UploadController = require("../app/controllers/UploadController")
const upload = require("../app/middlewares/multer")
const router = express.Router()

router.post(
  "/images",
  // verifyTokenAndAdmin,
  upload.array("image"),
  UploadController.uploadImages
)

module.exports = router
