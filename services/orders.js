const models = require("../database/models")
const { parseInputs } = require("../util/index").parseInputs

const providersInclusion = {
  model: models.Providers,
  as: "provider",
}

const ordersWaresInclusion = {
  model: models.OrdersWares,
  as: "waresBought",
}

exports.findOrderQuery = {
  include: [providersInclusion, ordersWaresInclusion],
}

exports.parseOrderInputs = (
  inputsObject,
  otherOptions = {
    include: [providersInclusion, ordersWaresInclusion],
    order: [["id", "DESC"]],
    limit: 10,
  },
  modelName = "Orders"
) => {
  return parseInputs(inputsObject, otherOptions, modelName)
}
