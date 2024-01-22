const orderswaresRouter = require("express").Router()
const { orderswaresControllers } = require("../controllers/index")
const { floatValidator, integerValidator, dateValidator } =
  require("../util/index").validators

orderswaresRouter.param("orderId", orderswaresControllers.paramOrderId)

orderswaresRouter.param("wareId", orderswaresControllers.paramWareId)

orderswaresRouter.get("/:orderId/:wareId", orderswaresControllers.getOrdersWare)

orderswaresRouter.get(
  "/",
  [
    integerValidator("orderId", false, true),
    integerValidator("wareId", false, true),
    integerValidator("amount", false, true),
    floatValidator("cost", false, true),
    integerValidator("returned", false, true),
    dateValidator("createdAt", false, true),
    dateValidator("updatedAt", false, true),
  ],
  orderswaresControllers.getOrdersWares
)

orderswaresRouter.post(
  "/",
  [
    integerValidator("orderId"),
    integerValidator("wareId"),
    integerValidator("amount"),
    floatValidator("cost"),
    integerValidator("returned", false, true),
  ],
  orderswaresControllers.postOrdersWare
)

orderswaresRouter.put(
  "/:orderId/:wareId",
  [
    integerValidator("amount", false, true),
    floatValidator("cost", false, true),
    integerValidator("returned", false, true),
  ],
  orderswaresControllers.putOrdersWare
)

orderswaresRouter.delete(
  "/:orderId/:wareId",
  orderswaresControllers.deleteOrdersWare
)

orderswaresRouter.delete(
  "/",
  [integerValidator("orderId")],
  orderswaresControllers.deleteOrdersWares
)

module.exports = orderswaresRouter
