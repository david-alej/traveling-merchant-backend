/* eslint no-process-exit: 0 */

//const middleware = require("./middleware")
// const nonProtectedRouter = require("")
// const protectedRouter = require("")

// const { authorizedUser } = require("../controllers/index").authorize
// const { logError, logErrorMiddleware, returnError, isOperationalError } =
//   require("../controllers/index").errorHandlers
// const { doubleCsrfProtection } = require("../util/index").doubleCsrf
const router = require("express").Router()

router.get("/", (req, res) => {
  res.send("Welcome and rest fellow traveler!!")
})

// router.use("/nonProtectedRoute", nonProtectedRouter)

// router.use(authorizedUser)
// router.use(doubleCsrfProtection)

// router.use("/protectedRoute", protectedRouter)

// router.use(logErrorMiddleware, returnError)

// process.on("unhandledRejection", (err) => {
//   throw err
// })

// process.on("uncaughtException", (err) => {
//   logError(err)

//   if (!isOperationalError(err)) {
//     process.exit(1)
//   }
// })

module.exports = router
