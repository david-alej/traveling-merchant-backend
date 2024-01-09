const worksRouter = require("express").Router()
const { worksControllers } = require("../controllers/index")
const { textValidator, phoneNumberValidator, dateValidator } =
  require("../util/index").validators

worksRouter.param("workId", worksControllers.paramWorkId)

worksRouter.get("/:workId", worksControllers.getWork)

worksRouter.get(
  "/",
  [
    textValidator("name", false, true),
    textValidator("address", false, true),
    dateValidator("createdAt", false, true),
    dateValidator("updatedAt", false, true),
  ],
  worksControllers.getWorks
)

worksRouter.post(
  "/",
  [textValidator("name"), textValidator("address"), phoneNumberValidator()],
  worksControllers.postWork
)

worksRouter.put(
  "/:workId",
  [
    textValidator("name", false, true),
    textValidator("address", false, true),
    phoneNumberValidator("phoneNumber", false, true),
  ],
  worksControllers.putWork
)

worksRouter.delete("/:workId", worksControllers.deleteWork)

module.exports = worksRouter
