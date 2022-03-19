const express = require("express")
const AuthController = require("../app/controllers/AuthController")

const router = express.Router()

router.post("/register", AuthController.register)
router.post("/login", AuthController.loginMiddleWare, AuthController.login)
router.post(
  "/admin_login",
  AuthController.loginMiddleWare,
  AuthController.adminLogin
)
router.post("/firebase_auth", AuthController.firebaseAuth)

module.exports = router
