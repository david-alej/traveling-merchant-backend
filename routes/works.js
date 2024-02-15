const worksRouter = require("express").Router()
const { worksControllers } = require("../controllers/index")
const { wordValidator, stringValidator, phoneNumberValidator, dateValidator } =
  require("../util/index").validators

worksRouter.param("workId", worksControllers.paramWorkId)

worksRouter.get("/:workId", worksControllers.getWork)

worksRouter.post(
  "/search",
  [
    stringValidator("name", true),
    stringValidator("address", true),
    stringValidator("phoneNumber", true),
    dateValidator("createdAt", true),
    dateValidator("updatedAt", true),
  ],
  worksControllers.getWorks
)

worksRouter.post(
  "/",
  [wordValidator("name"), wordValidator("address"), phoneNumberValidator()],
  worksControllers.postWork
)

worksRouter.put(
  "/:workId",
  [
    wordValidator("name", true),
    wordValidator("address", true),
    phoneNumberValidator("phoneNumber", true),
  ],
  worksControllers.putWork
)

worksRouter.delete("/:workId", worksControllers.deleteWork)

module.exports = worksRouter
