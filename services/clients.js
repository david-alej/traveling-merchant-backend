const models = require("../database/models")
const { parseInputs } = require("../util/index").parseInputs

const ticketsInclusion = {
  model: models.Tickets,
  as: "tickets",
  order: [["id", "DESC"]],
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
    include: [{ ...ticketsInclusion, limit: 1 }, workInclusion],
  },
  modelName = "Clients"
) => {
  return parseInputs(inputsObject, includeOptions, modelName)
}
