const mongoose = require("mongoose")

const District = new mongoose.Schema({
  district_id: { type: String, required: true, unique: true },
  province_id: { type: String, required: true },
  district_name: { type: String, required: true },
})

module.exports = mongoose.model("District", District)
