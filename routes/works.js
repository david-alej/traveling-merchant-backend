const worksRouter = require("express").Router()
const { worksControllers } = require("../controllers/index")

worksRouter.param("workId", worksControllers.paramWorkId)

worksRouter.get("/:workId", worksControllers.getWork)

worksRouter.get("/", worksControllers.getWorks)

module.exports = worksRouter
