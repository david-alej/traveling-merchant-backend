const { validationPerusal, integerValidator } =
  require("../util/index").validators
const models = require("../database/models")
const { Api400Error, Api404Error, Api500Error } =
  require("../util/index").apiErrors
const { findOrdersWareQuery, parseOrdersWareInputs } =
  require("../services/index").orderswaresServices

exports.paramOrdersWareId = async (req, res, next, orderswareId) => {
  const merchant = req.session.merchant

  try {
    await integerValidator("orderswareId", true).run(req)

    validationPerusal(req)

    const searched = await models.OrdersWares.findOne({
      where: { id: orderswareId },
      ...findOrdersWareQuery,
    })

    if (!searched) {
      throw new Api404Error(
        merchant.preMsg + ` target ordersware ${orderswareId} not found.`,
        "OrdersWare not found."
      )
    }

    req.targetOrdersWare = searched.dataValues

    next()
  } catch (err) {
    next(err)
  }
}

exports.getOrdersWare = async (req, res) => res.json(req.targetOrdersWare)

exports.getOrdersWares = async (req, res, next) => {
  const merchant = req.session.merchant

  try {
    const { afterMsg, query } = await parseOrdersWareInputs(req)

    const searched = await models.OrdersWares.findAll(query)

    if (!searched) {
      throw new Api404Error(
        merchant.preMsg + " orderswares were not found" + afterMsg,
        "OrdersWares not found."
      )
    }

    res.json(searched)
  } catch (err) {
    next(err)
  }
}

exports.postOrdersWare = async (req, res, next) => {
  const merchant = req.session.merchant

  try {
    const { inputsObject: newOrdersWare } = await parseOrdersWareInputs(req, true)

    const created = await models.OrdersWares.create(newOrdersWare)

    if (!created) {
      throw new Api500Error(
        merchant.preMsg + " create ordersware query did not work.",
        "Internal server query error."
      )
    }

    res.status(201).send(merchant.preMsg + " ordersware has been created.")
  } catch (err) {
    next(err)
  }
}

exports.putOrdersWare = async (req, res, next) => {
  const merchant = req.session.merchant
  const targetOrdersWare = req.targetOrdersWare

  try {
    const { afterMsg, inputsObject: newValues } = await parseOrdersWareInputs(
      req,
      true
    )

    if (JSON.stringify(newValues) === "{}") {
      throw new Api400Error(
        merchant.preMsg + " did not update any value.",
        "Bad input request."
      )
    }

    const updated = await models.OrdersWares.update(newValues, {
      where: { id: targetOrdersWare.id },
    })

    if (!updated) {
      throw new Api500Error(
        merchant.preMsg + " update ordersware query did not work" + afterMsg,
        "Internal server query error."
      )
    }

    res.send(
      merchant.preMsg +
        ` ordersware with id = ${targetOrdersWare.id} was updated` +
        afterMsg
    )
  } catch (err) {
    next(err)
  }
}

exports.deleteOrdersWare = async (req, res, next) => {
  const merchant = req.session.merchant
  const targetOrdersWare = req.targetOrdersWare

  try {
    const deleted = await models.OrdersWares.destroy({
      where: { id: targetOrdersWare.id },
    })

    if (!deleted) {
      throw new Api500Error(
        merchant.preMsg + " delete ordersware query did not work.",
        "Internal server query error."
      )
    }

    res.send(
      merchant.preMsg +
        ` has deleted a ordersware with id = ${targetOrdersWare.id} and fullname = ${targetOrdersWare.fullname}.`
    )
  } catch (err) {
    next(err)
  }
}
