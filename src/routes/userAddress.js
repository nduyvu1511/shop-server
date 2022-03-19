const express = require("express")
const AddressController = require("../app/controllers/AddressController")
const { verifyToken } = require("../app/middlewares/verifyToken")

const router = express.Router()

router.post("/add", verifyToken, AddressController.addAddress)
router.post("/list", verifyToken, AddressController.getAddressList)
router.post("/detail", verifyToken, AddressController.getDetailAddress)
router.post("/delete", verifyToken, AddressController.deleteAddress)
router.post("/update", verifyToken, AddressController.updateAddress)

module.exports = router
