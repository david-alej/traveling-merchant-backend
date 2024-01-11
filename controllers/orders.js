const { validationPerusal, integerValidator } =
  require("../util/index").validators
const models = require("../database/models")
const { Api400Error, Api404Error, Api500Error } =
  require("../util/index").apiErrors
const { findOrderQuery, parseOrderInputs } =
  require("../services/index").ordersServices

exports.paramOrderId = async (req, res, next, orderId) => {
  const merchant = req.session.merchant

  try {
    await integerValidator("orderId", true).run(req)

    validationPerusal(req)

    const searched = await models.Orders.findOne({
      where: { id: orderId },
      ...findOrderQuery,
    })

    if (!searched) {
      throw new Api404Error(
        merchant.preMsg + ` target order ${orderId} not found.`,
        "Order not found."
      )
    }

    req.targetOrder = searched.dataValues

    next()
  } catch (err) {
    next(err)
  }
}

exports.getOrder = async (req, res) => res.json(req.targetOrder)

exports.getOrders = async (req, res, next) => {
  const merchant = req.session.merchant

  try {
    const { afterMsg, query } = await parseOrderInputs(req)

    const searched = await models.Orders.findAll(query)

    if (!searched) {
      throw new Api404Error(
        merchant.preMsg + " orders were not found" + afterMsg,
        "Orders not found."
      )
    }

    res.json(searched)
  } catch (err) {
    next(err)
  }
}

exports.postOrder = async (req, res, next) => {
  const merchant = req.session.merchant

  try {
    const { inputsObject: newOrder } = await parseOrderInputs(req, true)

    const created = await models.Orders.create(newOrder)

    if (!created) {
      throw new Api500Error(
        merchant.preMsg + " create order query did not work.",
        "Internal server query error."
      )
    }

    res.status(201).send(merchant.preMsg + " order has been created.")
  } catch (err) {
    next(err)
  }
}

exports.putOrder = async (req, res, next) => {
  const merchant = req.session.merchant
  const targetOrder = req.targetOrder

  try {
    const { afterMsg, inputsObject: newValues } = await parseOrderInputs(
      req,
      true
    )

    if (JSON.stringify(newValues) === "{}") {
      throw new Api400Error(
        merchant.preMsg + " did not update any value.",
        "Bad input request."
      )
    }

    const updated = await models.Orders.update(newValues, {
      where: { id: targetOrder.id },
    })

    if (!updated) {
      throw new Api500Error(
        merchant.preMsg + " update order query did not work" + afterMsg,
        "Internal server query error."
      )
    }

    res.send(
      merchant.preMsg +
        ` order with id = ${targetOrder.id} was updated` +
        afterMsg
    )
  } catch (err) {
    next(err)
  }
}

exports.deleteOrder = async (req, res, next) => {
  const merchant = req.session.merchant
  const targetOrder = req.targetOrder

  try {
    const deleted = await models.Orders.destroy({
      where: { id: targetOrder.id },
    })

    if (!deleted) {
      throw new Api500Error(
        merchant.preMsg + " delete order query did not work.",
        "Internal server query error."
      )
    }

    res.send(
      merchant.preMsg +
        ` has deleted a order with id = ${targetOrder.id} and fullname = ${targetOrder.fullname}.`
    )
  } catch (err) {
    next(err)
  }
}
