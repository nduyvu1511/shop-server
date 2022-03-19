const Product = require("../models/Product")

class ProductController {
  async getProducts(req, res) {
    const {
      available,
      price,
      page = 1,
      limit = 100,
      sort,
      order,
      search,
      category,
    } = req.query

    try {
      let qPrice = {}

      if (price) {
        const lowPrice = others.gte || 0
        const highPrice = others.lte || 10000
        qPrice = {
          "price.regular_price": {
            $gte: lowPrice,
            $lte: highPrice,
          },
        }
      }

      const qSearch = { name: { $regex: new RegExp(search, "i") } }

      let qAvailable = {}
      if (available) {
        qAvailable = +available ? { stock: { $gte: 1 } } : { stock: 0 }
      }

      const orderField =
        sort === "price"
          ? "price.regular_price"
          : sort === "new"
          ? "createdAt"
          : sort

      const qOrder = order === "desc" ? -1 : 1

      const qCategory = category ? { category_id: category } : {}
      const skip = (+page - 1) * +limit

      const products = await Product.find(
        {
          $and: [qAvailable, qSearch, qPrice, qCategory],
        },
        {},
        { limit: +limit, skip: +skip }
      )
        .sort({ [orderField]: qOrder })
        .lean()

      const count = await Product.countDocuments()

      return res.json({
        page: +page,
        limit: +limit,
        totalPage: Math.ceil(count / limit),
        data: products,
      })
    } catch (error) {
      return res.status(400).send(error)
    }
  }

  async getOneProduct(req, res) {
    const { id } = req.params
    try {
      const product = await Product.findById(id)
      return res.json({ data: product })
    } catch (error) {
      return res.status(400).send(error)
    }
  }

  async deleteProduct(req, res) {
    const { _id } = req.body.params.data
    try {
      await Product.findByIdAndDelete(_id)
      return res.json({ message: "Xóa sản phẩm thành công", data: { _id } })
    } catch (error) {
      return res.status(400).send(error)
    }
  }

  async editProduct(req, res) {
    const { _id, ...product } = req.body.params.data

    try {
      await Product.findByIdAndUpdate(_id, product, { new: true })
      return res.json({
        message: "Chỉnh sửa sản phẩm thành công",
        data: req.body.params.data,
      })
    } catch (error) {
      return res.status(400).send(error)
    }
  }

  async addProduct(req, res) {
    const product = new Product(req.body.params.data)
    try {
      await product.save()
      return res.json({ message: "Thêm sản phẩm thành công!", data: product })
    } catch (error) {
      return res.status(400).send(error)
    }
  }
}
module.exports = new ProductController()
