/* eslint no-process-exit: 0 */

const loginRouter = require("./login")
const logoutRouter = require("./logout")
const merchantRouter = require("./merchant")
const clientsRouter = require("./clients")

const { authorizedUser } = require("../controllers/index").authorize
const { logError, logErrorMiddleware, returnError, isOperationalError } =
  require("../controllers/index").errorHandlers
const { doubleCsrfProtection } = require("../util/index").doubleCsrf
const router = require("express").Router()

router.get("/", (req, res) => {
  res.send("Welcome and rest fellow traveler!!")
})

router.use("/login", loginRouter)

router.use(authorizedUser)
router.use(doubleCsrfProtection)

router.use("/merchant", merchantRouter)
router.use("/clients", clientsRouter)
router.use("/logout", logoutRouter)

router.use(logErrorMiddleware, returnError)

process.on("unhandledRejection", (err) => {
  throw err
})

process.on("uncaughtException", (err) => {
  logError(err)

  if (!isOperationalError(err)) {
    process.exit(1)
  }
})

module.exports = router
