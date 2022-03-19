const Product = require("../models/Product")
const Review = require("../models/Review")
const User = require("../models/User")

class ReviewController {
  async getReviewsByProductId(req, res) {
    const { _id } = req.body.params.data

    try {
      const reviews = await Review.find({ product_id: _id }).lean()

      const newReviews = await Promise.all(
        reviews.map(async (item) => {
          const user = await User.findById(item.user_id)
          return { ...item, user_name: user.user_name, avatar: "" }
        })
      )

      return res.json({ data: newReviews })
    } catch (error) {
      return res.status(400).send(error)
    }
  }

  async getReviewsByUserId(req, res) {
    const _user_id = req.body?.params?.data?.user_id
    const user_id = _user_id ? _user_id : req.locals.user_id
    try {
      const reviews = await Review.find({ user_id }).lean()
      return res.json({ data: reviews })
    } catch (error) {
      return res.status(400).send(error)
    }
  }

  async getAllReviews(req, res) {
    const { limit = 12, page = 1 } = req.query
    const skip = (+page - 1) * +limit

    try {
      const reviews = await Review.find()
        .limit(+limit)
        .skip(+skip)
        .lean()

      const count = await Review.countDocuments()

      return res.json({ data: reviews, count, page: +page, limit: +limit })
    } catch (error) {
      return res.status(400).send(error)
    }
  }

  async editReview(req, res) {
    const _user_id = req.body?.params?.data?.user_id
    const user_id = _user_id ? _user_id : req.locals.user_id
    const { _id, ...review } = req.body.params.data

    try {
      const prevReview = await Review.findById(_id)

      if (!prevReview) {
        return res.status(400).send({ message: "Đánh giá không tồn tại" })
      }

      const count = await Review.countDocuments({
        product_id: review.product_id,
      })
      const product = await Product.findById(review.product_id)
      const newRatingCount =
        (count * product.rating_count -
          prevReview.rating_count +
          review.rating_count) /
        count

      await Product.findByIdAndUpdate(product._id, {
        $set: { rating_count: newRatingCount },
      })

      await Review.findByIdAndUpdate(_id, { $set: review }, { new: true })
      const user = await User.findById(user_id)

      return res.json({
        message: "Chỉnh sửa đánh giá thành công!",
        data: {
          ...req.body.params.data,
          user_name: user.user_name,
          avatar: "",
        },
      })
    } catch (error) {
      return res.status(400).send(error)
    }
  }

  async addReview(req, res) {
    const _user_id = req.body?.params?.data?.user_id
    const user_id = _user_id ? _user_id : req.locals.user_id
    const { data } = req.body.params

    try {
      const count = await Review.countDocuments({ product_id: data.product_id })
      const product = await Product.findById(data.product_id)

      const newRatingCount =
        (count * product.rating_count + data.rating_count) / (count + 1)

      await Product.findByIdAndUpdate(data.product_id, {
        $set: { rating_count: newRatingCount },
      })

      const user = await User.findById(user_id).lean()

      const review = new Review({ ...data, user_id })
      await review.save()

      return res.json({
        message: "Thêm đánh giá thành công!",
        data: {
          ...review._doc,
          user_name: user.user_name,
          avatar: "",
        },
      })
    } catch (error) {
      return res.status(400).send(error)
    }
  }

  async deleteReview(req, res) {
    const { _id } = req.body.params.data
    try {
      const review = await Review.findById(_id)
      const count = await Review.countDocuments({
        product_id: review.product_id,
      })
      const product = await Product.findById(review.product_id)

      const newRatingCount =
        count === 1
          ? 0
          : (product.rating_count * count - review.rating_count) / (count - 1)

      await Product.findByIdAndUpdate(product._id, {
        $set: { rating_count: newRatingCount },
      })
      await Review.findByIdAndDelete(_id)
      return res.json({ message: "Xóa đánh giá thành công!", data: { _id } })
    } catch (error) {
      return res.status(400).send(error)
    }
  }
}
module.exports = new ReviewController()
