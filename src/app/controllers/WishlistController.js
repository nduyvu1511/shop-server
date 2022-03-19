const Product = require("../models/Product")
const Wishlist = require("../models/Wishlist")

class WishlistController {
  async addToWishlist(req, res) {
    const { user_id } = req.locals
    const { data } = req.body.params

    try {
      const product = await Product.findById(data._id).lean()
      if (!product) {
        return res.status(400).send({ message: "Sản phẩm không hợp lệ!" })
      }

      const wishlist = await Wishlist.findOne({ user_id }).lean()
      if (wishlist) {
        if (wishlist.product_list.includes(data._id)) {
          return res
            .status(400)
            .send({ message: "Sản phẩm đã tồn tại trong danh sách yêu thích!" })
        }

        await Wishlist.findOneAndUpdate(
          { user_id },
          {
            $addToSet: { product_list: data._id },
          }
        )
      } else {
        const newWishlist = new Wishlist({
          user_id,
          product_list: [data._id],
        })
        await newWishlist.save()
      }

      return res.json({
        message: "Đã thêm vào danh sách yêu thích",
        data: product,
      })
    } catch (error) {
      return res.status(400).send(error)
    }
  }

  async getAllWishlists(req, res) {
    const { limit, page } = req.query
    const skip = (+page - 1) * +limit

    try {
      const wishlists = await Wishlist.find()
        .limit(+limit)
        .skip(+skip)
        .lean()

      const count = await Wishlist.countDocuments()

      return res.json({
        data: wishlists,
        count,
        page: +page,
        limit: +limit,
        totalPage: Math.ceil(count / limit),
      })
    } catch (error) {
      return res.status(400).send(error)
    }
  }

  async getWishlistsByUserId(req, res) {
    const { user_id } = req.locals
    try {
      const wishlistObj = await Wishlist.findOne({ user_id })

      if (!wishlistObj || wishlistObj.product_list.length === 0) {
        return res.json({ data: [] })
      }

      const products = await Product.find({
        _id: {
          $in: wishlistObj.product_list,
        },
      })

      return res.json({ data: products })
    } catch (error) {
      return res.status(400).send(error)
    }
  }

  async deleteWishlist(req, res) {
    const { user_id } = req.locals
    const { _id, product_id } = req.body.params.data

    try {
      if (_id) {
        await Wishlist.findByIdAndUpdate(
          _id,
          { $pull: { product_list: product_id } },
          { new: true }
        )
      } else if (product_id) {
        await Wishlist.findOneAndUpdate(
          { user_id },
          { $pull: { product_list: product_id } },
          { new: true }
        )
      }

      return res.json({
        message: "Đã xóa khỏi danh sách yêu thích!",
        data: { product_id },
      })
    } catch (error) {
      return res.status(400).send(error)
    }
  }
}
module.exports = new WishlistController()
