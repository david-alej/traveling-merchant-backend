const models = require("../database/models")
const { parseInputs } = require("../util/index").parseInputs

const ordersInclusion = {
  model: models.Orders,
  as: "orders",
  order: [["id", "DESC"]],
}

exports.findProviderQuery = {
  include: [ordersInclusion],
}

exports.parseProviderInputs = (
  inputsObject,
  otherOptions = {
    include: [{ ...ordersInclusion, limit: 5 }],
    order: [["id", "DESC"]],
  },
  modelName = "Providers"
) => {
  return parseInputs(inputsObject, otherOptions, modelName)
}
