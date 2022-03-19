const express = require("express")
const UserController = require("../app/controllers/UserController")
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../app/middlewares/verifyToken")

const router = express.Router()

router.post("/all", verifyTokenAndAdmin, UserController.getAllUsers)
router.post("/info", verifyToken, UserController.getInfoUser)
router.post("/update", verifyToken, UserController.editUser)
router.post("/change-password", verifyToken, UserController.changePassword)
router.post("/delete", verifyTokenAndAdmin, UserController.deleteUser)

module.exports = router
