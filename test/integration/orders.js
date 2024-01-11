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

describe("Orders Routes", function () {
  let client
  const setHeaders = { headers: {} }
  const orderObject = {
    type: "object",
    required: [
      "id",
      "providerId",
      "cost",
      "expectedAt",
      "actualAt",
      "createdAt",
      "updatedAt",
      "provider",
      "waresBought",
    ],
    properties: {
      provider: {
        type: "object",
        required: [
          "id",
          "name",
          "address",
          "phoneNumber",
          "createdAt",
          "updatedAt",
        ],
      },
      waresBought: {
        type: "array",
        items: {
          type: "object",
          required: [
            "wareId",
            "orderId",
            "amount",
            "cost",
            "returned",
            "createdAt",
            "updatedAt",
          ],
        },
      },
    },
  }

  const orderSchema = {
    title: "Order schema",
    ...orderObject,
  }

  const ordersSchema = {
    title: "Orders Schema",
    type: "array",
    items: {
      ...orderObject,
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

  describe("Get /:orderId", function () {
    it("When an existing order id is given, Then the response is the order", async function () {
      const orderId = Math.ceil(Math.random() * 2)

      const { status, data } = await client.get(
        "/orders/" + orderId,
        setHeaders
      )

      expect(status).to.equal(OK)
      expect(data).to.be.jsonSchema(orderSchema)
    })

    it("When an non-existing order id is given, Then the response is not found #paramOrderId", async function () {
      const orderId = Math.ceil(Math.random() * 10) + 2

      const { status, data } = await client.get(
        "/orders/" + orderId,
        setHeaders
      )

      expect(status).to.equal(NOT_FOUND)
      expect(data).to.equal("Order not found.")
    })

    it("When order id given is not an integer, Then the response is not found #integerValidator #paramOrderId", async function () {
      const orderId = "string"

      const { status, data } = await client.get(
        "/orders/" + orderId,
        setHeaders
      )

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal("Bad input request.")
    })
  })

  describe("Get /", function () {
    const allOrders = [
      {
        id: 2,
        providerId: 1,
        cost: 110,
        expectedAt: "2024-11-02T00:00:00.000Z",
        actualAt: null,
        createdAt: "2024-11-11T00:00:00.000Z",
        updatedAt: "2024-11-11T00:00:00.000Z",
        provider: {
          id: 1,
          name: "Amazon",
          address: "0000 online",
          phoneNumber: "1632474734",
          createdAt: "2024-11-11T00:00:00.000Z",
          updatedAt: "2024-11-11T00:00:00.000Z",
        },
        waresBought: [
          {
            amount: 1,
            cost: 100,
            createdAt: "2024-11-11T00:00:00.000Z",
            orderId: 2,
            returned: null,
            updatedAt: "2024-11-11T00:00:00.000Z",
            wareId: 5,
          },
        ],
      },
      {
        id: 1,
        providerId: 3,
        cost: 500,
        expectedAt: "2024-11-02T00:00:00.000Z",
        actualAt: "2024-11-09T00:00:00.000Z",
        createdAt: "2024-11-11T00:00:00.000Z",
        updatedAt: "2024-11-11T00:00:00.000Z",
        provider: {
          id: 3,
          name: "JCPenny",
          address: "84506 Deangelo Cliff",
          phoneNumber: "6192621956",
          createdAt: "2024-11-11T00:00:00.000Z",
          updatedAt: "2024-11-11T00:00:00.000Z",
        },
        waresBought: [
          {
            amount: 1,
            cost: 130,
            createdAt: "2024-11-11T00:00:00.000Z",
            orderId: 1,
            returned: null,
            updatedAt: "2024-11-11T00:00:00.000Z",
            wareId: 1,
          },
        ],
      },
    ]

    async function getOrdersIt(requestBody, expectedOrders = []) {
      expectedOrders = Array.isArray(expectedOrders)
        ? expectedOrders
        : [expectedOrders]
      const config = structuredClone(setHeaders)
      config.data = requestBody

      const { status, data: orders } = await client.get("/orders", config)

      expect(status).to.equal(OK)
      expect(orders).to.be.jsonSchema(ordersSchema)
      expect(orders).to.eql(expectedOrders)
    }

    it("When no inputs is provided, Then default query search is returned ", async function () {
      await getOrdersIt({}, allOrders)
    })

    it("When provider id is the only input, Then response all orders with the same provider id", async function () {
      await getOrdersIt({ providerId: 3 }, allOrders[1])
    })

    it("When cost is the only input, Then response all orders with the same cost", async function () {
      await getOrdersIt({ cost: 500 }, allOrders[1])
    })

    it("When an expected date is given, Then response is all orders within that same month and year", async function () {
      await getOrdersIt({ expectedAt: "2024-11-11" }, allOrders)
    })

    it("When an actual date is given, Then response is all orders within that same month and year", async function () {
      await getOrdersIt({ actualAt: new Date("2024-11-11") }, allOrders[1])
    })

    it("When a created at date is given, Then response is all orders within that same month and year", async function () {
      await getOrdersIt({ actualAt: new Date("2024-12-11") })
    })

    it("When a updated at date is given, Then response is all orders within that same month and year", async function () {
      await getOrdersIt({ updatedAt: new Date("2024-11-11") }, allOrders)
    })

    it("When multiple inputs are given, Then response is all orders that satisfy the input comparisons", async function () {
      await getOrdersIt(
        {
          providerId: 1,
          cost: 110,
          expectedAt: new Date("2024-11-02"),
          actualAt: null,
          createdAt: "2024-11-11",
          updatedAt: "2024-11-11",
        },
        allOrders[0]
      )
    })
  })

  describe("Post /", function () {
    it("When merchant inputs required values, Then order is created ", async function () {
      const requestBody = {
        providerId: Math.ceil(Math.random() * 4),
        cost: Math.ceil(Math.random() * 300) + 500,
        expectedAt: "2025-02-02",
        actualAt: null,
      }

      const { status, data } = await client.post(
        "/orders",
        requestBody,
        setHeaders
      )

      requestBody.expectedAt = new Date(requestBody.expectedAt).toISOString()
      const newOrderSearched = await models.Orders.findOne({
        where: requestBody,
      })
      const newOrder = newOrderSearched.dataValues
      const newOrderDeleted = await models.Orders.destroy({
        where: requestBody,
      })
      newOrder.expectedAt = newOrder.expectedAt.toISOString()

      expect(status).to.equal(CREATED)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(" order has been created.")
      expect(newOrder).to.include(requestBody)
      expect(newOrderDeleted).to.equal(1)
    })
  })

  describe("Put /:orderId", function () {
    it("When there are no inputs, Then response is bad request", async function () {
      const orderId = Math.ceil(Math.random() * 2)
      const requestBody = {}

      const { status, data } = await client.put(
        "/orders/" + orderId,
        requestBody,
        setHeaders
      )

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal("Bad input request.")
    })

    it("When inputs are given, Then order has the respective information updated", async function () {
      const newOrder = {
        providerId: Math.ceil(Math.random() * 4),
        cost: Math.ceil(Math.random() * 300) + 500,
        expectedAt: "2025-02-02",
        actualAt: null,
      }
      const orderBeforeCreated = await models.Orders.create(newOrder)
      const orderBefore = orderBeforeCreated.dataValues
      const orderId = orderBefore.id
      const requestBody = {
        providerId: Math.ceil(Math.random() * 4),
        cost: Math.ceil(Math.random() * 300) + 500,
        expectedAt: "2025-02-03",
        actualAt: "2025-02-04",
      }

      const { status, data } = await client.put(
        "/orders/" + orderId,
        requestBody,
        setHeaders
      )

      const orderAfterSearched = await models.Orders.findOne({
        where: { id: orderId },
      })
      const orderAfter = orderAfterSearched.dataValues
      const orderDeleted = await models.Orders.destroy({
        where: { id: orderId },
      })

      orderAfter.expectedAt = orderAfter.expectedAt.toISOString()
      orderAfter.actualAt = orderAfter.actualAt.toISOString()
      requestBody.expectedAt = new Date(requestBody.expectedAt).toISOString()
      requestBody.actualAt = new Date(requestBody.actualAt).toISOString()

      expect(status).to.equal(OK)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(` order with id = ${orderId} was updated`)
      expect(orderAfter).to.include(requestBody)
      expect(new Date(orderBefore.updatedAt)).to.be.beforeTime(
        new Date(orderAfter.updatedAt)
      )
      expect(orderDeleted).to.equal(1)
    })
  })

  describe("Delete /:orderId", function () {
    it("When taget order id exists, Then respective order is deleted ", async function () {
      const orderCreated = await models.Orders.create({
        providerId: Math.ceil(Math.random() * 4),
        cost: Math.ceil(Math.random() * 300) + 500,
        expectedAt: "2025-01-02",
        actualAt: null,
      })
      const newOrder = orderCreated.dataValues
      const orderId = newOrder.id

      const { status, data } = await client.delete(
        "/orders/" + orderId,
        setHeaders
      )

      const afterOrderSearched = await models.Orders.findOne({
        where: { id: orderId },
      })

      expect(status).to.equal(OK)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(
          ` has deleted a order with id = ${orderId} and fullname = ${newOrder.fullname}.`
        )
      expect(afterOrderSearched).to.equal(null)
    })
  })
})
