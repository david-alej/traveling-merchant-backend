const models = require("../database/models")
const { parseInputs } = require("../util/index").parseInputs

const ticketsInclusion = {
  model: models.Tickets,
  as: "tickets",
  order: [["id", "DESC"]],
  attributes: {
    include: [
      [
        models.Sequelize.literal(
          // eslint-disable-next-line quotes
          '(SELECT "tickets"."cost" - COALESCE(SUM("payment"), 0) FROM "Transactions" WHERE "ticketId" = "tickets"."id")'
        ),
        "owed",
      ],
    ],
  },
}

const workInclusion = {
  model: models.Works,
  as: "work",
}

exports.findClientQuery = {
  include: [workInclusion, ticketsInclusion],
}

exports.parseClientInputs = (
  inputsObject,
  includeOptions = {
    include: [ticketsInclusion, workInclusion],
    order: [["id", "DESC"]],
  },
  modelName = "Clients"
) => {
  return parseInputs(inputsObject, includeOptions, modelName)
}
