const models = require("../database/models")
const { parseInputs } = require("../util/index").parseInputs

const ordersInclusion = {
  model: models.Orders,
  as: "order",
}

const waresInclusion = {
  model: models.Wares,
  as: "wareBought",
}

exports.findOrdersWareQuery = {
  include: [ordersInclusion, waresInclusion],
}

exports.parseOrdersWareInputs = (
  req,
  otherOptions = {
    include: [ordersInclusion, waresInclusion],
  },
  modelName = "OrdersWares"
) => {
  return parseInputs(req, otherOptions, modelName)
}
