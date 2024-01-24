const waresticketsRouter = require("express").Router()
const { waresticketsControllers } = require("../controllers/index")
const { dateValidator } = require("../util/index").validators

waresticketsRouter.param("waresticketId", waresticketsControllers.paramWaresTicketId)

waresticketsRouter.get("/:waresticketId", waresticketsControllers.getWaresTicket)

waresticketsRouter.get(
  "/",
  [
    dateValidator("createdAt", false, true),
    dateValidator("updatedAt", false, true),
  ],
  waresticketsControllers.getWaresTickets
)

waresticketsRouter.post("/", [], waresticketsControllers.postWaresTicket)

waresticketsRouter.put("/:waresticketId", [], waresticketsControllers.putWaresTicket)

waresticketsRouter.delete("/:waresticketId", waresticketsControllers.deleteWaresTicket)

module.exports = waresticketsRouter
