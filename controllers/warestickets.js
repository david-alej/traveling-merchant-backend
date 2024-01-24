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
  const wareId = req.wareId

  try {
    await integerValidator("ticketId", true).run(req)

    validationPerusal(req)

    const searched = await models.WaresTickets.findOne({
      where: { ticketId, wareId },
      ...findWaresTicketQuery,
    })

    if (!searched) {
      throw new Api404Error(
        merchant.preMsg +
          ` target waresticket with ware id = ${wareId} and ticket id = ${ticketId} not found.`,
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
      await parseWaresTicketInputs(req)

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
  const { wareId, ticketId } = req.targetWaresTicket

  try {
    const { afterMsg, inputsObject: newValues } = await parseWaresTicketInputs(
      req
    )

    if (JSON.stringify(newValues) === "{}") {
      throw new Api400Error(
        merchant.preMsg + " did not update any value.",
        "Bad input request."
      )
    }

    const updated = await models.WaresTickets.update(newValues, {
      where: { wareId, ticketId },
    })

    if (!updated) {
      throw new Api500Error(
        merchant.preMsg + " update waresticket query did not work" + afterMsg,
        "Internal server query error."
      )
    }

    res.send(
      merchant.preMsg +
        ` waresticket with ware id = ${wareId} and ticket id = ${ticketId} was updated` +
        afterMsg
    )
  } catch (err) {
    next(err)
  }
}

exports.deleteWaresTicket = async (req, res, next) => {
  const merchant = req.session.merchant
  const { wareId, ticketId } = req.targetWaresTicket

  try {
    const deleted = await models.WaresTickets.destroy({
      where: { wareId, ticketId },
    })

    if (!deleted) {
      throw new Api500Error(
        merchant.preMsg +
          ` delete waresticket query did not work with ware id = ${wareId} and ticket id = ${ticketId}.`,
        "Internal server query error."
      )
    }

    res.send(
      merchant.preMsg +
        ` has deleted a waresticket with ware id = ${wareId} and ticket id = ${ticketId}.`
    )
  } catch (err) {
    next(err)
  }
}

exports.deleteWaresTickets = async (req, res, next) => {
  const merchant = req.session.merchant

  try {
    const {
      inputsObject: { ticketId },
    } = await parseWaresTicketInputs(req)

    const ticketSearched = await models.Tickets.findOne({
      where: { id: ticketId },
    })

    if (!ticketSearched) {
      throw new Api404Error(
        merchant.preMsg + ` order does not exist with ticket id = ${ticketId}.`,
        "Ticket not found."
      )
    }

    const deleted = await models.WaresTickets.destroy({
      where: { ticketId },
    })

    if (!deleted) {
      throw new Api500Error(
        merchant.preMsg +
          ` delete waresticket query did not work with ticket id = ${ticketId}.`,
        "Internal server query error."
      )
    }

    res.send(
      merchant.preMsg +
        ` has deleted a waresticket with ticket id = ${ticketId}.`
    )
  } catch (err) {
    next(err)
  }
}
