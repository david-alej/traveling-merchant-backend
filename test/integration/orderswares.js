const {
  axios,
  axiosConfig,
  initializeWebServer,
  stopWebServer,
  expect,
  httpStatusCodes,
  merchantCredentials,
  preMerchantMsg,
  models,
} = require("../common")

const { OK, NOT_FOUND, BAD_REQUEST, CREATED } = httpStatusCodes

describe("OrdersWares Routes", function () {
  let client
  const setHeaders = { headers: {} }
  const orderswareObject = {
    type: "object",
    required: ["id", "createdAt", "updatedAt"],
    properties: {},
  }

  const orderswareSchema = {
    title: "OrdersWare schema",
    ...orderswareObject,
  }

  const orderswaresSchema = {
    title: "OrdersWares Schema",
    type: "array",
    items: {
      ...orderswareObject,
    },
  }

  before(async function () {
    const apiConnection = await initializeWebServer()

    const currentAxiosConfig = { ...axiosConfig }

    currentAxiosConfig.baseURL += apiConnection.port

    client = axios.create(currentAxiosConfig)

    const { status, data, headers } = await client.post(
      "/login",
      merchantCredentials
    )

    setHeaders.headers.Cookie = headers["set-cookie"]
    setHeaders.headers["x-csrf-token"] = data.csrfToken

    expect(status).to.equal(OK)
  })

  after(async function () {
    await stopWebServer()
  })

  describe("Get /:orderswareId", function () {
    it("When an existing ordersware id is given, Then the response is the ordersware", async function () {
      const orderswareId = Math.ceil(Math.random() * 3)

      const { status, data } = await client.get(
        "/orderswares/" + orderswareId,
        setHeaders
      )
      console.log(data)
      expect(status).to.equal(OK)
      expect(data).to.be.jsonSchema(orderswareSchema)
    })

    it("When an non-existing ordersware id is given, Then the response is not found #paramOrdersWareId", async function () {
      const orderswareId = Math.ceil(Math.random() * 10) + 3

      const { status, data } = await client.get(
        "/orderswares/" + orderswareId,
        setHeaders
      )

      expect(status).to.equal(NOT_FOUND)
      expect(data).to.equal("OrdersWare not found.")
    })

    it("When ordersware id given is not an integer, Then the response is not found #integerValidator #paramOrdersWareId", async function () {
      const orderswareId = "string"

      const { status, data } = await client.get(
        "/orderswares/" + orderswareId,
        setHeaders
      )

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal("Bad input request.")
    })
  })

  describe("Get /", function () {
    const allOrdersWares = []

    async function getOrdersWaresIt(requestBody, expectedOrdersWares = []) {
      expectedOrdersWares = Array.isArray(expectedOrdersWares)
        ? expectedOrdersWares
        : [expectedOrdersWares]
      const config = structuredClone(setHeaders)
      config.data = requestBody

      const { status, data: orderswares } = await client.get("/orderswares", config)
      console.log(orderswares)
      expect(status).to.equal(OK)
      expect(orderswares).to.be.jsonSchema(orderswaresSchema)
      expect(orderswares).to.eql(expectedOrdersWares)
    }

    it("When no inputs is provided, Then default query search is returned ", async function () {
      await getOrdersWaresIt({}, allOrdersWares)
    })

    it("When a created at date is given, Then response is all orderswares within that same month and year", async function () {
      await getOrdersWaresIt({ createdAt: new Date("2024-11-11") }, allOrdersWares)
    })

    it("When a updated at date is given, Then response is all orderswares within that same month and year", async function () {
      await getOrdersWaresIt({ updatedAt: new Date("2024-12-10") }, allOrdersWares)
    })

    it("When multiple inputs are given, Then response is all orderswares that satisfy the input comparisons", async function () {
      await getOrdersWaresIt(
        { createdAt: "2024-11-11", updatedAt: "2024-12-11" },
        allOrdersWares
      )
    })
  })

  describe("Post /", function () {
    it("When merchant inputs required values, Then ordersware is created ", async function () {
      const requestBody = {}

      const { status, data } = await client.post(
        "/orderswares",
        requestBody,
        setHeaders
      )

      const newOrdersWareSearched = await models.OrdersWares.findOne({
        where: requestBody,
      })
      const newOrdersWare = newOrdersWareSearched.dataValues
      const newOrdersWareDeleted = await models.OrdersWares.destroy({
        where: requestBody,
      })

      expect(status).to.equal(CREATED)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(" ordersware has been created.")
      expect(newOrdersWare).to.include(requestBody)
      expect(newOrdersWareDeleted).to.equal(1)
    })
  })

  describe("Put /:orderswareId", function () {
    it("When there are no inputs, Then response is bad request", async function () {
      const orderswareId = Math.ceil(Math.random() * 3)
      const requestBody = {}

      const { status, data } = await client.put(
        "/orderswares/" + orderswareId,
        requestBody,
        setHeaders
      )

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal("Bad input request.")
    })

    it("When inputs are given, Then ordersware has the respective information updated", async function () {
      const newOrdersWare = {}
      const orderswareBeforeCreated = await models.OrdersWares.create(newOrdersWare)
      const orderswareBefore = orderswareBeforeCreated.dataValues
      const orderswareId = orderswareBefore.id
      const requestBody = {}

      const { status, data } = await client.put(
        "/orderswares/" + orderswareId,
        requestBody,
        setHeaders
      )

      const orderswareAfterSearched = await models.OrdersWares.findOne({
        where: { id: orderswareId },
      })
      const orderswareAfter = orderswareAfterSearched.dataValues
      const orderswareDeleted = await models.OrdersWares.destroy({
        where: { id: orderswareId },
      })

      expect(status).to.equal(OK)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(` ordersware with id = ${orderswareId} was updated`)
      expect(orderswareAfter).to.include(requestBody)
      expect(new Date(orderswareBefore.updatedAt)).to.be.beforeTime(
        new Date(orderswareAfter.updatedAt)
      )
      expect(orderswareDeleted).to.equal(1)
    })
  })

  describe("Delete /:orderswareId", function () {
    it("When taget ordersware id exists, Then respective ordersware is deleted ", async function () {
      const orderswareCreated = await models.OrdersWares.create({})
      const newOrdersWare = orderswareCreated.dataValues
      const orderswareId = newOrdersWare.id

      const { status, data } = await client.delete(
        "/orderswares/" + orderswareId,
        setHeaders
      )

      const afterOrdersWareSearched = await models.OrdersWares.findOne({
        where: { id: orderswareId },
      })

      expect(status).to.equal(OK)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(
          ` has deleted a ordersware with id = ${orderswareId} and fullname = ${newOrdersWare.fullname}.`
        )
      expect(afterOrdersWareSearched).to.equal(null)
    })
  })
})
