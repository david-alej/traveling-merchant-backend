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

describe("Providers Routes", function () {
  let client
  const setHeaders = { headers: {} }
  const providerObject = {
    type: "object",
    required: ["id", "name", "address", "createdAt", "updatedAt", "orders"],
    properties: {
      orders: {
        type: "array",
        items: {
          type: "object",
          required: ["id", "providerId", "cost", "expectedAt", "actualAt"],
        },
      },
    },
  }

  const providerSchema = {
    title: "Provider schema",
    ...providerObject,
  }

  const providersSchema = {
    title: "Providers Schema",
    type: "array",
    items: {
      ...providerObject,
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

  describe("Get /:providerId", function () {
    it("When an existing provider id is given, Then the response is the provider", async function () {
      const providerId = Math.ceil(Math.random() * 3)

      const { status, data } = await client.get(
        "/providers/" + providerId,
        setHeaders
      )

      expect(status).to.equal(OK)
      expect(data).to.be.jsonSchema(providerSchema)
    })

    it("When an non-existing provider id is given, Then the response is not found #paramProviderId", async function () {
      const providerId = Math.ceil(Math.random() * 10) + 4

      const { status, data } = await client.get(
        "/providers/" + providerId,
        setHeaders
      )

      expect(status).to.equal(NOT_FOUND)
      expect(data).to.equal("Provider not found.")
    })

    it("When provider id given is not an integer, Then the response is not found #integerValidator #paramProviderId", async function () {
      const providerId = "string"

      const { status, data } = await client.get(
        "/providers/" + providerId,
        setHeaders
      )

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal("Bad input request.")
    })
  })

  describe("Get /", function () {
    const allProviders = [
      {
        id: 1,
        name: "Amazon",
        address: "0000 online",
        phoneNumber: "1632474734",
        createdAt: "2024-11-11T00:00:00.000Z",
        updatedAt: "2024-11-11T00:00:00.000Z",
        orders: [
          {
            actualAt: null,
            cost: 110,
            createdAt: "2024-11-11T00:00:00.000Z",
            expectedAt: "2024-11-02T00:00:00.000Z",
            id: 2,
            providerId: 1,
            updatedAt: "2024-11-11T00:00:00.000Z",
          },
        ],
      },
      {
        id: 2,
        name: "Ebay",
        address: "0000 online",
        phoneNumber: "5125869601",
        createdAt: "2024-11-11T00:00:00.000Z",
        updatedAt: "2024-11-11T00:00:00.000Z",
        orders: [],
      },
      {
        id: 3,
        name: "JCPenny",
        address: "84506 Deangelo Cliff",
        phoneNumber: "6192621956",
        createdAt: "2024-11-11T00:00:00.000Z",
        updatedAt: "2024-11-11T00:00:00.000Z",
        orders: [
          {
            actualAt: "2024-11-09T00:00:00.000Z",
            cost: 500,
            createdAt: "2024-11-11T00:00:00.000Z",
            expectedAt: "2024-11-02T00:00:00.000Z",
            id: 1,
            providerId: 3,
            updatedAt: "2024-11-11T00:00:00.000Z",
          },
        ],
      },
      {
        id: 4,
        name: "Marshalls",
        address: "41090 Jaime Springs",
        phoneNumber: "3718802186",
        createdAt: "2024-11-11T00:00:00.000Z",
        updatedAt: "2024-11-11T00:00:00.000Z",
        orders: [],
      },
    ]
    it("When no inputs is provided, Then default query search is returned ", async function () {
      const expectedProviders = allProviders

      const { status, data: providers } = await client.get(
        "/providers",
        setHeaders
      )

      expect(status).to.equal(OK)
      expect(providers).to.be.jsonSchema(providersSchema)
      expect(providers).to.eql(expectedProviders)
    })

    it("When name is the only input, Then response all providers with the a name that includes the subtring entered", async function () {
      const expectedProviders = [allProviders[1]]
      const config = structuredClone(setHeaders)
      config.data = { name: "ebay" }

      const { status, data: providers } = await client.get("/providers", config)

      expect(status).to.equal(OK)
      expect(providers).to.be.jsonSchema(providersSchema)
      expect(providers).to.eql(expectedProviders)
    })

    it("When address is the only input, Then response all providers with the a address that includes the subtring entered", async function () {
      const expectedProviders = [allProviders[3]]
      const config = structuredClone(setHeaders)
      config.data = { address: "0 jaim" }

      const { status, data: providers } = await client.get("/providers", config)

      expect(status).to.equal(OK)
      expect(providers).to.be.jsonSchema(providersSchema)
      expect(providers).to.eql(expectedProviders)
    })

    it("When a valid and full phone number is the only input, Then response all providers with the given phone number", async function () {
      const expectedProviders = [allProviders[2]]
      const config = structuredClone(setHeaders)
      config.data = { phoneNumber: "6192621956" }

      const { status, data: providers } = await client.get("/providers", config)

      expect(status).to.equal(OK)
      expect(providers).to.be.jsonSchema(providersSchema)
      expect(providers).to.eql(expectedProviders)
    })

    it("When a created at date is given, Then response is all providers within that same month and year", async function () {
      const expectedProviders = allProviders
      const config = structuredClone(setHeaders)
      config.data = { createdAt: new Date("2024-11-11") }

      const { status, data: providers } = await client.get("/providers", config)

      expect(status).to.equal(OK)
      expect(providers).to.be.jsonSchema(providersSchema)
      expect(providers).to.eql(expectedProviders)
    })

    it("When a updated at date is given, Then response is all providers within that same month and year", async function () {
      const expectedProviders = []
      const config = structuredClone(setHeaders)
      config.data = { updatedAt: new Date("2024-12-10") }

      const { status, data: providers } = await client.get("/providers", config)

      expect(status).to.equal(OK)
      expect(providers).to.be.jsonSchema(providersSchema)
      expect(providers).to.eql(expectedProviders)
    })

    it("When multiple inputs are given, Then response is all providers that satisfy the input comparisons", async function () {
      const expectedProviders = [allProviders[1]]
      const config = structuredClone(setHeaders)
      config.data = {
        name: "bay",
        address: "0000",
        phoneNumber: "5125869601",
        createdAt: "2024-11-02",
        updatedAt: "2024-11-02",
      }

      const { status, data: providers } = await client.get("/providers", config)

      expect(status).to.equal(OK)
      expect(providers).to.be.jsonSchema(providersSchema)
      expect(providers).to.eql(expectedProviders)
    })
  })

  describe("Post /", function () {
    it("When user inputs required values, Then provider is created ", async function () {
      const requestBody = {
        name: faker.person.fullName(),
        address: faker.location.streetAddress(),
        phoneNumber: fakerPhoneNumber(),
      }

      const { status, data } = await client.post(
        "/providers",
        requestBody,
        setHeaders
      )

      requestBody.phoneNumber = requestBody.phoneNumber.replace(/\D/g, "")
      const newProviderSearched = await models.Providers.findOne({
        where: requestBody,
      })
      const newProvider = newProviderSearched.dataValues
      const newProviderDeleted = await models.Providers.destroy({
        where: requestBody,
      })

      expect(status).to.equal(CREATED)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(" provider has been created.")
      expect(newProvider).to.include(requestBody)
      expect(newProviderDeleted).to.equal(1)
    })
  })

  describe("Put /:providerId", function () {
    it("When there are no inputs, Then response is bad request", async function () {
      const providerId = Math.ceil(Math.random() * 3)
      const requestBody = {}

      const { status, data } = await client.put(
        "/providers/" + providerId,
        requestBody,
        setHeaders
      )

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal("Bad input request.")
    })

    it("When inputs are given, Then provider has the respective information updated", async function () {
      const newProvider = {
        name: faker.company.name(),
        address: faker.location.streetAddress(),
        phoneNumber: fakerPhoneNumber().replace(/\D/g, ""),
      }
      const providerBeforeCreated = await models.Providers.create(newProvider)
      const providerBefore = providerBeforeCreated.dataValues
      const providerId = providerBefore.id
      const requestBody = {
        name: faker.company.name(),
        address: faker.location.streetAddress(),
        phoneNumber: fakerPhoneNumber(),
      }

      const { status, data } = await client.put(
        "/providers/" + providerId,
        requestBody,
        setHeaders
      )

      requestBody.phoneNumber = requestBody.phoneNumber.replace(/\D/g, "")
      const providerAfterSearched = await models.Providers.findOne({
        where: { id: providerId },
      })
      const providerAfter = providerAfterSearched.dataValues
      const providerDeleted = await models.Providers.destroy({
        where: { id: providerId },
      })

      expect(status).to.equal(OK)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(` provider with id = ${providerId} was updated`)
      expect(providerAfter).to.include(requestBody)
      expect(new Date(providerBefore.updatedAt)).to.be.beforeTime(
        new Date(providerAfter.updatedAt)
      )
      expect(providerDeleted).to.equal(1)
    })
  })

  describe("Delete /:providerId", function () {
    it("When taget provider id exists, Then respective provider is deleted ", async function () {
      const providerCreated = await models.Providers.create({
        name: faker.company.name(),
        address: faker.location.streetAddress(),
        phoneNumber: fakerPhoneNumber().replace(/\D/g, ""),
      })
      const newProvider = providerCreated.dataValues
      const providerId = newProvider.id

      const { status, data } = await client.delete(
        "/providers/" + providerId,
        setHeaders
      )

      const afterProviderSearched = await models.Providers.findOne({
        where: { id: providerId },
      })

      expect(status).to.equal(OK)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(
          ` has deleted a provider with id = ${providerId} and fullname = ${newProvider.fullname}.`
        )
      expect(afterProviderSearched).to.equal(null)
    })
  })
})
