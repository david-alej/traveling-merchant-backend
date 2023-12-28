const { config } = require("dotenv")
const {
  axios,
  axiosConfig,
  initializeWebServer,
  stopWebServer,
  expect,
  httpStatusCodes,
  merchantCredentials,
} = require("../common")

const { OK, NOT_FOUND, BAD_REQUEST } = httpStatusCodes

describe("Clients Routes", function () {
  let client
  const setHeaders = { headers: {} }
  const clientObject = {
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
      "tickets",
    ],
    properties: {
      work: {
        type: "object",
        require: ["id", "name", "address", "createdAt", "updatedAt"],
      },
      tickets: {
        type: "array",
      },
    },
  }

  const clientSchema = {
    title: "Client schema",
    ...clientObject,
  }

  const clientsSchema = {
    title: "Clients",
    type: "array",
    items: {
      ...clientObject,
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

  describe("Get /:clientId", function () {
    it("When an existing client id is given, Then the response is the client", async function () {
      const clientId = Math.ceil(Math.random() * 3)

      const { status, data } = await client.get(
        "/clients/" + clientId,
        setHeaders
      )

      expect(status).to.equal(OK)
      expect(data).to.be.jsonSchema(clientSchema)
    })

    it("When an non-existing client id is given, Then the response is not found #paramClientId", async function () {
      const clientId = Math.ceil(Math.random() * 10) + 3

      const { status, data } = await client.get(
        "/clients/" + clientId,
        setHeaders
      )

      expect(status).to.equal(NOT_FOUND)
      expect(data).to.equal("Client not found.")
    })

    it("When client id given is a string, Then the response is not found #integerValidator #paramClientId", async function () {
      const clientId = "string"

      const { status, data } = await client.get(
        "/clients/" + clientId,
        setHeaders
      )

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal("Bad input request.")
    })
  })

  describe.only("Get /", function () {
    it("When no inputs is provided, Then default query search is returned ", async function () {
      const expectedClients = [
        {
          id: 1,
          workId: 1,
          fullname: "James Moe",
          address: "1823 Steele Street",
          phoneNumber: "(956)634-7775",
          relationship: 5,
          createdAt: "2024-11-11T00:00:00.000Z",
          updatedAt: "2024-11-11T00:00:00.000Z",
          work: {
            id: 1,
            name: "Hamill, Denesik and Davis",
            address: "38 Galvin Ave.",
            createdAt: "2024-11-02T00:00:00.000Z",
            updatedAt: "2024-11-02T00:00:00.000Z",
          },
          tickets: [
            {
              id: 1,
              clientId: 1,
              cost: 450,
              paymentPlan: "biweekly",
              description: null,
              createdAt: "2024-11-11T00:00:00.000Z",
              updatedAt: "2024-11-11T00:00:00.000Z",
            },
          ],
        },
        {
          id: 2,
          workId: 2,
          fullname: "Kellen Paucek",
          address: "1454 Sussex Court",
          phoneNumber: "(254)386-5553",
          relationship: 5,
          createdAt: "2024-11-11T00:00:00.000Z",
          updatedAt: "2024-11-11T00:00:00.000Z",
          work: {
            id: 2,
            name: "Deckow and Sons",
            address: "245 John Drive",
            createdAt: "2024-11-02T00:00:00.000Z",
            updatedAt: "2024-11-02T00:00:00.000Z",
          },
          tickets: [
            {
              id: 2,
              clientId: 2,
              cost: 155,
              paymentPlan: "weekly",
              description: null,
              createdAt: "2024-11-11T00:00:00.000Z",
              updatedAt: "2024-11-11T00:00:00.000Z",
            },
          ],
        },
        {
          id: 3,
          workId: 3,
          fullname: "Madilyn Langosh",
          address: "1571 Weekly Street",
          phoneNumber: "(210)342-4367",
          relationship: 5,
          createdAt: "2024-11-10T00:00:00.000Z",
          updatedAt: "2024-11-10T00:00:00.000Z",
          work: {
            id: 3,
            name: "Lynch PLC",
            address: "38 Lafayette St.",
            createdAt: "2024-11-02T00:00:00.000Z",
            updatedAt: "2024-11-02T00:00:00.000Z",
          },
          tickets: [],
        },
      ]

      const { status, data: clients } = await client.get("/clients", setHeaders)

      expect(status).to.equal(OK)
      expect(clients).to.be.jsonSchema(clientsSchema)
      expect(clients).to.eql(expectedClients)
    })

    it("When work id is the only input, Then response all clients with the same work id", async function () {
      const expectedClients = [
        {
          id: 3,
          workId: 3,
          fullname: "Madilyn Langosh",
          address: "1571 Weekly Street",
          phoneNumber: "(210)342-4367",
          relationship: 5,
          createdAt: "2024-11-10T00:00:00.000Z",
          updatedAt: "2024-11-10T00:00:00.000Z",
          work: {
            id: 3,
            name: "Lynch PLC",
            address: "38 Lafayette St.",
            createdAt: "2024-11-02T00:00:00.000Z",
            updatedAt: "2024-11-02T00:00:00.000Z",
          },
          tickets: [],
        },
      ]
      const config = structuredClone(setHeaders)
      config.data = { workId: 3 }

      const { status, data: clients } = await client.get("/clients", config)

      expect(status).to.equal(OK)
      expect(clients).to.be.jsonSchema(clientsSchema)
      expect(clients).to.eql(expectedClients)
    })

    it("When a created at date is given, Then response is all clients within that same month and year", async function () {
      const expectedClients = [
        {
          id: 1,
          workId: 1,
          fullname: "James Moe",
          address: "1823 Steele Street",
          phoneNumber: "(956)634-7775",
          relationship: 5,
          createdAt: "2024-11-11T00:00:00.000Z",
          updatedAt: "2024-11-11T00:00:00.000Z",
          work: {
            id: 1,
            name: "Hamill, Denesik and Davis",
            address: "38 Galvin Ave.",
            createdAt: "2024-11-02T00:00:00.000Z",
            updatedAt: "2024-11-02T00:00:00.000Z",
          },
          tickets: [
            {
              id: 1,
              clientId: 1,
              cost: 450,
              paymentPlan: "biweekly",
              description: null,
              createdAt: "2024-11-11T00:00:00.000Z",
              updatedAt: "2024-11-11T00:00:00.000Z",
            },
          ],
        },
        {
          id: 2,
          workId: 2,
          fullname: "Kellen Paucek",
          address: "1454 Sussex Court",
          phoneNumber: "(254)386-5553",
          relationship: 5,
          createdAt: "2024-11-11T00:00:00.000Z",
          updatedAt: "2024-11-11T00:00:00.000Z",
          work: {
            id: 2,
            name: "Deckow and Sons",
            address: "245 John Drive",
            createdAt: "2024-11-02T00:00:00.000Z",
            updatedAt: "2024-11-02T00:00:00.000Z",
          },
          tickets: [
            {
              id: 2,
              clientId: 2,
              cost: 155,
              paymentPlan: "weekly",
              description: null,
              createdAt: "2024-11-11T00:00:00.000Z",
              updatedAt: "2024-11-11T00:00:00.000Z",
            },
          ],
        },
      ]
      const config = structuredClone(setHeaders)
      config.data = { createdAt: new Date("2024-11-11") }

      const { status, data: clients } = await client.get("/clients", config)

      expect(status).to.equal(OK)
      expect(clients).to.be.jsonSchema(clientsSchema)
      expect(clients).to.eql(expectedClients)
    })

    it("When a updated at date is given, Then response is all clients within that same month and year", async function () {
      const expectedClients = [
        {
          id: 3,
          workId: 3,
          fullname: "Madilyn Langosh",
          address: "1571 Weekly Street",
          phoneNumber: "(210)342-4367",
          relationship: 5,
          createdAt: "2024-11-10T00:00:00.000Z",
          updatedAt: "2024-11-10T00:00:00.000Z",
          work: {
            id: 3,
            name: "Lynch PLC",
            address: "38 Lafayette St.",
            createdAt: "2024-11-02T00:00:00.000Z",
            updatedAt: "2024-11-02T00:00:00.000Z",
          },
          tickets: [],
        },
      ]
      const config = structuredClone(setHeaders)
      config.data = { updatedAt: new Date("2024-11-10") }

      const { status, data: clients } = await client.get("/clients", config)

      expect(status).to.equal(OK)
      expect(clients).to.be.jsonSchema(clientsSchema)
      expect(clients).to.eql(expectedClients)
    })

    it("When part of a fullname is given, Then response is all clients that include the given string using case insensitive search", async function () {
      const expectedClients = [
        {
          id: 3,
          workId: 3,
          fullname: "Madilyn Langosh",
          address: "1571 Weekly Street",
          phoneNumber: "(210)342-4367",
          relationship: 5,
          createdAt: "2024-11-10T00:00:00.000Z",
          updatedAt: "2024-11-10T00:00:00.000Z",
          work: {
            id: 3,
            name: "Lynch PLC",
            address: "38 Lafayette St.",
            createdAt: "2024-11-02T00:00:00.000Z",
            updatedAt: "2024-11-02T00:00:00.000Z",
          },
          tickets: [],
        },
      ]
      const config = structuredClone(setHeaders)
      config.data = { fullname: "ADI" }

      const { status, data: clients } = await client.get("/clients", config)

      expect(status).to.equal(OK)
      expect(clients).to.be.jsonSchema(clientsSchema)
      expect(clients).to.eql(expectedClients)
    })

    it("When part of an address is given, Then response is all clients that include the given string using case insensitive search", async function () {
      const expectedClients = [
        {
          id: 1,
          workId: 1,
          fullname: "James Moe",
          address: "1823 Steele Street",
          phoneNumber: "(956)634-7775",
          relationship: 5,
          createdAt: "2024-11-11T00:00:00.000Z",
          updatedAt: "2024-11-11T00:00:00.000Z",
          work: {
            id: 1,
            name: "Hamill, Denesik and Davis",
            address: "38 Galvin Ave.",
            createdAt: "2024-11-02T00:00:00.000Z",
            updatedAt: "2024-11-02T00:00:00.000Z",
          },
          tickets: [
            {
              clientId: 1,
              cost: 450,
              createdAt: "2024-11-11T00:00:00.000Z",
              description: null,
              id: 1,
              paymentPlan: "biweekly",
              updatedAt: "2024-11-11T00:00:00.000Z",
            },
          ],
        },
      ]
      const config = structuredClone(setHeaders)
      config.data = { address: "TEEL" }

      const { status, data: clients } = await client.get("/clients", config)

      expect(status).to.equal(OK)
      expect(clients).to.be.jsonSchema(clientsSchema)
      expect(clients).to.eql(expectedClients)
    })
  })
})
