const models = require("../database/models")
const { parseInputs } = require("../util/index").parseInputs

exports.findOrdersWareQuery = {
  include: [],
}

exports.parseOrdersWareInputs = (
  inputsObject,
  otherOptions = {
    include: [],
  },
  modelName = "OrdersWares"
) => {
  return parseInputs(inputsObject, otherOptions, modelName)
}
