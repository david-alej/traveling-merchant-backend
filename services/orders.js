const models = require("../database/models")
const { parseInputs } = require("../util/index").parseInputs

const providersInclusion = {
  model: models.Providers,
  as: "provider",
}

const ordersWaresInclusion = {
  model: models.OrdersWares,
  as: "waresBought",
  attributes: { exlcude: ["id"] },
  include: {
    model: models.Wares,
    as: "ware",
    attributes: {
      include: [
        [
          models.Sequelize.literal(
            // eslint-disable-next-line quotes
            '(SELECT "amount" - "returned" + COALESCE("waresBought->ware->sold"."returned"  - "waresBought->ware->sold"."amount", 0) FROM "OrdersWares" LEFT OUTER JOIN "Orders" ON "OrdersWares"."orderId" = "Orders"."id" WHERE "wareId" = "waresBought->ware"."id" AND "Orders"."actualAt" IS NOT NULL)'
          ),
          "stock",
        ],
      ],
    },
    include: {
      model: models.WaresTickets,
      as: "sold",
      attributes: { exlcude: ["id"] },
    },
  },
}

exports.findWaresQuery = (wareId) => ({
  where: { id: wareId },
  include: [
    {
      model: models.WaresTickets,
      as: "sold",
    },
    {
      model: models.OrdersWares,
      as: "bought",
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
