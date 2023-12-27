const express = require("express")
const merchantRouter = express.Router()
const { merchantControllers } = require("../controllers/index")
const { credentialsValidator, newCredentialsValidator } =
  require("../controllers/index").validators

merchantRouter.param("merchantId", merchantControllers.paramMerchantId)

merchantRouter.get("/", merchantControllers.getMerchants)

merchantRouter.put(
  "/:merchantId",
  credentialsValidator(),
  newCredentialsValidator(),
  merchantControllers.putMerchant
)

module.exports = merchantRouter
