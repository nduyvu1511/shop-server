const jwt = require("jsonwebtoken")

const verifyToken = async (req, res, next) => {
  const { token } = req.body.params
  if (!token) {
    return res.status(403).send({ message: "No token provided!" })
  }

  try {
    const authUser = jwt.verify(token, process.env.JWT_SECRET)
    req.locals = authUser
    return next()
  } catch (error) {
    return res.status(401).send({
      message: "Unauthorized Token!",
    })
  }
}

const verifyTokenAndAdmin = async (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.locals.is_admin) {
      return next()
    } else {
      return res.status(403).send({ message: "You are not Administrator" })
    }
  })
}

module.exports = { verifyToken, verifyTokenAndAdmin }
