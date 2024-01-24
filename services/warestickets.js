const models = require("../database/models")
const { parseInputs } = require("../util/index").parseInputs

const ticketsInclusion = {
  model: models.Tickets,
  as: "ticket",
  attributes: {
    include: [
      [
        models.Sequelize.literal(
          // eslint-disable-next-line quotes
          '(SELECT "ticket"."cost" - COALESCE(SUM("payment"), 0) FROM "Transactions" WHERE "ticketId" = "ticket"."id")'
        ),
        "owed",
      ],
    ],
  },
}

const waresInclusion = {
  model: models.Wares,
  as: "ware",
}

const findWaresTicketQuery = {
  include: [ticketsInclusion, waresInclusion],
}

exports.findWaresTicketQuery = findWaresTicketQuery

exports.parseWaresTicketInputs = (
  req,
  otherOptions = {
    include: findWaresTicketQuery.include,
    order: [["ticketId", "DESC"]],
  },
  modelName = "WaresTickets"
) => {
  return parseInputs(req, otherOptions, modelName)
}
