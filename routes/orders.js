const ordersRouter = require("express").Router()
const { ordersControllers } = require("../controllers/index")
const { integerValidator, floatValidator, dateValidator } =
  require("../util/index").validators

ordersRouter.param("orderId", ordersControllers.paramOrderId)

ordersRouter.get("/:orderId", ordersControllers.getOrder)

ordersRouter.get(
  "/",
  [
    integerValidator("providerId", false, true),
    floatValidator("cost", false, true),
    dateValidator("expectedAt", false, true),
    dateValidator("actualAt", false, true),
    dateValidator("createdAt", false, true),
    dateValidator("updatedAt", false, true),
  ],
  ordersControllers.getOrders
)

ordersRouter.post(
  "/",
  [
    integerValidator("providerId"),
    floatValidator("cost"),
    dateValidator("expectedAt"),
    dateValidator("actualAt"),
  ],
  ordersControllers.postOrder
)

ordersRouter.put(
  "/:orderId",
  [
    integerValidator("providerId", false, true),
    floatValidator("cost", false, true),
    dateValidator("expectedAt", false, true),
    dateValidator("actualAt", false, true),
  ],
  ordersControllers.putOrder
)

ordersRouter.delete("/:orderId", ordersControllers.deleteOrder)

module.exports = ordersRouter
