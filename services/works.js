const models = require("../database/models")
const { parseInputs } = require("../util/index").parseInputs

const clientsInclusion = {
  model: models.Clients,
  as: "employees",
  order: [["id", "DESC"]],
}

exports.findWorkQuery = { include: [clientsInclusion] }

exports.parseWorkInputs = (
  inputsObject,
  inputNames,
  afterMsgOnly = false,
  includeOptions = [clientsInclusion]
) => {
  return parseInputs(inputsObject, inputNames, afterMsgOnly, includeOptions)
}
