const models = require("../database/models")
const { parseInputs } = require("../util/index").parseInputs

const providersInclusion = {
  model: models.Providers,
  as: "provider",
}

const ordersWaresInclusion = {
  model: models.OrdersWares,
  as: "ordersWares",
  attributes: { exlcude: ["id"] },
  include: {
    model: models.Wares,
    as: "ware",
    attributes: {
      include: [
        [
          models.Sequelize.literal(
            // eslint-disable-next-line quotes
            '(SELECT "amount" - "returned" + COALESCE("ordersWares->ware->waresTickets"."returned"  - "ordersWares->ware->waresTickets"."amount", 0) FROM "OrdersWares" LEFT OUTER JOIN "Orders" ON "OrdersWares"."orderId" = "Orders"."id" WHERE "wareId" = "ordersWares->ware"."id" AND "Orders"."actualAt" IS NOT NULL)'
          ),
          "stock",
        ],
      ],
    },
    include: {
      model: models.WaresTickets,
      as: "waresTickets",
      attributes: { exlcude: ["id"] },
    },
  },
}

exports.findWaresQuery = (wareId) => ({
  where: { id: wareId },
  include: [
    {
      model: models.WaresTickets,
      as: "waresTickets",
    },
    {
      model: models.OrdersWares,
      as: "ordersWares",
    },
  ],
  order: [["id", "DESC"]],
})

const findOrderQuery = {
  include: [providersInclusion, ordersWaresInclusion],
  order: [["id", "DESC"]],
}

exports.findOrderQuery = findOrderQuery

exports.parseOrderInputs = (
  inputsObject,
  otherOptions = findOrderQuery,
  modelName = "Orders"
) => {
  return parseInputs(inputsObject, otherOptions, modelName)
}
