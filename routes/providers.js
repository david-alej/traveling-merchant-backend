const providersRouter = require("express").Router()
const { providersControllers } = require("../controllers/index")
const { textValidator, dateValidator, phoneNumberValidator } =
  require("../util/index").validators

providersRouter.param("providerId", providersControllers.paramProviderId)

providersRouter.get("/:providerId", providersControllers.getProvider)

providersRouter.get(
  "/",
  [
    textValidator("name", false, true),
    textValidator("address", false, true, false),
    phoneNumberValidator("phoneNumber", false, true),
    dateValidator("createdAt", false, true),
    dateValidator("updatedAt", false, true),
  ],
  providersControllers.getProviders
)

providersRouter.post(
  "/",
  [
    textValidator("name"),
    textValidator("address"),
    phoneNumberValidator("phoneNumber"),
  ],
  providersControllers.postProvider
)

providersRouter.put(
  "/:providerId",
  [
    textValidator("name", false, true),
    textValidator("address", false, true),
    phoneNumberValidator("phoneNumber", false, true),
  ],
  providersControllers.putProvider
)

providersRouter.delete("/:providerId", providersControllers.deleteProvider)

module.exports = providersRouter
