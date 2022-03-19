const mongoose = require("mongoose")

const connect = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log(`connected to database ${`mongodb://localhost:27017/food`}`)
  } catch (error) {
    console.log("failed to connect")
  }
}

module.exports = { connect }
