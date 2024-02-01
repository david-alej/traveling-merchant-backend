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
  fakerPhoneNumber,
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
      "description",
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
        items: {
          type: "object",
          required: [
            "id",
            "clientId",
            "cost",
            "paymentPlan",
            "description",
            "createdAt",
            "updatedAt",
            "paid",
            "returned",
            "owed",
          ],
        },
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
      const clientId = Math.ceil(Math.random() * 10) + 4

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
    const allClients = [
      {
        id: 4,
        workId: 3,
        fullname: "Madilyn Langosh",
        address: "1571 Weekly Street",
        phoneNumber: "2103424367",
        description: "",
        createdAt: "2025-01-13T00:00:00.000Z",
        updatedAt: "2025-01-13T00:00:00.000Z",
        tickets: [
          {
            id: 3,
            clientId: 4,
            cost: 168.27,
            paymentPlan: "lump sum",
            description: "",
            createdAt: "2025-01-13T00:00:00.000Z",
            updatedAt: "2025-01-13T00:00:00.000Z",
            returned: 155,
            paid: 13.27,
            owed: 0,
          },
        ],
        work: {
          id: 3,
          name: "Lynch PLC",
          address: "38 Lafayette St.",
          phoneNumber: "9103623505",
          createdAt: "2025-01-13T00:00:00.000Z",
          updatedAt: "2025-01-13T00:00:00.000Z",
        },
      },
      {
        id: 3,
        workId: 2,
        fullname: "Kellen Paucek",
        address: "1454 Sussex Court",
        phoneNumber: "2543865553",
        description: "",
        createdAt: "2025-01-09T00:00:00.000Z",
        updatedAt: "2025-01-09T00:00:00.000Z",
        tickets: [
          {
            id: 2,
            clientId: 3,
            cost: 488.52,
            paymentPlan: "biweekly",
            description: "",
            createdAt: "2025-01-09T00:00:00.000Z",
            updatedAt: "2025-01-09T00:00:00.000Z",
            returned: 0,
            paid: 200,
            owed: 288.52,
          },
        ],
        work: {
          id: 2,
          name: "Deckow and Sons",
          address: "245 John Drive",
          phoneNumber: "7644084620",
          createdAt: "2025-01-09T00:00:00.000Z",
          updatedAt: "2025-01-09T00:00:00.000Z",
        },
      },
      {
        id: 2,
        workId: 1,
        fullname: "James Moe",
        address: "1823 Steele Street",
        phoneNumber: "9566347775",
        description: "",
        createdAt: "2025-01-09T00:00:00.000Z",
        updatedAt: "2025-01-09T00:00:00.000Z",
        tickets: [
          {
            id: 1,
            clientId: 2,
            cost: 391.9,
            paymentPlan: "weekly",
            description: "",
            createdAt: "2025-01-09T00:00:00.000Z",
            updatedAt: "2025-01-09T00:00:00.000Z",
            returned: 155,
            paid: 236.9,
            owed: 0,
          },
        ],
        work: {
          id: 1,
          name: "Hamill, Denesik and Davis",
          address: "38 Galvin Ave.",
          phoneNumber: "9075554011",
          createdAt: "2025-01-01T00:00:00.000Z",
          updatedAt: "2025-01-09T00:00:00.000Z",
        },
      },
      {
        id: 1,
        workId: 1,
        fullname: "Defective",
        address: "0000 Street",
        phoneNumber: "0000000000",
        description: "",
        createdAt: "2025-01-01T00:00:00.000Z",
        updatedAt: "2025-01-01T00:00:00.000Z",
        tickets: [],
        work: {
          id: 1,
          name: "Hamill, Denesik and Davis",
          address: "38 Galvin Ave.",
          phoneNumber: "9075554011",
          createdAt: "2025-01-01T00:00:00.000Z",
          updatedAt: "2025-01-09T00:00:00.000Z",
        },
      },
    ]

    it("When no inputs is provided, Then default query search is returned ", async function () {
      const expectedClients = allClients

      const { status, data: clients } = await client.get("/clients", setHeaders)

      expect(status).to.equal(OK)
      expect(clients).to.be.jsonSchema(clientsSchema)
      expect(clients).to.eql(expectedClients)
    })

    it("When work id is the only input, Then response all clients with the same work id", async function () {
      const expectedClients = [allClients[0]]
      const config = structuredClone(setHeaders)
      config.data = { workId: 3 }

      const { status, data: clients } = await client.get("/clients", config)

      expect(status).to.equal(OK)
      expect(clients).to.be.jsonSchema(clientsSchema)
      expect(clients).to.eql(expectedClients)
    })

    it("When a created at date is given, Then response is all clients within that same month and year", async function () {
      const expectedClients = allClients
      const config = structuredClone(setHeaders)
      config.data = { createdAt: new Date("2025-01-11") }

      const { status, data: clients } = await client.get("/clients", config)

      expect(status).to.equal(OK)
      expect(clients).to.be.jsonSchema(clientsSchema)
      expect(clients).to.eql(expectedClients)
    })

    it("When a updated at date is given, Then response is all clients within that same month and year", async function () {
      const expectedClients = []
      const config = structuredClone(setHeaders)
      config.data = { updatedAt: new Date("2025-02-10") }

      const { status, data: clients } = await client.get("/clients", config)

      expect(status).to.equal(OK)
      expect(clients).to.be.jsonSchema(clientsSchema)
      expect(clients).to.eql(expectedClients)
    })

    it("When part of a fullname is given, Then response is all clients that include the given string using case insensitive search", async function () {
      const expectedClients = [allClients[0]]
      const config = structuredClone(setHeaders)
      config.data = { fullname: "ADI" }

      const { status, data: clients } = await client.get("/clients", config)

      expect(status).to.equal(OK)
      expect(clients).to.be.jsonSchema(clientsSchema)
      expect(clients).to.eql(expectedClients)
    })

    it("When part of an address is given, Then response is all clients that include the given string using case insensitive search", async function () {
      const expectedClients = [allClients[2]]
      const config = structuredClone(setHeaders)
      config.data = { address: "TEEL" }

      const { status, data: clients } = await client.get("/clients", config)

      expect(status).to.equal(OK)
      expect(clients).to.be.jsonSchema(clientsSchema)
      expect(clients).to.eql(expectedClients)
    })

    it("When multiple inputs are given, Then response is all clients that satisfy the input comparisons", async function () {
      const expectedClients = [allClients[1]]
      const config = structuredClone(setHeaders)
      config.data = {
        workId: 2,
        fullname: "Pau",
        address: "1454",
        phoneNumber: "2543865553",
        createdAt: "2025-01-11",
        updatedAt: "2025-01-11",
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
        fullname: faker.person.fullName(),
        address: faker.location.streetAddress(),
        workId: Math.ceil(Math.random() * 3),
        phoneNumber: fakerPhoneNumber(),
      }

      const { status, data } = await client.post(
        "/clients",
        requestBody,
        setHeaders
      )

      requestBody.phoneNumber = requestBody.phoneNumber.replace(/\D/g, "")
      const newClientSearched = await models.Clients.findOne({
        where: requestBody,
      })
      const newClient = newClientSearched.dataValues
      const newClientDeleted = await models.Clients.destroy({
        where: requestBody,
      })

      expect(status).to.equal(CREATED)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(" client has been created.")
      expect(newClient).to.include(requestBody)
      expect(newClientDeleted).to.equal(1)
    })

    it("When user inputs required values and a new work are given, Then the new work is created then the client is created ", async function () {
      const work = {
        name: faker.company.name(),
        address: faker.location.streetAddress(),
        phoneNumber: fakerPhoneNumber(),
      }
      const requestBody = {
        fullname: faker.person.fullName(),
        address: faker.location.streetAddress(),
        phoneNumber: fakerPhoneNumber(),
        work,
      }

      const { status, data } = await client.post(
        "/clients",
        requestBody,
        setHeaders
      )

      requestBody.phoneNumber = requestBody.phoneNumber.replace(/\D/g, "")
      delete requestBody.work
      work.phoneNumber = work.phoneNumber.replace(/\D/g, "")
      const newClientSearched = await models.Clients.findOne({
        where: requestBody,
      })
      const newClient = newClientSearched.dataValues
      const newClientDeleted = await models.Clients.destroy({
        where: requestBody,
      })
      const newWorkSearched = await models.Works.findOne({
        where: work,
      })
      const newWork = newWorkSearched.dataValues
      const newWorkDeleted = await models.Works.destroy({
        where: work,
      })

      expect(status).to.equal(CREATED)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(" client has been created.")
      expect(newClient).to.include(requestBody)
      expect(newClientDeleted).to.equal(1)
      expect(newWork).to.include(work)
      expect(newWorkDeleted).to.equal(1)
    })

    it("When user inputs required values and an invalid new work are given, Then response is bad request ", async function () {
      const work = {
        name: faker.company.name(),
        address: Math.random() * 20,
        phoneNumber: fakerPhoneNumber(),
      }
      const requestBody = {
        fullname: faker.person.fullName(),
        address: faker.location.streetAddress(),
        phoneNumber: fakerPhoneNumber(),
        work,
      }

      const { status, data } = await client.post(
        "/clients",
        requestBody,
        setHeaders
      )

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal("Bad input request.")
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
      const newClient = {
        workId: Math.ceil(Math.random() * 3),
        fullname: faker.person.fullName(),
        address: faker.location.streetAddress(),
        phoneNumber: fakerPhoneNumber().replace(/\D/g, ""),
      }
      const clientBeforeCreated = await models.Clients.create(newClient)
      const clientBefore = clientBeforeCreated.dataValues
      const clientId = clientBefore.id
      const requestBody = {
        workId: Math.ceil(Math.random() * 3),
        fullname: faker.person.fullName(),
        address: faker.location.streetAddress(),
        phoneNumber: fakerPhoneNumber(),
        description: faker.lorem.sentence({ min: 3, max: 10 }),
      }

      const { status, data } = await client.put(
        "/clients/" + clientId,
        requestBody,
        setHeaders
      )

      requestBody.phoneNumber = requestBody.phoneNumber.replace(/\D/g, "")
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
