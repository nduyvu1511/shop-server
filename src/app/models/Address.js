const mongoose = require("mongoose")

const Address = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true },
    parent_id: { type: Number, required: true },
  },
  { timestamps: true, _id: false }
)

module.exports = mongoose.model("Address", Address)
