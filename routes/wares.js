const waresRouter = require("express").Router()
const { waresControllers } = require("../controllers/index")
const {
  arrayTextValidator,
  dateValidator,
  integerValidator,
  floatValidator,
  textValidator,
} = require("../util/index").validators

waresRouter.param("wareId", waresControllers.paramWareId)

waresRouter.get("/:wareId", waresControllers.getWare)

waresRouter.get(
  "/",
  [
    textValidator("name", false, true),
    textValidator("type", false, true),
    arrayTextValidator("tags", false, true),
    integerValidator("stock", false, true, false),
    floatValidator("cost", false, true),
    dateValidator("createdAt", false, true),
    dateValidator("updatedAt", false, true),
  ],
  waresControllers.getWares
)

waresRouter.post(
  "/",
  [
    textValidator("name"),
    textValidator("type"),
    arrayTextValidator("tags", false, true),
    integerValidator("stock", false, false, false),
    floatValidator("cost"),
  ],
  waresControllers.postWare
)

waresRouter.put(
  "/:wareId",
  [
    textValidator("name", false, true),
    textValidator("type", false, true),
    arrayTextValidator("tags", false, true),
    integerValidator("stock", false, true, false),
    floatValidator("cost", false, true),
  ],
  waresControllers.putWare
)

waresRouter.delete("/:wareId", waresControllers.deleteWare)

module.exports = waresRouter
