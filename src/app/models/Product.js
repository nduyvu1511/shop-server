const mongoose = require("mongoose")

const Product = new mongoose.Schema(
  {
    name: { type: String, required: true },
    desc: { type: String, required: true },
    sku: { type: String, required: true },
    category_id: { type: String, required: true },
    price: {
      regular_price: { type: Number, required: true, min: 0 },
      wholesale_price: { type: Number, required: true, min: 0 },
    },
    stock: { type: Number, required: true, min: 0 },
    images: [{ type: String, required: true }],
    active: { type: Boolean, required: true },
    rating_count: { type: Number, min: 0, max: 5, default: 0, required: false },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Product", Product)
