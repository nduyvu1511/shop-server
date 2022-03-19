const Cart = require("../models/Cart")
const Product = require("../models/Product")

class CartController {
  async addToCart(req, res) {
    const { data } = req.body.params
    const { user_id } = req.locals

    if (data.quantity < 1)
      return res
        .status(400)
        .send({ message: "Số lượng của sản phẩm không hợp lệ!" })

    try {
      const product = await Product.findById(data.product_id)
      if (!product) {
        return res.status(404).send({ message: "Sản phẩm không hợp lệ!" })
      }

      if (
        await Cart.findOne({
          $and: [{ user_id }, { product_id: data.product_id }],
        })
      ) {
        return res.status(400).send({
          message:
            "Sản phẩm này đã tồn tại trong giỏ hàng, vui lòng sử dụng phương thức khác để cập nhật số lượng!",
        })
      }

      if (product.stock === 0) {
        return res.status(400).send({
          message: "Sản phẩm đã hết hàng!",
        })
      }

      if (product.stock < data.quantity) {
        return res.status(400).send({
          message: "Số lượng của sản phẩm vượt quá số lượng tồn kho!",
        })
      }

      const savedCart = new Cart({ ...data, user_id })
      await savedCart.save()

      return res.json({
        message: "Thêm vào giỏ hàng thành công",
        data: savedCart,
      })
    } catch (error) {
      return res.status(400).send(error)
    }
  }

  async getCartsByUserId(req, res) {
    const { user_id } = req.locals

    try {
      const carts = await Cart.find({ user_id })
        .sort({ createdAt: "desc" })
        .lean()

      return res.json({ data: carts })
    } catch (error) {
      return res.status(400).send(error)
    }
  }

  async getAllCarts(req, res) {
    try {
      const carts = await Cart.find().lean()
      const count = await Cart.countDocuments()

      return res.json({
        data: carts,
        count,
      })
    } catch (error) {
      return res.status(400).send(error)
    }
  }

  async deleteCartItem(req, res) {
    const { _id } = req.body.params.data

    try {
      await Cart.deleteOne({ _id })
      return res.json({ message: "Xóa giỏ hàng thành công!", data: { _id } })
    } catch (error) {
      return res.status(400).send(error)
    }
  }

  async deleteManyCartItem(req, res) {
    const { list_id } = req.body.params.data
    const { user_id } = req.locals
    try {
      await Cart.deleteMany({
        $and: [{ _id: { $in: list_id } }, { user_id }],
      })
      return res.json({
        message: "Xóa nhiều sản phẩm ra khỏi giỏ hàng thành công!",
        data: { list_id },
      })
    } catch (error) {
      return res.status(400).send(error)
    }
  }

  async deleteAllCartItem(req, res) {
    const { user_id } = req.locals

    try {
      await Cart.deleteMany({ user_id })
      return res.json({ message: "Xóa tất cả giỏ hàng thành công!", data: [] })
    } catch (error) {
      return res.status(400).send(error)
    }
  }

  async updateCartItem(req, res) {
    const { data } = req.body.params
    const { user_id } = req.locals

    try {
      const product = await Product.findById(data.product_id)

      if (!product) {
        return res.status(400).send({ message: "Sản phẩm không tồn tại!" })
      }

      if (product.stock < data.quantity) {
        return res.status(400).send({
          message: "Số lượng của sản phẩm vượt quá số lượng tồn kho!",
        })
      }

      if (data._id) {
        await Cart.findByIdAndUpdate(
          data._id,
          {
            $set: data,
          },
          { new: true }
        )
      } else if (data.product_id) {
        await Cart.findOneAndUpdate(
          {
            $and: [{ product_id: data.product_id }, { user_id }],
          },
          {
            $set: data,
          },
          { new: true }
        )
      }

      return res.json({ message: "Cập nhật giỏ hàng thành công", data })
    } catch (error) {
      return res.status(400).send(error)
    }
  }
}
module.exports = new CartController()
