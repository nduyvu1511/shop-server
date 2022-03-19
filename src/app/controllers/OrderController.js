const Cart = require("../models/Cart")
const Order = require("../models/Order")
const Product = require("../models/Product")
const User = require("../models/User")
const UserAddress = require("../models/UserAddress")

class OrderController {
  async getAllOrders(req, res) {
    let { page = 1, limit = 12 } = req.query
    page = +page
    limit = +limit

    const skip = (page - 1) * limit

    const { month, day, year } = req.query

    try {
      const orders = await Order.find({
        // createdAt: {
        //   $gte: today.toDate(),
        //   $lte: moment(today).endOf("day").toDate(),
        // },
      })
        .limit(limit)
        .skip(skip)
        .lean()

      const count = await Order.countDocuments()

      const newOrders = await Promise.all(
        orders.map(async (item) => {
          const address = await UserAddress.findById(item.user_address_id)

          // Get name, price, sub total of each product
          const productList = await Promise.all(
            item.product_list.map(async (item) => {
              const product = await Product.findById(item._id)

              return {
                ...item,
                name: product.name,
                image: product.images[0],
                price: product.price.regular_price,
                sub_total: item.quantity * product.price.regular_price,
              }
            })
          )
          console.log(productList)
          // Get total amount
          const total_amount = productList.reduce(
            (prev, curr) => prev + curr.sub_total,
            0
          )

          return {
            ...item,
            name: address.name,
            address: address
              ? `${address.street}, ${address.ward.ward_name}, ${address.district.district_name}, ${address.province.province_name}`
              : "",
            product_list: productList,
            total_amount,
          }
        })
      )

      return res.json({
        data: newOrders,
        page,
        limit,
        totalPage: Math.ceil(count / limit),
      })
    } catch (error) {
      return res.status(400).send(error)
    }
  }

  async getStatistical(req, res) {
    try {
    } catch (error) {
      return res.status(400).send(error)
    }
  }

  async getOrdersByUser(req, res) {
    const _user_id = req.body?.params?.data?.user_id
    const user_id = _user_id ? _user_id : req.locals.user_id
    try {
      const orders = await Order.find({ user_id }).lean()
      if (!orders || orders.length === 0) {
        return res.json({ data: [] })
      }

      const newOrders = await Promise.all(
        orders.map(async (item) => {
          const address = await UserAddress.findById(item.user_address_id)

          // Get name, price, sub total of each product
          const productList = await Promise.all(
            item.product_list.map(async (item) => {
              const product = await Product.findById(item._id)

              return {
                ...item,
                name: product.name,
                image: product.images[0],
                price: product.price.regular_price,
                sub_total: item.quantity * product.price.regular_price,
              }
            })
          )

          // Get total amount
          const total_amount = productList.reduce(
            (prev, curr) => prev + curr.sub_total,
            0
          )

          return {
            ...item,
            name: address.name,
            address: address
              ? `${address.street}, ${address.ward.ward_name}, ${address.district.district_name}, ${address.province.province_name}`
              : "",
            product_list: productList,
            total_amount,
          }
        })
      )

      return res.json({ data: newOrders })
    } catch (error) {
      return res.status(400).send(error)
    }
  }

  async getOrderDetail(req, res) {
    const { _id } = req.body.params.data
    try {
      const order = await Order.findById(_id).lean()

      const product_list = await Promise.all(
        order.product_list.map(async (item) => {
          const product = await Product.findById(item._id).lean()
          return {
            ...item,
            name: product.name,
            image: product.images[0],
            price: product.price.regular_price,
            sub_total: item.quantity * product.price.regular_price,
          }
        })
      )
      // Get address of order
      const address = await UserAddress.findById(order.user_address_id).lean()

      const total_amount = product_list.reduce(
        (prev, curr) => prev + curr.sub_total,
        0
      )

      return res.json({
        data: {
          ...order,
          product_list,
          address: `${address.street}, ${address.ward.ward_name}, ${address.district.district_name}, ${address.province.province_name}`,
          total_amount,
        },
      })
    } catch (error) {
      return res.status(400).send(error)
    }
  }

  async updateOrder(req, res) {
    const { _id, ...order } = req.body.params.data
    try {
      await Order.findByIdAndUpdate(_id, order, { new: true })
      return res.json({ message: "Chỉnh sửa đơn hàng thành công", data: order })
    } catch (error) {
      return res.status(400).send(error)
    }
  }

  async deleteOrder(req, res) {
    const { _id } = req.body.params.data
    try {
      await Order.findByIdAndDelete(_id)
      return res.json({ message: "Xóa đơn đặt hàng thành công", data: { _id } })
    } catch (error) {
      return res.status(400).send(error)
    }
  }

  async AddOrder(req, res) {
    const { data: order } = req.body.params
    const _user_id = req.body?.params?.data?.user_id
    const user_id = _user_id ? _user_id : req.locals.user_id

    try {
      if (!order || Object.keys(order).length === 0) {
        return res
          .status(400)
          .send({ message: "Đơn hàng không hợp lệ, vui lòng thử lại" })
      }

      const user = await User.findById(user_id).lean()
      if (!user) {
        return res.status(400).send({ message: "Người dùng không hợp lệ!" })
      }

      const address = await UserAddress.findById(order.user_address_id).lean()
      if (!address) {
        return res.status(400).send({ message: "Địa chỉ không hợp lệ!" })
      }

      if (order.product_list.length === 0) {
        return res
          .status(400)
          .send({ message: "Sản phẩm không được để trống!" })
      }

      let isValid = true

      const productList = await Promise.all(
        order.product_list.map(async (product) => {
          if (product.quantity < 1) {
            isValid = false
            return res.status(400).send({
              message: "Số lượng của sản phẩm phải lớn hơn hoặc bằng 1!",
            })
          }

          const productFetch = await Product.findById(product._id)

          if (productFetch.stock === 0) {
            isValid = false
            return res.status(400).send({ message: "Sản phẩm đã hết hàng" })
          }

          if (productFetch.stock < product.quantity) {
            isValid = false
            return res.status(400).send({
              message: `Số lượng của sản phẩm ${productFetch.name} vượt quá số lượng tồn kho!`,
            })
          }

          return productFetch
        })
      )

      if (!isValid) return

      // Delete cart item
      await Cart.deleteMany({
        $and: [{ user_id }, { product_id: { $in: order.product_list } }],
      })

      await Promise.all(
        order.product_list.map(async (product) => {
          await Product.findByIdAndUpdate(product._id, {
            $inc: { stock: -product.quantity },
          })
        })
      )

      const amount_total = productList.reduce(
        (prev, curr) => curr.price.regular_price + prev,
        0
      )

      const orderSaved = new Order({ ...order, user_id })
      await orderSaved.save()
      return res.json({
        message: "Tạo đơn hàng thành công",
        data: {
          _id: orderSaved._id,
          user_id,
          name: address.name,
          address: address.full_address,
          amount_total,
          status: orderSaved.status,
          product_list: productList,
        },
      })
    } catch (error) {
      return res
        .status(400)
        .send({ message: "Đơn hàng vừa tạo có lỗi, xin vui lòng thử lại!" })
    }
  }
}
module.exports = new OrderController()
