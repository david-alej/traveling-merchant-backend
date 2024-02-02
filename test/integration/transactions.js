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
  round,
} = require("../common")

const { OK, NOT_FOUND, BAD_REQUEST, CREATED } = httpStatusCodes

describe("Transactions Routes", function () {
  let client
  const setHeaders = { headers: {} }
  const transactionSoldObject = {
    type: "object",
    required: [
      "id",
      "ticketId",
      "orderId",
      "paidAt",
      "payment",
      "paymentType",
      "createdAt",
      "updatedAt",
      "ticket",
    ],
    properties: {
      ticket: {
        type: "object",
        required: [
          "id",
          "clientId",
          "cost",
          "paymentPlan",
          "description",
          "createdAt",
          "updatedAt",
          "owed",
        ],
      },
    },
  }

  const transactionSoldSchema = {
    title: "Transaction schema",
    ...transactionSoldObject,
  }

  const transactionBoughtObject = {
    type: "object",
    required: [
      "id",
      "ticketId",
      "orderId",
      "paidAt",
      "payment",
      "paymentType",
      "createdAt",
      "updatedAt",
      "order",
    ],
    properties: {
      order: {
        type: "object",
        required: [
          "id",
          "providerId",
          "cost",
          "tax",
          "shipment",
          "expectedAt",
          "actualAt",
          "createdAt",
          "updatedAt",
        ],
      },
    },
  }

  const transactionBoughtSchema = {
    title: "Transaction schema",
    ...transactionBoughtObject,
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

  describe("Get /:transactionId", function () {
    it("When an existing transaction id is given, Then the response is the transaction", async function () {
      const transactionId = Math.ceil(Math.random() * 6)

      const { status, data } = await client.get(
        "/transactions/" + transactionId,
        setHeaders
      )

      expect(status).to.equal(OK)
      if (data.ticketId) {
        expect(data).to.be.jsonSchema(transactionSoldSchema)
      } else {
        expect(data).to.be.jsonSchema(transactionBoughtSchema)
      }
    })

    it("When an non-existing transaction id is given, Then the response is not found #paramTransactionId", async function () {
      const transactionId = Math.ceil(Math.random() * 10) + 20

      const { status, data } = await client.get(
        "/transactions/" + transactionId,
        setHeaders
      )

      expect(status).to.equal(NOT_FOUND)
      expect(data).to.equal("Transaction not found.")
    })

    it("When transaction id given is not an integer, Then the response is not found #integerValidator #paramTransactionId", async function () {
      const transactionId = "string"

      const { status, data } = await client.get(
        "/transactions/" + transactionId,
        setHeaders
      )

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal("Bad input request.")
    })
  })

  describe("Get /", function () {
    const allTransactions = [
      {
        id: 8,
        ticketId: null,
        orderId: 1,
        payment: 1450,
        paymentType: "visa",
        paidAt: "2025-01-17T00:00:00.000Z",
        createdAt: "2025-01-17T00:00:00.000Z",
        updatedAt: "2025-01-17T00:00:00.000Z",
        ticket: null,
        order: {
          id: 1,
          providerId: 1,
          cost: 3413.65,
          tax: 283.65,
          shipment: 50,
          expectedAt: "2025-01-08T00:00:00.000Z",
          actualAt: "2025-01-09T00:00:00.000Z",
          createdAt: "2025-01-01T00:00:00.000Z",
          updatedAt: "2025-01-01T00:00:00.000Z",
        },
      },
      {
        id: 7,
        ticketId: 3,
        orderId: null,
        payment: -155,
        paymentType: "cash app",
        paidAt: "2025-01-17T00:00:00.000Z",
        createdAt: "2025-01-17T00:00:00.000Z",
        updatedAt: "2025-01-17T00:00:00.000Z",
        ticket: {
          id: 3,
          clientId: 4,
          cost: 168.27,
          paymentPlan: "lump sum",
          description: "",
          createdAt: "2025-01-13T00:00:00.000Z",
          updatedAt: "2025-01-13T00:00:00.000Z",
          paid: 13.27,
          returned: 155,
          owed: 0,
        },
        order: null,
      },
      {
        id: 6,
        ticketId: 1,
        orderId: null,
        payment: 86.9,
        paymentType: "visa",
        paidAt: "2025-01-16T00:00:00.000Z",
        createdAt: "2025-01-16T00:00:00.000Z",
        updatedAt: "2025-01-16T00:00:00.000Z",
        ticket: {
          id: 1,
          clientId: 2,
          cost: 391.9,
          paymentPlan: "weekly",
          description: "",
          createdAt: "2025-01-09T00:00:00.000Z",
          updatedAt: "2025-01-09T00:00:00.000Z",
          paid: 236.9,
          returned: 155,
          owed: 0,
        },
        order: null,
      },
      {
        id: 5,
        ticketId: 3,
        orderId: null,
        payment: 168.27,
        paymentType: "cash",
        paidAt: "2025-01-13T00:00:00.000Z",
        createdAt: "2025-01-13T00:00:00.000Z",
        updatedAt: "2025-01-13T00:00:00.000Z",
        ticket: {
          id: 3,
          clientId: 4,
          cost: 168.27,
          paymentPlan: "lump sum",
          description: "",
          createdAt: "2025-01-13T00:00:00.000Z",
          updatedAt: "2025-01-13T00:00:00.000Z",
          paid: 13.27,
          returned: 155,
          owed: 0,
        },
        order: null,
      },
      {
        id: 4,
        ticketId: 2,
        orderId: null,
        payment: 200,
        paymentType: "visa",
        paidAt: "2025-01-09T00:00:00.000Z",
        createdAt: "2025-01-09T00:00:00.000Z",
        updatedAt: "2025-01-09T00:00:00.000Z",
        ticket: {
          id: 2,
          clientId: 3,
          cost: 488.52,
          paymentPlan: "biweekly",
          description: "",
          createdAt: "2025-01-09T00:00:00.000Z",
          updatedAt: "2025-01-09T00:00:00.000Z",
          paid: 200,
          returned: 0,
          owed: 288.52,
        },
        order: null,
      },
      {
        id: 3,
        ticketId: 1,
        orderId: null,
        payment: 150,
        paymentType: "cash app",
        paidAt: "2025-01-09T00:00:00.000Z",
        createdAt: "2025-01-09T00:00:00.000Z",
        updatedAt: "2025-01-09T00:00:00.000Z",
        ticket: {
          id: 1,
          clientId: 2,
          cost: 391.9,
          paymentPlan: "weekly",
          description: "",
          createdAt: "2025-01-09T00:00:00.000Z",
          updatedAt: "2025-01-09T00:00:00.000Z",
          paid: 236.9,
          returned: 155,
          owed: 0,
        },
        order: null,
      },
      {
        id: 2,
        ticketId: null,
        orderId: 2,
        payment: 959.59,
        paymentType: "visa",
        paidAt: "2025-01-01T20:00:00.000Z",
        createdAt: "2025-01-01T00:00:00.000Z",
        updatedAt: "2025-01-01T00:00:00.000Z",
        ticket: null,
        order: {
          id: 2,
          providerId: 2,
          cost: 959.59,
          tax: 89.59,
          shipment: 20,
          expectedAt: "2025-01-09T00:00:00.000Z",
          actualAt: "2025-01-09T00:00:00.000Z",
          createdAt: "2025-01-01T00:00:00.000Z",
          updatedAt: "2025-01-17T00:00:00.000Z",
        },
      },
      {
        id: 1,
        ticketId: null,
        orderId: 1,
        payment: 3413.65,
        paymentType: "visa",
        paidAt: "2025-01-01T20:00:00.000Z",
        createdAt: "2025-01-01T00:00:00.000Z",
        updatedAt: "2025-01-01T00:00:00.000Z",
        ticket: null,
        order: {
          id: 1,
          providerId: 1,
          cost: 3413.65,
          tax: 283.65,
          shipment: 50,
          expectedAt: "2025-01-08T00:00:00.000Z",
          actualAt: "2025-01-09T00:00:00.000Z",
          createdAt: "2025-01-01T00:00:00.000Z",
          updatedAt: "2025-01-01T00:00:00.000Z",
        },
      },
    ]

    async function getTransactionsIt(
      requestBody,
      expectedTransactions = [],
      isPrinted = false
    ) {
      expectedTransactions = Array.isArray(expectedTransactions)
        ? expectedTransactions
        : [expectedTransactions]
      const config = structuredClone(setHeaders)
      config.data = requestBody

      const { status, data: transactions } = await client.get(
        "/transactions",
        config
      )

      if (isPrinted) {
        console.log("[")

        for (const transaction of transactions) console.log(transaction, "\n,")

        console.log("]")
      }

      expect(status).to.equal(OK)
      transactions.forEach((transaction) => {
        if (transaction.ticketId) {
          expect(transaction).to.be.jsonSchema(transactionSoldSchema)

          return
        }

        expect(transaction).to.be.jsonSchema(transactionBoughtSchema)
      })
      expect(transactions).to.eql(expectedTransactions)
    }

    it("When no inputs is provided, Then default query search is returned ", async function () {
      await getTransactionsIt({}, allTransactions)
    })

    it("When ticket id is the only input, Then response all providers with the respectived id are returned", async function () {
      await getTransactionsIt({ ticketId: 2 }, allTransactions[4])
    })

    it("When order id is the only input, Then response all providers with the respectived id are returned", async function () {
      await getTransactionsIt({ orderId: 1 }, [
        allTransactions[0],
        allTransactions[7],
      ])
    })

    it("When payment is the only input, Then response all providers with the same payment are returned", async function () {
      await getTransactionsIt({ payment: 959.59 }, allTransactions[6])
    })

    it("When paymentType is the only input, Then response all providers with the payment type that includes the subtring entered", async function () {
      await getTransactionsIt({ paymentType: "cash" }, [
        allTransactions[1],
        allTransactions[3],
        allTransactions[5],
      ])
    })

    it("When a paidAt date is given, Then response is all transactions within that same month and year", async function () {
      await getTransactionsIt(
        { paidAt: new Date("2025-01-2") },
        allTransactions
      )
    })

    it("When a created at date is given, Then response is all transactions within that same month and year", async function () {
      await getTransactionsIt({ createdAt: new Date("2024-11-11") })
    })

    it("When a updated at date is given, Then response is all transactions within that same month and year", async function () {
      await getTransactionsIt(
        { updatedAt: new Date("2025-01-02") },
        allTransactions
      )
    })

    it("When multiple inputs are given, Then response is all transactions that satisfy the input comparisons", async function () {
      await getTransactionsIt(
        {
          ticketId: 3,
          payment: -155,
          paymentType: "cash app",
          paidAt: "2025-01-17",
          createdAt: "2025-01-17",
          updatedAt: "2025-01-17",
        },
        allTransactions[1]
      )
    })
  })

  describe("Post /", function () {
    it("When you include both orderId and ticketId into the inputs, Then response is bad request #foreignKeyValidation", async function () {
      const requestBody = {
        ticketId: Math.ceil(Math.random() * 2),
        orderId: Math.ceil(Math.random() * 2),
      }

      const { status, data } = await client.post(
        "/transactions",
        requestBody,
        setHeaders
      )

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal("Bad input request.")
    })

    it("When you do not include either orderId or ticketId into the inputs, Then response is bad request #foreignKeyValidation", async function () {
      const paidAt = "2030-02-22"
      const requestBody = {
        payment: round(Math.random() * 100),
        paymentType: "cash",
        paidAt,
      }

      const { status, data } = await client.post(
        "/transactions",
        requestBody,
        setHeaders
      )

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal("Bad input request.")
    })

    it("When merchant inputs required values for a transactions on a ticket, Then transaction is created ", async function () {
      const paidAt = "2024-12-11"
      const requestBody = {
        ticketId: 2,
        payment: round(Math.random() * 300),
        paymentType: "venmo",
        paidAt,
      }

      const { status, data } = await client.post(
        "/transactions",
        requestBody,
        setHeaders
      )

      delete requestBody.paidAt
      const newTransactionSearched = await models.Transactions.findOne({
        where: requestBody,
      })
      const newTransaction = newTransactionSearched.dataValues
      const newTransactionDeleted = await models.Transactions.destroy({
        where: requestBody,
      })

      expect(status).to.equal(CREATED)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(" transaction has been created.")
      expect(newTransaction).to.include(requestBody)
      expect(new Date(paidAt)).to.equalDate(new Date(newTransaction.paidAt))
      expect(newTransactionDeleted).to.equal(1)
    })

    it("When merchant inputs required values for a transactions on an order, Then transaction is created ", async function () {
      const paidAt = "2025-02-22"
      const requestBody = {
        orderId: 2,
        payment: round(Math.random() * 100),
        paymentType: "cash",
        paidAt,
      }

      const { status, data } = await client.post(
        "/transactions",
        requestBody,
        setHeaders
      )

      delete requestBody.paidAt
      const newTransactionSearched = await models.Transactions.findOne({
        where: requestBody,
      })
      const newTransaction = newTransactionSearched.dataValues
      const newTransactionDeleted = await models.Transactions.destroy({
        where: requestBody,
      })

      expect(status).to.equal(CREATED)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(" transaction has been created.")
      expect(newTransaction).to.include(requestBody)
      expect(new Date(paidAt)).to.equalDate(new Date(newTransaction.paidAt))
      expect(newTransactionDeleted).to.equal(1)
    })
  })

  describe("Put /:transactionId", function () {
    it("When there are no inputs, Then response is bad request", async function () {
      const transactionId = Math.ceil(Math.random() * 3)
      const requestBody = {}

      const { status, data } = await client.put(
        "/transactions/" + transactionId,
        requestBody,
        setHeaders
      )

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal("Bad input request.")
    })

    it("When inputs are given for a ticket transaction, Then transaction has the respective information updated", async function () {
      const transactionBeforeCreated = await models.Transactions.create({
        ticketId: 1,
        payment: round(Math.random() * 150),
        paymentType: "cash",
        paidAt: new Date("2025-01-02"),
      })
      const transactionBefore = transactionBeforeCreated.dataValues
      const transactionId = transactionBefore.id
      let paidAt = "2025-01-02"
      const requestBody = {
        ticketId: 2,
        payment: round(Math.random() * 150),
        paymentType: "cash",
        paidAt,
      }

      const { status, data } = await client.put(
        "/transactions/" + transactionId,
        requestBody,
        setHeaders
      )

      paidAt = new Date(paidAt)
      delete requestBody.paidAt
      requestBody.orderId = null
      const transactionAfterSearched = await models.Transactions.findOne({
        where: { id: transactionId },
      })
      const transactionAfter = transactionAfterSearched.dataValues
      const transactionDeleted = await models.Transactions.destroy({
        where: { id: transactionId },
      })

      expect(status).to.equal(OK)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(` transaction with id = ${transactionId} was updated`)
      expect(transactionAfter).to.include(requestBody)
      expect(new Date(transactionBefore.updatedAt)).to.be.beforeTime(
        new Date(transactionAfter.updatedAt)
      )
      expect(paidAt).to.be.equalTime(transactionAfter.paidAt)
      expect(transactionDeleted).to.equal(1)
    })

    it("When inputs are given for an order transaction, Then transaction has the respective information updated", async function () {
      const transactionBeforeCreated = await models.Transactions.create({
        ticketId: 1,
        payment: round(Math.random() * 150),
        paymentType: "cash",
        paidAt: new Date("2025-01-02"),
      })
      const transactionBefore = transactionBeforeCreated.dataValues
      const transactionId = transactionBefore.id
      let paidAt = "2025-01-02"
      const requestBody = {
        orderId: 2,
        payment: round(Math.random() * 150),
        paymentType: "cash",
        paidAt,
      }

      const { status, data } = await client.put(
        "/transactions/" + transactionId,
        requestBody,
        setHeaders
      )

      paidAt = new Date(paidAt)
      delete requestBody.paidAt
      requestBody.ticketId = null
      const transactionAfterSearched = await models.Transactions.findOne({
        where: { id: transactionId },
      })
      const transactionAfter = transactionAfterSearched.dataValues
      const transactionDeleted = await models.Transactions.destroy({
        where: { id: transactionId },
      })

      expect(status).to.equal(OK)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(` transaction with id = ${transactionId} was updated`)
      expect(transactionAfter).to.include(requestBody)
      expect(new Date(transactionBefore.updatedAt)).to.be.beforeTime(
        new Date(transactionAfter.updatedAt)
      )
      expect(paidAt).to.be.equalTime(transactionAfter.paidAt)
      expect(transactionDeleted).to.equal(1)
    })
  })

  describe("Delete /:transactionId", function () {
    it("When taget transaction id exists, Then respective transaction is deleted ", async function () {
      const transactionCreated = await models.Transactions.create({
        ticketId: 2,
        payment: round(Math.random() * 150),
        paymentType: "cash",
        paidAt: new Date("2025-01-02"),
      })
      const newTransaction = transactionCreated.dataValues
      const transactionId = newTransaction.id

      const { status, data } = await client.delete(
        "/transactions/" + transactionId,
        setHeaders
      )

      const afterTransactionSearched = await models.Transactions.findOne({
        where: { id: transactionId },
      })

      expect(status).to.equal(OK)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(
          ` has deleted a transaction with id = ${transactionId} and fullname = ${newTransaction.fullname}.`
        )
      expect(afterTransactionSearched).to.equal(null)
    })
  })
})
