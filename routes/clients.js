const clientsRouter = require("express").Router()
const { clientsControllers } = require("../controllers/index")
const {
  positiveIntegerValidator,
  wordValidator,
  stringValidator,
  dateValidator,
  phoneNumberValidator,
} = require("../util/index").validators

clientsRouter.param("clientId", clientsControllers.paramClientId)

clientsRouter.get("/:clientId", clientsControllers.getClient)

clientsRouter.post(
  "/search",
  [
    positiveIntegerValidator("workId", true),
    stringValidator("fullname", true),
    stringValidator("address", true),
    stringValidator("description", true),
    stringValidator("phoneNumber", true),
    dateValidator("createdAt", true),
    dateValidator("updatedAt", true),
  ],
  clientsControllers.getClients
)

clientsRouter.post(
  "/",
  [
    wordValidator("fullname"),
    wordValidator("address"),
    phoneNumberValidator(),
    stringValidator("description", true),
  ],
  clientsControllers.workValidation,
  clientsControllers.postClient
)

clientsRouter.put(
  "/:clientId",
  [
    positiveIntegerValidator("workId", true),
    wordValidator("fullname", true),
    wordValidator("address", true),
    phoneNumberValidator("phoneNumber", true),
    stringValidator("description", true),
  ],
  clientsControllers.putClient
)

clientsRouter.delete("/:clientId", clientsControllers.deleteClient)

module.exports = clientsRouter
