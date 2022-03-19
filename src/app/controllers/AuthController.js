const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

class UserController {
  async firebaseAuth(req, res) {
    const { email, user_name } = req.body.params.data
    try {
      const user = await User.findOne({ email }).lean()

      if (user) {
        const token = jwt.sign(
          { user_id: user._id, is_admin: false },
          process.env.JWT_SECRET
        )

        return res.json({
          message: "Đăng nhập thành công",
          data: { token },
        })
      }
      const pwHashed = await bcrypt.hash("password@$%^&(*&%", 10)
      const newUser = new User({ user_name, email, password: pwHashed })

      const saveUser = await newUser.save()
      const token = jwt.sign(
        { user_id: saveUser._id, is_admin: false },
        process.env.JWT_SECRET
      )

      return res.json({ data: { token }, message: "Đăng ký thành công" })
    } catch (error) {
      return res.status(400).send(error)
    }
  }

  async register(req, res) {
    const { password, email, user_name } = req.body.params.data

    try {
      const userNameExisting = await User.findOne({ user_name })
      if (userNameExisting) {
        return res
          .status(400)
          .send({ message: `User name ${user_name} đã tồn tại` })
      }

      const emailExisting = await User.findOne({ email })
      if (emailExisting) {
        return res.status(400).send({
          message: `Email ${email} đã tồn tại, vui lòng đăng nhập`,
        })
      }

      const pwHashed = await bcrypt.hash(password, 10)
      const newUser = new User({ ...req.body.params.data, password: pwHashed })
      const saveUser = await newUser.save()

      return res.json({ data: saveUser, message: "Đăng ký thành công!" })
    } catch (error) {
      return res.status(400).send(error)
    }
  }

  async loginMiddleWare(req, res, next) {
    const { email, password } = req.body.params.data

    try {
      const user = await User.findOne({ email })
      if (!user) return res.status(401).send({ message: "Email không hợp lệ!" })

      const pwHashed = await bcrypt.compare(password, user.password)
      if (!pwHashed)
        return res.status(401).send({ message: "Mật khẩu không hợp lệ" })

      const token = jwt.sign(
        { user_id: user._id, is_admin: user.is_admin },
        process.env.JWT_SECRET
      )

      req.locals = { is_admin: user.is_admin, token }
      next()
    } catch (error) {
      return res.status(400).send(error)
    }
  }

  async login(req, res) {
    const { token } = req.locals

    return res.json({
      message: "Đăng nhập thành công",
      data: { token },
    })
  }

  async adminLogin(req, res) {
    const { is_admin, token } = req.locals

    if (is_admin) {
      return res.json({
        message: "Đăng nhập thành công",
        data: { token },
      })
    } else {
      return res.status(400).send({ message: "Bạn không phải là admin" })
    }
  }
}
module.exports = new UserController()
