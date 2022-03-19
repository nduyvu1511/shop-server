const mongoose = require("mongoose")

const Wishlist = new mongoose.Schema(
  {
    user_id: { type: String, required: true, unique: true },
    product_list: [{ type: String, required: true, unique: true }],
  },
  { timestamps: true }
)

module.exports = mongoose.model("Wishlist", Wishlist)
