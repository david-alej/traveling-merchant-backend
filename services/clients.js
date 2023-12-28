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
  inputNames,
  afterMsgOnly = false,
  includeOptions = [{ ...ticketsInclusion, limit: 1 }, workInclusion]
) => {
  return parseInputs(inputsObject, inputNames, afterMsgOnly, includeOptions)
}
