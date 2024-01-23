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

describe.only("Transactions Routes", function () {
  let client
  const setHeaders = { headers: {} }
  const transactionObject = {
    type: "object",
    required: ["id", "createdAt", "updatedAt"],
    properties: {},
  }

  const transactionSchema = {
    title: "Transaction schema",
    ...transactionObject,
  }

  const transactionsSchema = {
    title: "Transactions Schema",
    type: "array",
    items: {
      ...transactionObject,
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

  describe.only("Get /:transactionId", function () {
    it("When an existing transaction id is given, Then the response is the transaction", async function () {
      const transactionId = Math.ceil(Math.random() * 3)

      const { status, data } = await client.get(
        "/transactions/" + transactionId,
        setHeaders
      )
      console.log(data)
      expect(status).to.equal(OK)
      expect(data).to.be.jsonSchema(transactionSchema)
    })

    it("When an non-existing transaction id is given, Then the response is not found #paramTransactionId", async function () {
      const transactionId = Math.ceil(Math.random() * 10) + 3

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
    const allTransactions = []

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

      const { status, data: transactions } = await client.get("/transactions", config)

      if (isPrinted) {
        console.log("[")

        for (const transaction of transactions) console.log(transaction, "\n,")

        console.log("]")
      }

      expect(status).to.equal(OK)
      expect(transactions).to.be.jsonSchema(transactionsSchema)
      expect(transactions).to.eql(expectedTransactions)
    }

    it("When no inputs is provided, Then default query search is returned ", async function () {
      await getTransactionsIt({}, allTransactions, true)
    })

    it("When a created at date is given, Then response is all transactions within that same month and year", async function () {
      await getTransactionsIt({ createdAt: new Date("2024-11-11") }, allTransactions)
    })

    it("When a updated at date is given, Then response is all transactions within that same month and year", async function () {
      await getTransactionsIt({ updatedAt: new Date("2024-12-10") }, allTransactions)
    })

    it("When multiple inputs are given, Then response is all transactions that satisfy the input comparisons", async function () {
      await getTransactionsIt(
        { createdAt: "2024-11-11", updatedAt: "2024-12-11" },
        allTransactions
      )
    })
  })

  describe("Post /", function () {
    it("When merchant inputs required values, Then transaction is created ", async function () {
      const requestBody = {}

      const { status, data } = await client.post(
        "/transactions",
        requestBody,
        setHeaders
      )

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

    it("When inputs are given, Then transaction has the respective information updated", async function () {
      const transactionBeforeCreated = await models.Transactions.create({})
      const transactionBefore = transactionBeforeCreated.dataValues
      const transactionId = transactionBefore.id
      const requestBody = {}

      const { status, data } = await client.put(
        "/transactions/" + transactionId,
        requestBody,
        setHeaders
      )

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
      expect(transactionDeleted).to.equal(1)
    })
  })

  describe("Delete /:transactionId", function () {
    it("When taget transaction id exists, Then respective transaction is deleted ", async function () {
      const transactionCreated = await models.Transactions.create({})
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
