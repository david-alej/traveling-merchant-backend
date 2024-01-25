const ticketsRouter = require("express").Router()
const { ticketsControllers } = require("../controllers/index")
const {
  arrayObjectValidator,
  booleanValidator,
  integerValidator,
  textValidator,
  dateValidator,
  floatValidator,
} = require("../util/index").validators

ticketsRouter.param("ticketId", ticketsControllers.paramTicketId)

ticketsRouter.get("/:ticketId", ticketsControllers.getTicket)

ticketsRouter.get(
  "/",
  [
    integerValidator("clientId", false, true),
    floatValidator("cost", false, true),
    textValidator("paymentPlan", false, true),
    textValidator("description", false, true),
    dateValidator("createdAt", false, true),
    dateValidator("updatedAt", false, true),
    booleanValidator("pending", false, true),
  ],
  ticketsControllers.getTickets
)

ticketsRouter.post(
  "/",
  [
    integerValidator("clientId"),
    floatValidator("cost", false, true),
    textValidator("paymentPlan"),
    textValidator("description", false, true),
    arrayObjectValidator("waresTickets"),
  ],
  ticketsControllers.postValidation,
  ticketsControllers.postTicket
)

ticketsRouter.put(
  "/:ticketId",
  [
    integerValidator("clientId", false, true),
    floatValidator("cost", false, true),
    textValidator("paymentPlan", false, true),
    textValidator("description", false, true),
  ],
  ticketsControllers.putTicket
)

ticketsRouter.delete("/:ticketId", ticketsControllers.deleteTicket)

module.exports = ticketsRouter
