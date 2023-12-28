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
    title: "Clients Schema",
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

    it("When client id given is not an integer, Then the response is not found #integerValidator #paramClientId", async function () {
      const clientId = "string"

      const { status, data } = await client.get(
        "/clients/" + clientId,
        setHeaders
      )

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal("Bad input request.")
    })
  })

  describe("Get /", function () {
    it("When no inputs is provided, Then default query search is returned ", async function () {
      const expectedClients = [
        {
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
          phoneNumber: "2103424367",
          relationship: 5,
          createdAt: "2024-11-22T00:00:00.000Z",
          updatedAt: "2024-11-25T00:00:00.000Z",
          work: {
            id: 3,
            name: "Lynch PLC",
            address: "38 Lafayette St.",
            phoneNumber: "9103623505",
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
          phoneNumber: "2103424367",
          relationship: 5,
          createdAt: "2024-11-22T00:00:00.000Z",
          updatedAt: "2024-11-25T00:00:00.000Z",
          work: {
            id: 3,
            name: "Lynch PLC",
            address: "38 Lafayette St.",
            phoneNumber: "9103623505",
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
          phoneNumber: "2103424367",
          relationship: 5,
          createdAt: "2024-11-22T00:00:00.000Z",
          updatedAt: "2024-11-25T00:00:00.000Z",
          work: {
            id: 3,
            name: "Lynch PLC",
            address: "38 Lafayette St.",
            phoneNumber: "9103623505",
            createdAt: "2024-11-02T00:00:00.000Z",
            updatedAt: "2024-11-02T00:00:00.000Z",
          },
          tickets: [],
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
      ]
      const config = structuredClone(setHeaders)
      config.data = { updatedAt: new Date("2024-12-10") }

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
          phoneNumber: "2103424367",
          relationship: 5,
          createdAt: "2024-11-22T00:00:00.000Z",
          updatedAt: "2024-11-25T00:00:00.000Z",
          work: {
            id: 3,
            name: "Lynch PLC",
            address: "38 Lafayette St.",
            phoneNumber: "9103623505",
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
      ]
      const config = structuredClone(setHeaders)
      config.data = { address: "TEEL" }

      const { status, data: clients } = await client.get("/clients", config)

      expect(status).to.equal(OK)
      expect(clients).to.be.jsonSchema(clientsSchema)
      expect(clients).to.eql(expectedClients)
    })

    it("When multiple inputs are given, Then response is all clients that satisfy the input comparisons", async function () {
      const expectedClients = [
        {
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
      ]
      const config = structuredClone(setHeaders)
      config.data = {
        workId: 1,
        address: "TEEL",
        createdAt: "2024-11-11",
        fullname: "moe",
        updatedAt: "2024-12-11",
      }

      const { status, data: clients } = await client.get("/clients", config)

      expect(status).to.equal(OK)
      expect(clients).to.be.jsonSchema(clientsSchema)
      expect(clients).to.eql(expectedClients)
    })
  })

  describe("Post /", function () {
    it("When user inputs required values, Then client is created ", async function () {
      const requestBody = {
        fullname: "Dave Jones",
        address: "1234 Huey Dr.",
        workId: 1,
        phoneNumber: "9561234567",
      }

      const { status, data } = await client.post(
        "/clients",
        requestBody,
        setHeaders
      )

      expect(status).to.equal(CREATED)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(" client has been created.")
    })
  })

  describe("Put /:clientId", function () {
    it("When there are no inputs, Then response is bad request", async function () {
      const clientId = Math.ceil(Math.random() * 3)
      const requestBody = {}

      const { status, data } = await client.put(
        "/clients/" + clientId,
        requestBody,
        setHeaders
      )

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal("Bad input request.")
    })

    it("When inputs are given, Then client has the respective information updated", async function () {
      const clientBeforeCreated = await models.Clients.create({
        workId: "1",
        fullname: "Initial name",
        address: "0001 address",
        phoneNumber: "6491234567",
      })
      const clientBefore = clientBeforeCreated.dataValues
      const clientId = clientBefore.id
      const requestBody = {
        workId: 2,
        fullname: "Final name",
        address: "0002 address",
        phoneNumber: "6492345678",
        relationship: 7,
      }

      const { status, data } = await client.put(
        "/clients/" + clientId,
        requestBody,
        setHeaders
      )

      const clientAfterSearched = await models.Clients.findOne({
        where: { id: clientId },
      })
      const clientAfter = clientAfterSearched.dataValues
      const clientDeleted = await models.Clients.destroy({
        where: { id: clientId },
      })

      expect(status).to.equal(OK)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(` client with id = ${clientId} was updated`)
      expect(clientAfter).to.include(requestBody)
      expect(new Date(clientBefore.updatedAt)).to.be.beforeTime(
        new Date(clientAfter.updatedAt)
      )
      expect(clientDeleted).to.equal(1)
    })
  })

  describe("Delete /:clientId", function () {
    it("When taget client id exists, Then respective client is deleted ", async function () {
      const clientCreated = await models.Clients.create({
        fullname: "client name",
        workId: "3",
        address: "0000 address",
        phoneNumber: "7531234567",
      })
      const newClient = clientCreated.dataValues
      const clientId = newClient.id

      const { status, data } = await client.delete(
        "/clients/" + clientId,
        setHeaders
      )

      const afterClientSearched = await models.Clients.findOne({
        where: { id: clientId },
      })

      expect(status).to.equal(OK)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(
          ` has deleted a client with id = ${clientId} and fullname = ${newClient.fullname}.`
        )
      expect(afterClientSearched).to.equal(null)
    })
  })
})
