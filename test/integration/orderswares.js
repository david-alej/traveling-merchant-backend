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
  faker,
} = require("../common")

const { OK, NOT_FOUND, BAD_REQUEST, CREATED } = httpStatusCodes

describe.only("OrdersWares Routes", function () {
  let client
  const setHeaders = { headers: {} }
  const orderswareObject = {
    type: "object",
    required: [
      "orderId",
      "wareId",
      "amount",
      "cost",
      "returned",
      "createdAt",
      "updatedAt",
      "order",
      "wareBought",
    ],
    properties: {
      order: {
        type: "object",
        required: [
          "id",
          "providerId",
          "cost",
          "expectedAt",
          "actualAt",
          "createdAt",
          "updatedAt",
        ],
      },
      wareBought: {
        type: "object",
        required: [
          "id",
          "name",
          "type",
          "tags",
          "stock",
          "cost",
          "createdAt",
          "updatedAt",
        ],
      },
    },
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
    it("When an existing order id and ware id is given, Then the response is the ordersware", async function () {
      const orderId = 1
      const wareId = [1, 3][Math.floor(Math.random() * 2)]

      const { status, data } = await client.get(
        `/orderswares/${orderId}/${wareId}`,
        setHeaders
      )

      expect(status).to.equal(OK)
      expect(data).to.be.jsonSchema(orderswareSchema)
    })

    it("When an non-existing id for order id or ware id is given, Then the response is not found #paramOrdersWareId", async function () {
      const orderId = Math.ceil(Math.random() * 3) + 2
      const wareId = Math.ceil(Math.random() * 4)

      const { status, data } = await client.get(
        `/orderswares/${orderId}/${wareId}`,
        setHeaders
      )

      expect(status).to.equal(NOT_FOUND)
      expect(data).to.equal("OrdersWare not found.")
    })

    it("When order id or ware id given is not an integer, Then the response is not found #integerValidator #paramOrdersWareId", async function () {
      const orderId = "hi"
      const wareId = Math.ceil(Math.random() * 4)

      const { status, data } = await client.get(
        `/orderswares/${orderId}/${wareId}`,
        setHeaders
      )

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal("Bad input request.")
    })
  })

  describe("Get /", function () {
    const allOrdersWares = [
      {
        wareId: 1,
        orderId: 1,
        amount: 1,
        cost: 130,
        returned: 0,
        createdAt: "2024-11-11T00:00:00.000Z",
        updatedAt: "2024-11-11T00:00:00.000Z",
        order: {
          id: 1,
          providerId: 3,
          cost: 500,
          expectedAt: "2024-11-02T00:00:00.000Z",
          actualAt: "2024-11-09T00:00:00.000Z",
          createdAt: "2024-11-11T00:00:00.000Z",
          updatedAt: "2024-11-11T00:00:00.000Z",
        },
        wareBought: {
          id: 1,
          name: "Loewe 001 Woman Perfume",
          type: "perfume",
          tags: ["women", "1-pc"],
          stock: 1,
          cost: 155,
          createdAt: "2024-11-11T00:00:00.000Z",
          updatedAt: "2024-11-11T00:00:00.000Z",
        },
      },
      {
        wareId: 3,
        orderId: 1,
        amount: 1,
        cost: 350,
        returned: 0,
        createdAt: "2024-11-11T00:00:00.000Z",
        updatedAt: "2024-11-11T00:00:00.000Z",
        order: {
          id: 1,
          providerId: 3,
          cost: 500,
          expectedAt: "2024-11-02T00:00:00.000Z",
          actualAt: "2024-11-09T00:00:00.000Z",
          createdAt: "2024-11-11T00:00:00.000Z",
          updatedAt: "2024-11-11T00:00:00.000Z",
        },
        wareBought: {
          id: 3,
          name: "The Leather Medium Tote Bag",
          type: "bag",
          tags: ["women"],
          stock: 2,
          cost: 450,
          createdAt: "2024-11-11T00:00:00.000Z",
          updatedAt: "2024-11-11T00:00:00.000Z",
        },
      },
      {
        wareId: 5,
        orderId: 2,
        amount: 1,
        cost: 100,
        returned: 0,
        createdAt: "2024-11-11T00:00:00.000Z",
        updatedAt: "2024-11-11T00:00:00.000Z",
        order: {
          id: 2,
          providerId: 1,
          cost: 110,
          expectedAt: "2024-11-02T00:00:00.000Z",
          actualAt: null,
          createdAt: "2024-11-11T00:00:00.000Z",
          updatedAt: "2024-11-11T00:00:00.000Z",
        },
        wareBought: {
          id: 5,
          name: "Eymi Unisex Leather Braclet with Infinity Sign Symbolic Love Fashion Braided Wristband Bangle",
          type: "braclet",
          tags: ["unisex"],
          stock: 4,
          cost: 14,
          createdAt: "2024-11-11T00:00:00.000Z",
          updatedAt: "2024-11-11T00:00:00.000Z",
        },
      },
    ]

    async function getOrdersWaresIt(requestBody, expectedOrdersWares = []) {
      expectedOrdersWares = Array.isArray(expectedOrdersWares)
        ? expectedOrdersWares
        : [expectedOrdersWares]
      const config = structuredClone(setHeaders)
      config.data = requestBody

      const { status, data: orderswares } = await client.get(
        "/orderswares",
        config
      )

      expect(status).to.equal(OK)
      expect(orderswares).to.be.jsonSchema(orderswaresSchema)
      expect(orderswares).to.eql(expectedOrdersWares)
    }

    it("When no inputs is provided, Then default query search is returned ", async function () {
      await getOrdersWaresIt({}, allOrdersWares)
    })

    it("When order id is the only input, Then response all orders with the same provider id", async function () {
      await getOrdersWaresIt({ orderId: 1 }, allOrdersWares.slice(0, -1))
    })

    it("When ware id is the only input, Then response all orders with the same provider id", async function () {
      await getOrdersWaresIt({ wareId: 3 }, allOrdersWares[1])
    })

    it("When a created at date is given, Then response is all orderswares within that same month and year", async function () {
      await getOrdersWaresIt(
        { createdAt: new Date("2024-11-11") },
        allOrdersWares
      )
    })

    it("When a updated at date is given, Then response is all orderswares within that same month and year", async function () {
      await getOrdersWaresIt({ updatedAt: new Date("2024-12-10") })
    })

    it("When multiple inputs are given, Then response is all orderswares that satisfy the input comparisons", async function () {
      await getOrdersWaresIt(
        {
          orderId: 1,
          wareId: 1,
          cost: 130,
          amount: 1,
          returned: null,
          createdAt: "2024-11-11",
          updatedAt: "2024-11-11",
        },
        allOrdersWares[0]
      )
    })
  })

  describe("Post /", function () {
    it("When merchant inputs required values, Then ordersware is created ", async function () {
      const orderId = Math.ceil(Math.random() * 2)
      const requestBody = {
        orderId,
        wareId:
          orderId === 1
            ? [2, 4][Math.floor(Math.random() * 2)]
            : Math.ceil(Math.random() * 4),
        cost: Math.ceil(Math.random() * 750) + 250,
        amount: Math.ceil(Math.random() * 3),
      }

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

  describe("Put /:orderId/:wareId", function () {
    it("When there are no inputs, Then response is bad request", async function () {
      const orderId = 1
      const wareId = [1, 3][Math.floor(Math.random() * 2)]
      const requestBody = {}

      const { status, data } = await client.put(
        `/orderswares/${orderId}/${wareId}`,
        requestBody,
        setHeaders
      )

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal("Bad input request.")
    })

    it("When inputs are given, Then ordersware has the respective information updated", async function () {
      const newOrder = await models.Orders.create({
        providerId: Math.ceil(Math.random() * 4),
        cost: Math.ceil(Math.random() * 300) + 500,
        expectedAt: faker.date.future().toISOString(),
        actualAt: null,
      })

      const orderId = newOrder.dataValues.id
      const wareId = Math.ceil(Math.random() * 4)
      const newOrdersWare = {
        orderId,
        wareId,
        cost: Math.ceil(Math.random() * 750) + 250,
        amount: Math.ceil(Math.random() * 3),
      }
      const orderswareBeforeCreated = await models.OrdersWares.create(
        newOrdersWare
      )
      const orderswareBefore = orderswareBeforeCreated.dataValues
      const requestBody = {
        cost: Math.ceil(Math.random() * 750) + 250,
        amount: Math.ceil(Math.random() * 3) + 1,
        returned: 1,
      }

      const { status, data } = await client.put(
        `/orderswares/${orderswareBefore.orderId}/${orderswareBefore.wareId}`,
        requestBody,
        setHeaders
      )

      const orderswareAfterSearched = await models.OrdersWares.findOne({
        where: {
          orderId,
          wareId,
        },
      })
      const orderswareAfter = orderswareAfterSearched.dataValues
      const orderswareDeleted = await models.OrdersWares.destroy({
        where: {
          orderId,
          wareId,
        },
      })

      expect(status).to.equal(OK)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(
          ` ordersware with order id = ${orderId} and ware id of ${wareId} was updated`
        )
      expect(orderswareAfter).to.include(requestBody)
      expect(new Date(orderswareBefore.updatedAt)).to.be.beforeTime(
        new Date(orderswareAfter.updatedAt)
      )
      expect(orderswareDeleted).to.equal(1)
    })
  })

  describe("Delete /:orderId/:wareId", function () {
    it("When taget ordersware id exists, Then respective ordersware is deleted ", async function () {
      const newOrder = await models.Orders.create({
        providerId: Math.ceil(Math.random() * 4),
        cost: Math.ceil(Math.random() * 300) + 500,
        expectedAt: faker.date.future().toISOString(),
        actualAt: null,
      })
      const orderId = newOrder.dataValues.id
      const wareId = Math.ceil(Math.random() * 4)
      await models.OrdersWares.create({
        orderId,
        wareId,
        cost: Math.ceil(Math.random() * 750) + 250,
        amount: Math.ceil(Math.random() * 3),
      })

      const { status, data } = await client.delete(
        `/orderswares/${orderId}/${wareId}`,
        setHeaders
      )

      const afterOrdersWareSearched = await models.OrdersWares.findOne({
        where: { orderId, wareId },
      })

      expect(status).to.equal(OK)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(
          ` has deleted a ordersware with order id = ${orderId} and ware id of ${wareId}.`
        )
      expect(afterOrdersWareSearched).to.equal(null)
    })
  })

  describe("Delete /", function () {
    it("When order id exists, Then all orderswares rows with respective order id are deleted ", async function () {
      const newOrder = await models.Orders.create({
        providerId: Math.ceil(Math.random() * 4),
        cost: Math.ceil(Math.random() * 300) + 500,
        expectedAt: faker.date.future().toISOString(),
        actualAt: null,
      })
      const orderId = newOrder.dataValues.id
      await models.OrdersWares.create({
        orderId,
        wareId: Math.ceil(Math.random() * 2),
        cost: Math.ceil(Math.random() * 750) + 250,
        amount: Math.ceil(Math.random() * 3),
      })
      await models.OrdersWares.create({
        orderId,
        wareId: Math.ceil(Math.random() * 2) + 2,
        cost: Math.ceil(Math.random() * 750) + 250,
        amount: Math.ceil(Math.random() * 3),
      })
      const config = structuredClone(setHeaders)
      config.data = { orderId }

      const { status, data } = await client.delete("/orderswares/", config)

      const afterOrdersWareSearched = await models.OrdersWares.findAll({
        where: { orderId },
      })

      expect(status).to.equal(OK)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(` has deleted a ordersware with order id = ${orderId}.`)
      expect(afterOrdersWareSearched).to.eql([])
    })
  })
})
