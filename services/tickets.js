const models = require("../database/models")
const { parseInputs } = require("../util/index").parseInputs

const clientsInclusion = {
  model: models.Clients,
  as: "client",
  include: {
    model: models.Works,
    as: "work",
  },
}

const transactionsInclusion = {
  model: models.Transactions,
  as: "payments",
}

const waresTicketsInclusion = {
  model: models.WaresTickets,
  as: "waresSold",
  include: {
    model: models.Wares,
    as: "ware",
  },
}

const findTicketQuery = {
  attributes: {
    include: [
      [
        models.Sequelize.literal(
          // eslint-disable-next-line quotes
          '(SELECT "Tickets"."cost" - COALESCE(SUM("payment"), 0) FROM "Transactions" WHERE "ticketId" = "Tickets"."id")'
        ),
        "owed",
      ],
    ],
  },
  include: [clientsInclusion, transactionsInclusion, waresTicketsInclusion],
  order: [
    ["id", "DESC"],
    ["payments", "id", "DESC"],
    ["waresSold", "ware", "cost", "DESC"],
  ],
}

exports.findTicketQuery = findTicketQuery

exports.parseTicketInputs = (
  req,
  otherOptions = findTicketQuery,
  modelName = "Tickets"
) => {
  return parseInputs(req, otherOptions, modelName)
}
