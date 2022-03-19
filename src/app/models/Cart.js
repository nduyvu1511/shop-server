const mongoose = require("mongoose")

const Cart = new mongoose.Schema(
  {
    product_id: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    quantity: { type: Number, default: 1, min: 1, required: true },
    user_id: { type: String, required: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Cart", Cart)
