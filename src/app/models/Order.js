const mongoose = require("mongoose")

const Order = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    user_address_id: { type: String, required: true },
    product_list: [
      {
        _id: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    status: {
      type: String,
      enum: ["Receive", "Confirm", "Delivery", "Complete"],
      default: "Receive",
    },
    note: { type: String },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Order", Order)
