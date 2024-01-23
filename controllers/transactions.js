const { validationPerusal, integerValidator } =
  require("../util/index").validators
const models = require("../database/models")
const { Api400Error, Api404Error, Api500Error } =
  require("../util/index").apiErrors
const { findTransactionQuery, parseTransactionInputs } =
  require("../services/index").transactionsServices

exports.paramTransactionId = async (req, res, next, transactionId) => {
  const merchant = req.session.merchant

  try {
    await integerValidator("transactionId", true).run(req)

    validationPerusal(req)

    const searched = await models.Transactions.findOne({
      where: { id: transactionId },
      ...findTransactionQuery,
    })

    if (!searched) {
      throw new Api404Error(
        merchant.preMsg + ` target transaction ${transactionId} not found.`,
        "Transaction not found."
      )
    }

    req.targetTransaction = searched.dataValues

    next()
  } catch (err) {
    next(err)
  }
}

exports.getTransaction = async (req, res) => res.json(req.targetTransaction)

exports.getTransactions = async (req, res, next) => {
  const merchant = req.session.merchant

  try {
    const { afterMsg, query } = await parseTransactionInputs(req)

    const searched = await models.Transactions.findAll(query)

    if (!searched) {
      throw new Api404Error(
        merchant.preMsg + " transactions were not found" + afterMsg,
        "Transactions not found."
      )
    }

    res.json(searched)
  } catch (err) {
    next(err)
  }
}

exports.postTransaction = async (req, res, next) => {
  const merchant = req.session.merchant

  try {
    const { afterMsg, inputsObject: newTransaction } = await parseTransactionInputs(
      req,
      true
    )

    const created = await models.Transactions.create(newTransaction)

    if (!created) {
      throw new Api500Error(
        merchant.preMsg + " create transaction query did not work" + afterMsg,
        "Internal server query error."
      )
    }

    res.status(201).send(merchant.preMsg + " transaction has been created.")
  } catch (err) {
    next(err)
  }
}

exports.putTransaction = async (req, res, next) => {
  const merchant = req.session.merchant
  const targetTransaction = req.targetTransaction

  try {
    const { afterMsg, inputsObject: newValues } = await parseTransactionInputs(
      req,
      true
    )

    if (JSON.stringify(newValues) === "{}") {
      throw new Api400Error(
        merchant.preMsg + " did not update any value.",
        "Bad input request."
      )
    }

    const updated = await models.Transactions.update(newValues, {
      where: { id: targetTransaction.id },
    })

    if (!updated) {
      throw new Api500Error(
        merchant.preMsg + " update transaction query did not work" + afterMsg,
        "Internal server query error."
      )
    }

    res.send(
      merchant.preMsg +
        ` transaction with id = ${targetTransaction.id} was updated` +
        afterMsg
    )
  } catch (err) {
    next(err)
  }
}

exports.deleteTransaction = async (req, res, next) => {
  const merchant = req.session.merchant
  const targetTransaction = req.targetTransaction

  try {
    const deleted = await models.Transactions.destroy({
      where: { id: targetTransaction.id },
    })

    if (!deleted) {
      throw new Api500Error(
        merchant.preMsg +
          ` delete transaction query did not work with transaction id = ${targetTransaction.id}`,
        "Internal server query error."
      )
    }

    res.send(
      merchant.preMsg +
        ` has deleted a transaction with id = ${targetTransaction.id} and fullname = ${targetTransaction.fullname}.`
    )
  } catch (err) {
    next(err)
  }
}
