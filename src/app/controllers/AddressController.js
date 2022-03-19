const Province = require("../models/Province")
const Ward = require("../models/Ward")
const District = require("../models/District")
const UserAddress = require("../models/UserAddress")

class AddressController {
  async getDetailAddress(req, res) {
    const { user_id } = req.locals
    const { _id } = req.body.params.data
    try {
      const address = UserAddress.findById(_id)
      return res.json({ data: address })
    } catch (error) {
      return res.status(400).send(error)
    }
  }

  async getAddressList(req, res) {
    const { user_id } = req.locals
    try {
      const addresses = await UserAddress.find({ user_id }).lean()
      return res.json({ data: addresses })
    } catch (error) {
      return res.status(400).send(error)
    }
  }

  async addAddress(req, res) {
    const { user_id } = req.locals
    const { data } = req.body.params
    const address = new UserAddress({ ...data, user_id }) 
    try {
      await address.save()
      return res.json({ message: "Thêm địa chỉ thành công!", data: address })
    } catch (error) {
      return res.status(400).send(error)
    }
  }

  async updateAddress(req, res) {
    const { _id, ...address } = req.body.params.data
    try {
      await UserAddress.findByIdAndUpdate(_id, address, { new: true })
      return res.json({
        message: "Chỉnh sửa địa chỉ thành công!",
        data: req.body.params.data,
      })
    } catch (error) {
      return res.status(400).send(error)
    }
  }

  async deleteAddress(req, res) {
    const { _id } = req.body.params.data
    try {
      await UserAddress.findByIdAndDelete(_id)
      return res.json({
        message: "Xóa địa chỉ thành công!",
        data: { _id },
      })
    } catch (error) {
      return res.status(400).send(error)
    }
  }

  async getShippingAddress(req, res) {
    try {
    } catch (error) {
      return res.status(400).send(error)
    }
  }

  async getWard(req, res) {
    const { id } = req.params
    try {
      const wards = await Ward.find({ district_id: id })
      return res.json({ data: wards })
    } catch (error) {
      return res.status(400).send(error)
    }
  }

  async getProvince(req, res) {
    try {
      const provinces = await Province.find()
      return res.json({ data: provinces })
    } catch (error) {
      return res.status(400).send(error)
    }
  }

  async getDistrict(req, res) {
    const { id } = req.params
    try {
      const districts = await District.find({ province_id: id })
      return res.json({ data: districts })
    } catch (error) {
      return res.status(400).send(error)
    }
  }
}
module.exports = new AddressController()
