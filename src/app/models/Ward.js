const mongoose = require("mongoose")

const Ward = new mongoose.Schema({
  district_id: { type: String, required: true },
  ward_id: { type: String, required: true, unique: true },
  ward_name: { type: String, required: true },
})

module.exports = mongoose.model("Ward", Ward)
