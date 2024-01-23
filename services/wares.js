const models = require("../database/models")
const { parseInputs } = require("../util/index").parseInputs

const ordersWaresInclusion = { model: models.OrdersWares, as: "bought" }

const waresTicketsInclusion = { model: models.WaresTickets, as: "sold" }

exports.findWareQuery = {
  include: [ordersWaresInclusion, waresTicketsInclusion],
}

exports.parseWareInputs = (
  req,
  otherOptions = {
    include: [ordersWaresInclusion, waresTicketsInclusion],
    order: [["id", "DESC"]],
  },
  modelName = "Wares"
) => {
  return parseInputs(req, otherOptions, modelName)
}
