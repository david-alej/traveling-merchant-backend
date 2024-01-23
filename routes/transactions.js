const transactionsRouter = require("express").Router()
const { transactionsControllers } = require("../controllers/index")
const { integerValidator, floatValidator, textValidator, dateValidator } =
  require("../util/index").validators

transactionsRouter.param(
  "transactionId",
  transactionsControllers.paramTransactionId
)

transactionsRouter.get(
  "/:transactionId",
  transactionsControllers.getTransaction
)

transactionsRouter.get(
  "/",
  [
    integerValidator("ticketId", false, true),
    floatValidator("payment", false, true),
    textValidator("paymentType", false, true),
    dateValidator("date", false, true),
    dateValidator("createdAt", false, true),
    dateValidator("updatedAt", false, true),
  ],
  transactionsControllers.getTransactions
)

transactionsRouter.post(
  "/",
  [
    integerValidator("ticketId"),
    floatValidator("payment"),
    textValidator("paymentType"),
    dateValidator("date"),
  ],
  transactionsControllers.postTransaction
)

transactionsRouter.put(
  "/:transactionId",
  [
    integerValidator("ticketId", false, true),
    floatValidator("payment", false, true),
    textValidator("paymentType", false, true),
    dateValidator("date", false, true),
  ],
  transactionsControllers.putTransaction
)

transactionsRouter.delete(
  "/:transactionId",
  transactionsControllers.deleteTransaction
)

module.exports = transactionsRouter
