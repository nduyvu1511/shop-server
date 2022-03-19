const mongoose = require("mongoose")

const Province = new mongoose.Schema({
  province_id: { type: String, required: true, unique: true },
  province_name: { type: String, required: true },
})

module.exports = mongoose.model("Province", Province)
