const User = require("../models/User")
const bcrypt = require("bcryptjs")
const Cart = require("../models/Cart")
const Wishlist = require("../models/Wishlist")
const UserAddress = require("../models/UserAddress")

class UserController {
  async getAllUsers(req, res) {
    const { limit = 100, page = 1 } = req.query
    const skip = (+page - 1) * +limit

    try {
      const users = await User.find()
        .limit(+limit)
        .skip(+skip)
        .lean()

      const newUsers = await Promise.all(
        users.map(async (item) => {
          const cart_count = await Cart.countDocuments({ user_id: item._id })
          const wishlist_count = await Wishlist.countDocuments({
            user_id: item._id,
          })
          const order_count = await Cart.countDocuments({ user_id: item._id })
          const address = await UserAddress.findOne({ user_id: item._id })

          const newAddress = address
            ? `${address.street}, ${address.ward.ward_name}, ${address.district.district_name}, ${address.province.province_name}`
            : ""

          delete item["password"]
          delete item["is_admin"]
          delete item["__v"]

          return {
            ...item,
            cart_count,
            wishlist_count,
            order_count,
            address: newAddress,
          }
        })
      )

      const count = await User.countDocuments()

      return res.json({
        data: newUsers,
        count,
        page: +page,
        limit: +limit,
        totalPage: Math.ceil(count / limit),
      })
    } catch (error) {
      return res.status(400).send(error)
    }
  }

  async getInfoUser(req, res) {
    const _user_id = req.body?.params?.data?.user_id
    const user_id = _user_id ? _user_id : req.locals.user_id
    try {
      const user = await User.findById(user_id).lean()
      const address_list = await UserAddress.find({ user_id: user._id })

      delete user["password"]
      delete user["is_admin"]

      return res.json({ data: { ...user, address_list } })
    } catch (error) {
      return res.status(400).send(error)
    }
  }

  async editUser(req, res) {
    const _user_id = req.body?.params?.data?.user_id
    const user_id = _user_id ? _user_id : req.locals.user_id
    const { data } = req.body.params
    try {
      await User.findByIdAndUpdate(
        user_id,
        {
          $set: data,
        },
        { new: true }
      )

      return res.json({ message: "Chỉnh sửa người dùng thành công!", data })
    } catch (error) {
      return res.status(400).send(error)
    }
  }

  async deleteUser(req, res) {
    const _user_id = req.body?.params?.data?.user_id
    const user_id = _user_id ? _user_id : req.locals.user_id
    try {
      await User.findByIdAndDelete(user_id)
      return res.json({
        message: "Xóa người dùng thành công!",
        data: { _id: id },
      })
    } catch (error) {
      return res.status(400).send(error)
    }
  }

  async changePassword(req, res) {
    const _user_id = req.body?.params?.data?.user_id
    const user_id = _user_id ? _user_id : req.locals.user_id
    const { current_password, new_password } = req.body.params.data

    try {
      const user = await User.findById(user_id).lean()

      if (!user) {
        return res.status(401).send({ message: "Người dùng không tồn tại!" })
      }

      const isCorrectPassword = await bcrypt.compare(
        current_password,
        user.password
      )

      if (current_password === new_password) {
        return res
          .status(401)
          .send({ message: "Mật khẩu tạo mới không được trùng lặp!" })
      }

      if (!isCorrectPassword) {
        return res.status(401).send({ message: "Mật khẩu không chính xác!" })
      }

      const hashedPassword = await bcrypt.hash(new_password, 10)

      await User.findOneAndUpdate(
        { _id: user._id },
        { password: hashedPassword },
        { new: true }
      )

      return res.json({ message: "Sửa mật khẩu thành công!" })
    } catch (error) {
      return res.status(400).send(error)
    }
  }
}
module.exports = new UserController()
