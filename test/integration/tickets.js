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

describe("Tickets Routes", function () {
  let client
  const setHeaders = { headers: {} }
  const ticketObject = {
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
      "client",
      "payments",
      "waresSold",
    ],
    properties: {
      client: {
        type: "object",
        required: [
          "id",
          "workId",
          "fullname",
          "address",
          "phoneNumber",
          "relationship",
          "createdAt",
          "updatedAt",
          "work",
        ],
        properties: {
          work: {
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
        },
      },
      payments: {
        type: "array",
        items: {
          type: "object",
          required: [
            "id",
            "ticketId",
            "paidAt",
            "payment",
            "paymentType",
            "createdAt",
            "updatedAt",
          ],
        },
      },
      waresSold: {
        type: "array",
        items: {
          type: "object",
          required: [
            "wareId",
            "ticketId",
            "amount",
            "returned",
            "createdAt",
            "updatedAt",
            "ware",
          ],
        },
        properties: {
          ware: {
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
      },
    },
  }

  const ticketSchema = {
    title: "Ticket schema",
    ...ticketObject,
  }

  const ticketsSchema = {
    title: "Tickets Schema",
    type: "array",
    items: {
      ...ticketObject,
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

  describe("Get /:ticketId", function () {
    it("When an existing ticket id is given, Then the response is the ticket", async function () {
      const ticketId = Math.ceil(Math.random() * 2)

      const { status, data } = await client.get(
        "/tickets/" + ticketId,
        setHeaders
      )

      expect(status).to.equal(OK)
      expect(data).to.be.jsonSchema(ticketSchema)
    })

    it("When an non-existing ticket id is given, Then the response is not found #paramTicketId", async function () {
      const ticketId = Math.ceil(Math.random() * 10) + 3

      const { status, data } = await client.get(
        "/tickets/" + ticketId,
        setHeaders
      )

      expect(status).to.equal(NOT_FOUND)
      expect(data).to.equal("Ticket not found.")
    })

    it("When ticket id given is not an integer, Then the response is not found #integerValidator #paramTicketId", async function () {
      const ticketId = "string"

      const { status, data } = await client.get(
        "/tickets/" + ticketId,
        setHeaders
      )

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal("Bad input request.")
    })
  })

  describe("Get /", function () {
    const allTickets = [
      {
        id: 2,
        clientId: 2,
        cost: 155,
        paymentPlan: "weekly",
        description: null,
        createdAt: "2024-11-11T00:00:00.000Z",
        updatedAt: "2024-11-11T00:00:00.000Z",
        owed: 0,
        client: {
          id: 2,
          workId: 2,
          fullname: "Kellen Paucek",
          address: "1454 Sussex Court",
          phoneNumber: "2543865553",
          relationship: 5,
          createdAt: "2024-11-14T00:00:00.000Z",
          updatedAt: "2024-11-29T00:00:00.000Z",
          work: {
            id: 2,
            name: "Deckow and Sons",
            address: "245 John Drive",
            phoneNumber: "7644084620",
            createdAt: "2024-11-02T00:00:00.000Z",
            updatedAt: "2024-11-02T00:00:00.000Z",
          },
        },
        payments: [
          {
            id: 3,
            ticketId: 2,
            paidAt: "2024-11-08T20:00:00.000Z",
            payment: 80,
            paymentType: "cash",
            createdAt: "2024-11-11T00:00:00.000Z",
            updatedAt: "2024-11-11T00:00:00.000Z",
          },
          {
            id: 2,
            ticketId: 2,
            paidAt: "2024-11-01T20:00:00.000Z",
            payment: 75,
            paymentType: "cash",
            createdAt: "2024-11-11T00:00:00.000Z",
            updatedAt: "2024-11-11T00:00:00.000Z",
          },
        ],
        waresSold: [
          {
            wareId: 1,
            ticketId: 2,
            amount: 1,
            returned: 0,
            createdAt: "2024-11-11T00:00:00.000Z",
            updatedAt: "2024-11-11T00:00:00.000Z",
            ware: {
              cost: 155,
              createdAt: "2024-11-11T00:00:00.000Z",
              id: 1,
              name: "Loewe 001 Woman Perfume",
              stock: 1,
              tags: ["women", "1-pc"],
              type: "perfume",
              updatedAt: "2024-11-11T00:00:00.000Z",
            },
          },
        ],
      },
      {
        id: 1,
        clientId: 1,
        cost: 450,
        paymentPlan: "biweekly",
        description: null,
        createdAt: "2024-11-11T00:00:00.000Z",
        updatedAt: "2024-11-11T00:00:00.000Z",
        owed: 300,
        client: {
          id: 1,
          workId: 1,
          fullname: "James Moe",
          address: "1823 Steele Street",
          phoneNumber: "9566347775",
          relationship: 5,
          createdAt: "2024-11-10T00:00:00.000Z",
          updatedAt: "2024-12-12T00:00:00.000Z",
          work: {
            id: 1,
            name: "Hamill, Denesik and Davis",
            address: "38 Galvin Ave.",
            phoneNumber: "9075554011",
            createdAt: "2024-11-02T00:00:00.000Z",
            updatedAt: "2024-12-02T00:00:00.000Z",
          },
        },
        payments: [
          {
            id: 1,
            ticketId: 1,
            paidAt: "2024-11-01T20:00:00.000Z",
            payment: 150,
            paymentType: "cash app",
            createdAt: "2024-11-11T00:00:00.000Z",
            updatedAt: "2024-11-11T00:00:00.000Z",
          },
        ],
        waresSold: [
          {
            wareId: 3,
            ticketId: 1,
            amount: 1,
            returned: 0,
            createdAt: "2024-11-11T00:00:00.000Z",
            updatedAt: "2024-11-11T00:00:00.000Z",
            ware: {
              cost: 450,
              createdAt: "2024-11-11T00:00:00.000Z",
              id: 3,
              name: "The Leather Medium Tote Bag",
              stock: 2,
              tags: ["women"],
              type: "bag",
              updatedAt: "2024-11-11T00:00:00.000Z",
            },
          },
        ],
      },
    ]

    async function getTicketsIt(
      requestBody,
      expectedTickets = [],
      isPrinted = false
    ) {
      expectedTickets = Array.isArray(expectedTickets)
        ? expectedTickets
        : [expectedTickets]
      const config = structuredClone(setHeaders)
      config.data = requestBody

      const { status, data: tickets } = await client.get("/tickets", config)

      if (isPrinted) {
        console.log("[")

        for (const ticket of tickets) console.log(ticket, "\n,")

        console.log("]")
      }

      expect(status).to.equal(OK)
      expect(tickets).to.be.jsonSchema(ticketsSchema)
      expect(tickets).to.eql(expectedTickets)
    }

    it("When no inputs is provided, Then default query search is returned ", async function () {
      await getTicketsIt({}, allTickets)
    })

    it("When client id is the only input, Then response all providers with the respectived id are returned", async function () {
      await getTicketsIt({ clientId: 1 }, allTickets[1])
    })

    it("When cost is the only input, Then response all providers with the respectived cost are returned", async function () {
      await getTicketsIt({ cost: 155 }, allTickets[0])
    })

    it("When payment plan is the only input, Then response all providers with the payment plan that includes the subtring entered", async function () {
      await getTicketsIt({ paymentPlan: "week" }, allTickets)
    })

    it("When description is the only input, Then response all providers with the description that includes the subtring entered", async function () {
      await getTicketsIt({ description: null }, allTickets)
    })

    it("When a created at date is given, Then response is all tickets within that same month and year", async function () {
      await getTicketsIt({ createdAt: new Date("2024-11-11") }, allTickets)
    })

    it("When a updated at date is given, Then response is all tickets within that same month and year", async function () {
      await getTicketsIt({ updatedAt: new Date("2024-12-10") })
    })

    it("When a pending is given, Then response is all tickets that have not been paid in full are returned", async function () {
      await getTicketsIt({ pending: true }, allTickets[1])
    })

    it("When multiple inputs are given, Then response is all tickets that satisfy the input comparisons", async function () {
      await getTicketsIt(
        {
          clientId: 1,
          cost: 450,
          paymentPlan: "weekly",
          description: null,
          createdAt: "2024-11-11",
          updatedAt: "2024-11-11",
        },
        allTickets[1]
      )
    })
  })

  describe("Post /", function () {
    it("When merchant inputs required values, Then ticket is created ", async function () {
      const requestBody = { clientId: 3, cost: 14.5, paymentPlan: "weekly" }

      const { status, data } = await client.post(
        "/tickets",
        requestBody,
        setHeaders
      )

      const newTicketSearched = await models.Tickets.findOne({
        where: requestBody,
      })
      const newTicket = newTicketSearched.dataValues
      const newTicketDeleted = await models.Tickets.destroy({
        where: requestBody,
      })

      expect(status).to.equal(CREATED)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(" ticket has been created.")
      expect(newTicket).to.include(requestBody)
      expect(newTicketDeleted).to.equal(1)
    })
  })

  describe("Put /:ticketId", function () {
    it("When there are no inputs, Then response is bad request", async function () {
      const ticketId = Math.ceil(Math.random() * 2)
      const requestBody = {}

      const { status, data } = await client.put(
        "/tickets/" + ticketId,
        requestBody,
        setHeaders
      )

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal("Bad input request.")
    })

    it("When inputs are given, Then ticket has the respective information updated", async function () {
      const ticketBeforeCreated = await models.Tickets.create({
        clientId: Math.ceil(Math.random() * 3),
        cost: round(Math.random() * 5) + 14,
        paymentPlan: ["weekly", "biweekly"][Math.floor(Math.random() * 2)],
      })
      const ticketBefore = ticketBeforeCreated.dataValues
      const ticketId = ticketBefore.id
      const requestBody = {
        clientId: Math.ceil(Math.random() * 3),
        cost: round(Math.random() * 5 + 9),
        paymentPlan: ["weekly", "lump-sum"][Math.floor(Math.random() * 2)],
      }

      const { status, data } = await client.put(
        "/tickets/" + ticketId,
        requestBody,
        setHeaders
      )

      const ticketAfterSearched = await models.Tickets.findOne({
        where: { id: ticketId },
      })
      const ticketAfter = ticketAfterSearched.dataValues
      const ticketDeleted = await models.Tickets.destroy({
        where: { id: ticketId },
      })

      expect(status).to.equal(OK)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(` ticket with id = ${ticketId} was updated`)
      expect(ticketAfter).to.include(requestBody)
      expect(new Date(ticketBefore.updatedAt)).to.be.beforeTime(
        new Date(ticketAfter.updatedAt)
      )
      expect(ticketDeleted).to.equal(1)
    })
  })

  describe("Delete /:ticketId", function () {
    it("When taget ticket id exists, Then respective ticket is deleted ", async function () {
      const ticketCreated = await models.Tickets.create({
        clientId: Math.ceil(Math.random() * 3),
        cost: round(Math.random() * 50) + 170,
        paymentPlan: ["monthly", "biweekly"][Math.floor(Math.random() * 2)],
      })
      const newTicket = ticketCreated.dataValues
      const ticketId = newTicket.id

      const { status, data } = await client.delete(
        "/tickets/" + ticketId,
        setHeaders
      )

      const afterTicketSearched = await models.Tickets.findOne({
        where: { id: ticketId },
      })

      expect(status).to.equal(OK)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(
          ` has deleted a ticket with id = ${ticketId} and fullname = ${newTicket.fullname}.`
        )
      expect(afterTicketSearched).to.equal(null)
    })
  })
})
