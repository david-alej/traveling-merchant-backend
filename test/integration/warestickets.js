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

describe.only("WaresTickets Routes", function () {
  let client
  const setHeaders = { headers: {} }
  const waresticketObject = {
    type: "object",
    required: ["id", "createdAt", "updatedAt"],
    properties: {},
  }

  const waresticketSchema = {
    title: "WaresTicket schema",
    ...waresticketObject,
  }

  const waresticketsSchema = {
    title: "WaresTickets Schema",
    type: "array",
    items: {
      ...waresticketObject,
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

  describe.only("Get /:waresticketId", function () {
    it("When an existing waresticket id is given, Then the response is the waresticket", async function () {
      const waresticketId = Math.ceil(Math.random() * 3)

      const { status, data } = await client.get(
        "/warestickets/" + waresticketId,
        setHeaders
      )
      console.log(data)
      expect(status).to.equal(OK)
      expect(data).to.be.jsonSchema(waresticketSchema)
    })

    it("When an non-existing waresticket id is given, Then the response is not found #paramWaresTicketId", async function () {
      const waresticketId = Math.ceil(Math.random() * 10) + 3

      const { status, data } = await client.get(
        "/warestickets/" + waresticketId,
        setHeaders
      )

      expect(status).to.equal(NOT_FOUND)
      expect(data).to.equal("WaresTicket not found.")
    })

    it("When waresticket id given is not an integer, Then the response is not found #integerValidator #paramWaresTicketId", async function () {
      const waresticketId = "string"

      const { status, data } = await client.get(
        "/warestickets/" + waresticketId,
        setHeaders
      )

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal("Bad input request.")
    })
  })

  describe("Get /", function () {
    const allWaresTickets = []

    async function getWaresTicketsIt(
      requestBody,
      expectedWaresTickets = [],
      isPrinted = false
    ) {
      expectedWaresTickets = Array.isArray(expectedWaresTickets)
        ? expectedWaresTickets
        : [expectedWaresTickets]
      const config = structuredClone(setHeaders)
      config.data = requestBody

      const { status, data: warestickets } = await client.get("/warestickets", config)

      if (isPrinted) {
        console.log("[")

        for (const waresticket of warestickets) console.log(waresticket, "\n,")

        console.log("]")
      }

      expect(status).to.equal(OK)
      expect(warestickets).to.be.jsonSchema(waresticketsSchema)
      expect(warestickets).to.eql(expectedWaresTickets)
    }

    it("When no inputs is provided, Then default query search is returned ", async function () {
      await getWaresTicketsIt({}, allWaresTickets, true)
    })

    it("When a created at date is given, Then response is all warestickets within that same month and year", async function () {
      await getWaresTicketsIt({ createdAt: new Date("2024-11-11") }, allWaresTickets)
    })

    it("When a updated at date is given, Then response is all warestickets within that same month and year", async function () {
      await getWaresTicketsIt({ updatedAt: new Date("2024-12-10") })
    })

    it("When multiple inputs are given, Then response is all warestickets that satisfy the input comparisons", async function () {
      await getWaresTicketsIt(
        { createdAt: "2024-11-11", updatedAt: "2024-12-11" },
        allWaresTickets
      )
    })
  })

  describe("Post /", function () {
    it("When merchant inputs required values, Then waresticket is created ", async function () {
      const requestBody = {}

      const { status, data } = await client.post(
        "/warestickets",
        requestBody,
        setHeaders
      )

      const newWaresTicketSearched = await models.WaresTickets.findOne({
        where: requestBody,
      })
      const newWaresTicket = newWaresTicketSearched.dataValues
      const newWaresTicketDeleted = await models.WaresTickets.destroy({
        where: requestBody,
      })

      expect(status).to.equal(CREATED)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(" waresticket has been created.")
      expect(newWaresTicket).to.include(requestBody)
      expect(newWaresTicketDeleted).to.equal(1)
    })
  })

  describe("Put /:waresticketId", function () {
    it("When there are no inputs, Then response is bad request", async function () {
      const waresticketId = Math.ceil(Math.random() * 3)
      const requestBody = {}

      const { status, data } = await client.put(
        "/warestickets/" + waresticketId,
        requestBody,
        setHeaders
      )

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal("Bad input request.")
    })

    it("When inputs are given, Then waresticket has the respective information updated", async function () {
      const waresticketBeforeCreated = await models.WaresTickets.create({})
      const waresticketBefore = waresticketBeforeCreated.dataValues
      const waresticketId = waresticketBefore.id
      const requestBody = {}

      const { status, data } = await client.put(
        "/warestickets/" + waresticketId,
        requestBody,
        setHeaders
      )

      const waresticketAfterSearched = await models.WaresTickets.findOne({
        where: { id: waresticketId },
      })
      const waresticketAfter = waresticketAfterSearched.dataValues
      const waresticketDeleted = await models.WaresTickets.destroy({
        where: { id: waresticketId },
      })

      expect(status).to.equal(OK)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(` waresticket with id = ${waresticketId} was updated`)
      expect(waresticketAfter).to.include(requestBody)
      expect(new Date(waresticketBefore.updatedAt)).to.be.beforeTime(
        new Date(waresticketAfter.updatedAt)
      )
      expect(waresticketDeleted).to.equal(1)
    })
  })

  describe("Delete /:waresticketId", function () {
    it("When taget waresticket id exists, Then respective waresticket is deleted ", async function () {
      const waresticketCreated = await models.WaresTickets.create({})
      const newWaresTicket = waresticketCreated.dataValues
      const waresticketId = newWaresTicket.id

      const { status, data } = await client.delete(
        "/warestickets/" + waresticketId,
        setHeaders
      )

      const afterWaresTicketSearched = await models.WaresTickets.findOne({
        where: { id: waresticketId },
      })

      expect(status).to.equal(OK)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(
          ` has deleted a waresticket with id = ${waresticketId} and fullname = ${newWaresTicket.fullname}.`
        )
      expect(afterWaresTicketSearched).to.equal(null)
    })
  })
})
