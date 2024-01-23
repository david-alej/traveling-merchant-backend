const transactionsRouter = require("express").Router()
const { transactionsControllers } = require("../controllers/index")
const { dateValidator } = require("../util/index").validators

transactionsRouter.param("transactionId", transactionsControllers.paramTransactionId)

transactionsRouter.get("/:transactionId", transactionsControllers.getTransaction)

transactionsRouter.get(
  "/",
  [
    dateValidator("createdAt", false, true),
    dateValidator("updatedAt", false, true),
  ],
  transactionsControllers.getTransactions
)

transactionsRouter.post("/", [], transactionsControllers.postTransaction)

transactionsRouter.put("/:transactionId", [], transactionsControllers.putTransaction)

transactionsRouter.delete("/:transactionId", transactionsControllers.deleteTransaction)

module.exports = transactionsRouter
