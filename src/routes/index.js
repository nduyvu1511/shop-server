const wishlistRouter = require("./wishlist")
const authRouter = require("./auth")
const userRouter = require("./user")
const productRouter = require("./product")
const categoryRouter = require("./category")
const reviewRouter = require("./review")
const cartRouter = require("./cart")
const uploadRouter = require("./upload")
const orderRouter = require("./order")
const addressRouter = require("./address")
const userAddressRouter = require("./userAddress")

const route = (app) => {
  app.use("/auth", authRouter)
  app.use("/user", userRouter)
  app.use("/cart", cartRouter)
  app.use("/wishlist", wishlistRouter)
  app.use("/product", productRouter)
  app.use("/category", categoryRouter)
  app.use("/review", reviewRouter)
  app.use("/upload", uploadRouter)
  app.use("/order", orderRouter)
  app.use("/address", addressRouter)
  app.use("/user_address", userAddressRouter)
}

module.exports = route
