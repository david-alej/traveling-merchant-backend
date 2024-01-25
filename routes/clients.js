const clientsRouter = require("express").Router()
const { clientsControllers } = require("../controllers/index")
const { integerValidator, textValidator, dateValidator, phoneNumberValidator } =
  require("../util/index").validators

clientsRouter.param("clientId", clientsControllers.paramClientId)

clientsRouter.get("/:clientId", clientsControllers.getClient)

clientsRouter.get(
  "/",
  [
    integerValidator("workId", false, true),
    textValidator("fullname", false, true),
    textValidator("address", false, true, false),
    dateValidator("createdAt", false, true),
    dateValidator("updatedAt", false, true),
  ],
  clientsControllers.getClients
)

clientsRouter.post(
  "/",
  [textValidator("fullname"), textValidator("address"), phoneNumberValidator()],
  clientsControllers.workValidation,
  clientsControllers.postClient
)

clientsRouter.put(
  "/:clientId",
  [
    integerValidator("workId", false, true),
    textValidator("fullname", false, true),
    textValidator("address", false, true),
    phoneNumberValidator("phoneNumber", false, true),
    integerValidator("relationship", false, true, false),
  ],
  clientsControllers.putClient
)

clientsRouter.delete("/:clientId", clientsControllers.deleteClient)

module.exports = clientsRouter
