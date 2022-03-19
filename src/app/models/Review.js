const mongoose = require("mongoose")

const Review = new mongoose.Schema(
  {
    product_id: { type: String, required: true },
    user_id: { type: String, required: true },
    rating_count: { type: Number, required: true, min: 1, max: 5 },
    content: { type: String, min: 5, required: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Review", Review)
