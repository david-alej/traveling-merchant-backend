const clientsRouter = require("express").Router()
const { clientsControllers } = require("../controllers/index")

clientsRouter.param("clientId", clientsControllers.paramClientId)

clientsRouter.get("/:clientId", clientsControllers.getClient)

clientsRouter.get("/", clientsControllers.getClients)

clientsRouter.post("/", clientsControllers.postClient)

clientsRouter.put("/:clientId", clientsControllers.putClient)

clientsRouter.delete("/:clientId", clientsControllers.deleteClient)

module.exports = clientsRouter
