const express = require("express")
const cookieParser = require("cookie-parser")
const morgan = require("morgan")
const route = require("./routes/index")
const cors = require("cors")
const path = require("path")

require("dotEnv").config()

const db = require("./config")

const PORT = process.env.PORT || 5000

const app = express()

app.use(express.static(path.join(__dirname, "public")))
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

db.connect()

app.use(morgan("combined"))

const corsConfig = {
  origin: true,
  Credential: true,
}

app.use(cors(corsConfig))

route(app)

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`)
})
