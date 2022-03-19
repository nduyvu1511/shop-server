const mongoose = require("mongoose")

const validatePhoneNumber = (val) => {
  return /(84|0[3|5|7|8|9])+([0-9]{8})\b/g.test(val)
}

const UserAddress = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    name: { type: String, required: true },
    phone_number: {
      type: String,
      required: true,
      validate: [validatePhoneNumber, "Please enter a valid phone number!"],
    },
    ward: {
      ward_id: { type: String, required: true },
      ward_name: { type: String, required: true },
    },
    district: {
      district_id: { type: String, required: true },
      district_name: { type: String, required: true },
    },
    province: {
      province_id: { type: String, required: true },
      province_name: { type: String, required: true },
    },
    street: { type: String, required: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model("User_Address", UserAddress)
