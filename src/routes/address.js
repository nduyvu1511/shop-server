const express = require("express")
const AddressController = require("../app/controllers/AddressController")

const router = express.Router()

router.get("/province", AddressController.getProvince)
router.get("/district/:id", AddressController.getDistrict)
router.get("/ward/:id", AddressController.getWard)

module.exports = router
