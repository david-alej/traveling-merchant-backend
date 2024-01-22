module.exports = {
  authorize: require("./authorize"),
  errorHandlers: require("./errorHandlers"),
  loginControllers: require("./login"),
  logoutControllers: require("./logout"),
  merchantControllers: require("./merchant"),
  clientsControllers: require("./clients"),
  validators: require("../util/validators"),
  ordersControllers: require("./orders"),
  orderswaresControllers: require("./orderswares"),
  providersControllers: require("./providers"),
  worksControllers: require("./works"),
}
