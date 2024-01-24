const waresticketsRouter = require("express").Router()
const { waresticketsControllers } = require("../controllers/index")
const { integerValidator, dateValidator } = require("../util/index").validators

waresticketsRouter.param("wareId", waresticketsControllers.paramWareId)

waresticketsRouter.param("ticketId", waresticketsControllers.paramTicketId)

waresticketsRouter.get(
  "/:wareId/:ticketId",
  waresticketsControllers.getWaresTicket
)

waresticketsRouter.get(
  "/",
  [
    integerValidator("wareId", false, true),
    integerValidator("ticketId", false, true),
    integerValidator("amount", false, true),
    integerValidator("returned", false, true),
    dateValidator("createdAt", false, true),
    dateValidator("updatedAt", false, true),
  ],
  waresticketsControllers.getWaresTickets
)

waresticketsRouter.post(
  "/",
  [
    integerValidator("wareId"),
    integerValidator("ticketId"),
    integerValidator("amount"),
    integerValidator("returned", false, true),
  ],
  waresticketsControllers.postWaresTicket
)

waresticketsRouter.put(
  "/:wareId/:ticketId",
  [
    integerValidator("amount", false, true),
    integerValidator("returned", false, true),
  ],
  waresticketsControllers.putWaresTicket
)

waresticketsRouter.delete(
  "/:wareId/:ticketId",
  waresticketsControllers.deleteWaresTicket
)

waresticketsRouter.delete(
  "/",
  [integerValidator("ticketId")],
  waresticketsControllers.deleteWaresTickets
)

module.exports = waresticketsRouter
