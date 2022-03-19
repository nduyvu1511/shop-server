const Category = require("../models/Category")
const Product = require("../models/Product")

class CategoryController {
  async list(req, res) {
    try {
      const categories = await Category.find().lean()
      return res.json({ data: categories })
    } catch (error) {
      return res.status(400).send(error)
    }
  }

  async deleteCategory(req, res) {
    const { _id } = req.body.params.data

    try {
      const productList = await Product.find({ category_id: _id }).lean()
      if (productList.length > 0) {
        return res.status(400).send({
          message: "Danh mục này đang chứa sản phẩm, không thể xóa!",
        })
      }

      await Category.findByIdAndDelete(_id)
      return res.json({ message: "Xóa danh mục thành công!", data: { _id } })
    } catch (error) {
      return res.status(400).send(error)
    }
  }

  async editCategory(req, res) {
    const { _id, ...category } = req.body.params.data
    try {
      await Category.findByIdAndUpdate(_id, category)
      return res.json({
        message: "Chỉnh sửa danh mục thành công",
        data: req.body.params.data,
      })
    } catch (error) {
      return res.status(400).send(error)
    }
  }

  async addCategory(req, res) {
    const category = new Category(req.body.params.data)
    try {
      await category.save()
      return res.json({
        message: "Thêm danh mục sản phẩm thành công",
        data: category,
      })
    } catch (error) {
      return res.status(400).send(error)
    }
  }
}
module.exports = new CategoryController()
