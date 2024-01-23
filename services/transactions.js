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

const findTransactionQuery = {
  include: [ticketsInclusion],
  order: [["id", "DESC"]],
}

exports.findTransactionQuery = findTransactionQuery

exports.parseTransactionInputs = (
  req,
  otherOptions = findTransactionQuery,
  modelName = "Transactions"
) => {
  return parseInputs(req, otherOptions, modelName)
}
