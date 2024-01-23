const { validationPerusal, integerValidator } =
  require("../util/index").validators
const models = require("../database/models")
const { Api400Error, Api404Error, Api500Error } =
  require("../util/index").apiErrors
const { findTicketQuery, parseTicketInputs } =
  require("../services/index").ticketsServices

exports.paramTicketId = async (req, res, next, ticketId) => {
  const merchant = req.session.merchant

  try {
    await integerValidator("ticketId", true).run(req)

    validationPerusal(req)

    const searched = await models.Tickets.findOne({
      where: { id: ticketId },
      ...findTicketQuery,
    })

    if (!searched) {
      throw new Api404Error(
        merchant.preMsg + ` target ticket ${ticketId} not found.`,
        "Ticket not found."
      )
    }

    req.targetTicket = searched.dataValues

    next()
  } catch (err) {
    next(err)
  }
}

exports.getTicket = async (req, res) => res.json(req.targetTicket)

exports.getTickets = async (req, res, next) => {
  const merchant = req.session.merchant

  try {
    const { afterMsg, query } = await parseTicketInputs(req)

    const searched = await models.Tickets.findAll(query)

    if (!searched) {
      throw new Api404Error(
        merchant.preMsg + " tickets were not found" + afterMsg,
        "Tickets not found."
      )
    }

    res.json(searched)
  } catch (err) {
    next(err)
  }
}

exports.postTicket = async (req, res, next) => {
  const merchant = req.session.merchant

  try {
    const { afterMsg, inputsObject: newTicket } = await parseTicketInputs(
      req,
      true
    )

    const created = await models.Tickets.create(newTicket)

    if (!created) {
      throw new Api500Error(
        merchant.preMsg + " create ticket query did not work" + afterMsg,
        "Internal server query error."
      )
    }

    res.status(201).send(merchant.preMsg + " ticket has been created.")
  } catch (err) {
    next(err)
  }
}

exports.putTicket = async (req, res, next) => {
  const merchant = req.session.merchant
  const targetTicket = req.targetTicket

  try {
    const { afterMsg, inputsObject: newValues } = await parseTicketInputs(
      req,
      true
    )

    if (JSON.stringify(newValues) === "{}") {
      throw new Api400Error(
        merchant.preMsg + " did not update any value.",
        "Bad input request."
      )
    }

    const updated = await models.Tickets.update(newValues, {
      where: { id: targetTicket.id },
    })

    if (!updated) {
      throw new Api500Error(
        merchant.preMsg + " update ticket query did not work" + afterMsg,
        "Internal server query error."
      )
    }

    res.send(
      merchant.preMsg +
        ` ticket with id = ${targetTicket.id} was updated` +
        afterMsg
    )
  } catch (err) {
    next(err)
  }
}

exports.deleteTicket = async (req, res, next) => {
  const merchant = req.session.merchant
  const targetTicket = req.targetTicket

  try {
    const deleted = await models.Tickets.destroy({
      where: { id: targetTicket.id },
    })

    if (!deleted) {
      throw new Api500Error(
        merchant.preMsg +
          ` delete ticket query did not work with ticket id = ${targetTicket.id}`,
        "Internal server query error."
      )
    }

    res.send(
      merchant.preMsg +
        ` has deleted a ticket with id = ${targetTicket.id} and fullname = ${targetTicket.fullname}.`
    )
  } catch (err) {
    next(err)
  }
}
