const models = require("../database/models")
const { parseInputs } = require("../util/index").parseInputs

const ordersWaresInclusion = {
  model: models.OrdersWares,
  as: "bought",
}

const waresTicketsInclusion = { model: models.WaresTickets, as: "sold" }

const findWareQuery = {
  include: [ordersWaresInclusion, waresTicketsInclusion],
  attributes: {
    include: [
      [
        models.Sequelize.literal(
          // eslint-disable-next-line quotes
          '(SELECT "amount" - "returned" + COALESCE("sold"."returned"  - "sold"."amount", 0) FROM "OrdersWares" LEFT OUTER JOIN "Orders" ON "OrdersWares"."orderId" = "Orders"."id" WHERE "wareId" = "Wares"."id" AND "Orders"."actualAt" IS NOT NULL)'
        ),
        "stock",
      ],
    ],
  },
  order: [
    ["id", "DESC"],
    ["bought", "orderId", "DESC"],
    ["bought", "wareId", "DESC"],
    ["sold", "ticketId", "DESC"],
    ["sold", "wareId", "DESC"],
  ],
}

exports.findWareQuery = findWareQuery

exports.parseWareInputs = (
  req,
  otherOptions = findWareQuery,
  modelName = "Wares"
) => {
  return parseInputs(req, otherOptions, modelName)
}
