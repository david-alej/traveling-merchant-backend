const models = require("../database/models")
const { parseInputs } = require("../util/index").parseInputs

const clientsInclusion = {
  model: models.Clients,
  as: "employees",
  order: [["id", "DESC"]],
}

exports.findWorkQuery = { include: [clientsInclusion] }

exports.parseWorkInputs = (
  req,
  includeOptions = { include: [clientsInclusion] }
) => {
  return parseInputs(req, includeOptions, "Works")
}
