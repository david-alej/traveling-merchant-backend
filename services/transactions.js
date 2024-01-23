const models = require("../database/models")
const { parseInputs } = require("../util/index").parseInputs

exports.findTransactionQuery = {
  include: [],
}

exports.parseTransactionInputs = (
  req,
  otherOptions = {
    include: [],
  },
  modelName = "Transactions"
) => {
  return parseInputs(req, otherOptions, modelName)
}
