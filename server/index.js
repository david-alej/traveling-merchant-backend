const express = require("express")
const session = require("express-session")
const helmet = require("helmet")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const swaggerUi = require("swagger-ui-express")

const routes = require("../routes/index")
const { httpLogger } = require("../util/index")
const openApiDocumentation = require("../api-documentation/openapi.json")

require("dotenv").config()
const app = express()

app.use(httpLogger)

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use(express.static("public"))

app.use(
  session({
    secret: process.env.COOKIES_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 30,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    },
  })
)

app.use(cookieParser(process.env.COOKIES_SECRET))

app.use(helmet())

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
    allowedHeaders: ["x-csrf-token", "content-type"],
  })
)

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocumentation))

app.use("/", routes)

module.exports = app
