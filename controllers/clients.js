const { validationPerusal, integerValidator } =
  require("../util/index").validators
const models = require("../database/models")
const { Api400Error, Api404Error, Api500Error } =
  require("../util/index").apiErrors
const { findClientQuery, parseClientInputs } =
  require("../services/index").clientsServices

exports.paramClientId = async (req, res, next, clientId) => {
  const merchant = req.session.merchant

  try {
    await integerValidator("clientId", true).run(req)

    validationPerusal(req)

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

  try {
    const { afterMsg, query } = await parseClientInputs(req)

    const searched = await models.Clients.findAll(query)

    if (!searched) {
      throw new Api404Error(
        merchant.preMsg + " clients were not found" + afterMsg,
        "Clients not found."
      )
    }

    res.json(searched)
  } catch (err) {
    next(err)
  }
}

exports.postClient = async (req, res, next) => {
  const merchant = req.session.merchant

  try {
    const { inputsObject: newClient } = await parseClientInputs(req, true)

    const created = await models.Clients.create(newClient)

    if (!created) {
      throw new Api500Error(
        merchant.preMsg + " create client query did not work.",
        "Internal server query error."
      )
    }

    res.status(201).send(merchant.preMsg + " client has been created.")
  } catch (err) {
    next(err)
  }
}

exports.putClient = async (req, res, next) => {
  const merchant = req.session.merchant
  const targetClient = req.targetClient

  try {
    const { afterMsg, inputsObject: newValues } = await parseClientInputs(
      req,
      true
    )
    console.log(newValues)
    if (JSON.stringify(newValues) === "{}") {
      throw new Api400Error(
        merchant.preMsg + " did not update any value.",
        "Bad input request."
      )
    }

    const updated = await models.Clients.update(newValues, {
      where: { id: targetClient.id },
    })

    if (!updated) {
      throw new Api500Error(
        merchant.preMsg + " update client query did not work" + afterMsg,
        "Internal server query error."
      )
    }

    res.send(
      merchant.preMsg +
        ` client with id = ${targetClient.id} was updated` +
        afterMsg
    )
  } catch (err) {
    next(err)
  }
}

exports.deleteClient = async (req, res, next) => {
  const merchant = req.session.merchant
  const targetClient = req.targetClient

  try {
    const deleted = await models.Clients.destroy({
      where: { id: targetClient.id },
    })

    if (!deleted) {
      throw new Api500Error(
        merchant.preMsg + " delete client query did not work.",
        "Internal server query error."
      )
    }

    res.send(
      merchant.preMsg +
        ` has deleted a client with id = ${targetClient.id} and fullname = ${targetClient.fullname}.`
    )
  } catch (err) {
    next(err)
  }
}
