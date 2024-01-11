const orderswaresRouter = require("express").Router()
const { orderswaresControllers } = require("../controllers/index")
const { dateValidator } = require("../util/index").validators

orderswaresRouter.param("orderswareId", orderswaresControllers.paramOrdersWareId)

orderswaresRouter.get("/:orderswareId", orderswaresControllers.getOrdersWare)

orderswaresRouter.get(
  "/",
  [
    dateValidator("createdAt", false, true),
    dateValidator("updatedAt", false, true),
  ],
  orderswaresControllers.getOrdersWares
)

orderswaresRouter.post("/", [], orderswaresControllers.postOrdersWare)

orderswaresRouter.put("/:orderswareId", [], orderswaresControllers.putOrdersWare)

orderswaresRouter.delete("/:orderswareId", orderswaresControllers.deleteOrdersWare)

module.exports = orderswaresRouter
