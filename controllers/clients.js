const { validationPerusal, integerValidator } = require("./validators")
const models = require("../database/models")
const { Api404Error } = require("../util/index").apiErrors
const { findClientQuery, findClientsQuery } =
  require("../services/index").clientsServices

const createSubsetObject = (obj, keys) =>
  Object.fromEntries(
    keys
      .filter((key) => typeof obj[String(key)] !== "undefined")
      .map((key) => [key, obj[String(key)]])
  )

exports.paramClientId = async (req, res, next, clientId) => {
  const merchant = req.session.merchant

  try {
    await integerValidator("clientId", true).run(req)

    validationPerusal(req, merchant.preMsg)

    const searched = await models.Clients.findOne({
      where: { id: clientId },
      ...findClientQuery,
    })

    if (!searched) {
      throw new Api404Error(
        merchant.preMsg + ` target client ${clientId} not found.`,
        "Client not found."
      )
    }

    req.targetClient = searched.dataValues

    next()
  } catch (err) {
    next(err)
  }
}

exports.getClient = async (req, res) => res.json(req.targetClient)

exports.getClients = async (req, res, next) => {
  const merchant = req.session.merchant
  const afterMsg = "."
  const validInputs = [
    "workId",
    "fullname",
    "address",
    "createdAt",
    "updatedAt",
  ]

  try {
    validationPerusal(req)

    const inputs = createSubsetObject(req.body, validInputs)

    const query = findClientsQuery(inputs)

    const searched = await models.Clients.findAll(query)

    if (!searched) {
      throw new Api404Error(
        merchant.preMsg + " captions were not found" + afterMsg
      )
    }

    res.json(searched)
  } catch (err) {
    next(err)
  }
}

exports.postClient = async (req, res, next) => {
  try {
    res.send("")
  } catch (err) {
    next(err)
  }
}

exports.putClient = async (req, res, next) => {
  try {
    res.send("")
  } catch (err) {
    next(err)
  }
}

exports.deleteClient = async (req, res, next) => {
  try {
    res.send("")
  } catch (err) {
    next(err)
  }
}
