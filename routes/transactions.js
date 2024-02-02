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
    integerValidator("orderId", false, true),
    floatValidator("payment", false, true, false, true),
    textValidator("paymentType", false, true),
    dateValidator("paidAt", false, true),
    dateValidator("createdAt", false, true),
    dateValidator("updatedAt", false, true),
  ],
  transactionsControllers.getTransactions
)

transactionsRouter.post(
  "/",
  [
    integerValidator("ticketId", false, true),
    integerValidator("orderId", false, true),
    floatValidator("payment", false, false, false, true),
    textValidator("paymentType"),
    dateValidator("paidAt"),
  ],
  transactionsControllers.foreignKeyValidation,
  transactionsControllers.postTransaction
)

transactionsRouter.put(
  "/:transactionId",
  [
    integerValidator("ticketId", false, true),
    integerValidator("orderId", false, true),
    floatValidator("payment", false, true, false, true),
    textValidator("paymentType", false, true),
    dateValidator("paidAt", false, true),
  ],
  transactionsControllers.foreignKeyValidation,
  transactionsControllers.putTransaction
)

transactionsRouter.delete(
  "/:transactionId",
  transactionsControllers.deleteTransaction
)

module.exports = transactionsRouter
