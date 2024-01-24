const models = require("../database/models")
const { parseInputs } = require("../util/index").parseInputs

exports.findWaresTicketQuery = {
  include: [],
}

exports.parseWaresTicketInputs = (
  req,
  otherOptions = {
    include: [],
  },
  modelName = "WaresTickets"
) => {
  return parseInputs(req, otherOptions, modelName)
}
