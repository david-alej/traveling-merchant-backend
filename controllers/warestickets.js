const { validationPerusal, integerValidator } =
  require("../util/index").validators
const models = require("../database/models")
const { Api400Error, Api404Error, Api500Error } =
  require("../util/index").apiErrors
const { findWaresTicketQuery, parseWaresTicketInputs } =
  require("../services/index").waresticketsServices

exports.paramWareId = async (req, res, next, wareId) => {
  try {
    await integerValidator("wareId", true).run(req)

    req.wareId = wareId

    next()
  } catch (err) {
    next(err)
  }
}

exports.paramTicketId = async (req, res, next, ticketId) => {
  const merchant = req.session.merchant

  try {
    await integerValidator("ticketId", true).run(req)

    validationPerusal(req)

    const searched = await models.WaresTickets.findOne({
      where: { id: waresticketId },
      ...findWaresTicketQuery,
    })

    if (!searched) {
      throw new Api404Error(
        merchant.preMsg + ` target waresticket ${waresticketId} not found.`,
        "WaresTicket not found."
      )
    }

    req.targetWaresTicket = searched.dataValues

    next()
  } catch (err) {
    next(err)
  }
}

exports.getWaresTicket = async (req, res) => res.json(req.targetWaresTicket)

exports.getWaresTickets = async (req, res, next) => {
  const merchant = req.session.merchant

  try {
    const { afterMsg, query } = await parseWaresTicketInputs(req)

    const searched = await models.WaresTickets.findAll(query)

    if (!searched) {
      throw new Api404Error(
        merchant.preMsg + " warestickets were not found" + afterMsg,
        "WaresTickets not found."
      )
    }

    res.json(searched)
  } catch (err) {
    next(err)
  }
}

exports.postWaresTicket = async (req, res, next) => {
  const merchant = req.session.merchant

  try {
    const { afterMsg, inputsObject: newWaresTicket } =
      await parseWaresTicketInputs(req, true)

    const created = await models.WaresTickets.create(newWaresTicket)

    if (!created) {
      throw new Api500Error(
        merchant.preMsg + " create waresticket query did not work" + afterMsg,
        "Internal server query error."
      )
    }

    res.status(201).send(merchant.preMsg + " waresticket has been created.")
  } catch (err) {
    next(err)
  }
}

exports.putWaresTicket = async (req, res, next) => {
  const merchant = req.session.merchant
  const targetWaresTicket = req.targetWaresTicket

  try {
    const { afterMsg, inputsObject: newValues } = await parseWaresTicketInputs(
      req,
      true
    )

    if (JSON.stringify(newValues) === "{}") {
      throw new Api400Error(
        merchant.preMsg + " did not update any value.",
        "Bad input request."
      )
    }

    const updated = await models.WaresTickets.update(newValues, {
      where: { id: targetWaresTicket.id },
    })

    if (!updated) {
      throw new Api500Error(
        merchant.preMsg + " update waresticket query did not work" + afterMsg,
        "Internal server query error."
      )
    }

    res.send(
      merchant.preMsg +
        ` waresticket with id = ${targetWaresTicket.id} was updated` +
        afterMsg
    )
  } catch (err) {
    next(err)
  }
}

exports.deleteWaresTicket = async (req, res, next) => {
  const merchant = req.session.merchant
  const targetWaresTicket = req.targetWaresTicket

  try {
    const deleted = await models.WaresTickets.destroy({
      where: { id: targetWaresTicket.id },
    })

    if (!deleted) {
      throw new Api500Error(
        merchant.preMsg +
          ` delete waresticket query did not work with waresticket id = ${targetWaresTicket.id}`,
        "Internal server query error."
      )
    }

    res.send(
      merchant.preMsg +
        ` has deleted a waresticket with id = ${targetWaresTicket.id} and fullname = ${targetWaresTicket.fullname}.`
    )
  } catch (err) {
    next(err)
  }
}
