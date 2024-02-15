const orderswaresRouter = require("express").Router()
const { orderswaresControllers } = require("../controllers/index")
const {
  positiveFloatValidator,
  positiveIntegerValidator,
  nonNegativeIntegerValidator,
  dateValidator,
} = require("../util/index").validators

orderswaresRouter.param("orderId", orderswaresControllers.paramOrderId)

orderswaresRouter.param("wareId", orderswaresControllers.paramWareId)

orderswaresRouter.get("/:orderId/:wareId", orderswaresControllers.getOrdersWare)

orderswaresRouter.post(
  "/search",
  [
    positiveIntegerValidator("orderId", true),
    positiveIntegerValidator("wareId", true),
    positiveIntegerValidator("amount", true),
    positiveFloatValidator("unitPrice", true),
    nonNegativeIntegerValidator("returned", true),
    dateValidator("createdAt", true),
    dateValidator("updatedAt", true),
  ],
  orderswaresControllers.getOrdersWares
)

orderswaresRouter.post(
  "/",
  [
    positiveIntegerValidator("orderId"),
    positiveIntegerValidator("wareId"),
    positiveIntegerValidator("amount"),
    positiveFloatValidator("unitPrice"),
    nonNegativeIntegerValidator("returned", true),
  ],
  orderswaresControllers.postOrdersWare
)

orderswaresRouter.put(
  "/:orderId/:wareId",
  [
    positiveIntegerValidator("amount", true),
    positiveFloatValidator("unitPrice", true),
    nonNegativeIntegerValidator("returned", true),
  ],
  orderswaresControllers.putOrdersWare
)

orderswaresRouter.delete(
  "/:orderId/:wareId",
  orderswaresControllers.deleteOrdersWare
)

orderswaresRouter.delete("/:orderId", orderswaresControllers.deleteOrdersWares)

module.exports = orderswaresRouter
