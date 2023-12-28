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

describe("Works Routes", function () {
  let client
  const setHeaders = { headers: {} }
  const workObject = {
    type: "object",
    required: [
      "id",
      "name",
      "address",
      "phoneNumber",
      "createdAt",
      "updatedAt",
      "employees",
    ],
    properties: {
      employees: {
        type: "array",
        items: {
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
          ],
        },
      },
    },
  }

  const workSchema = {
    title: "Work schema",
    ...workObject,
  }

  const worksSchema = {
    title: "Works Schema",
    type: "array",
    items: {
      ...workObject,
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

  describe("Get /:workId", function () {
    it("When an existing work id is given, Then the response is the work", async function () {
      const workId = Math.ceil(Math.random() * 3)

      const { status, data } = await client.get("/works/" + workId, setHeaders)

      expect(status).to.equal(OK)
      expect(data).to.be.jsonSchema(workSchema)
    })

    it("When an non-existing work id is given, Then the response is not found #paramWorkId", async function () {
      const workId = Math.ceil(Math.random() * 10) + 3

      const { status, data } = await client.get("/works/" + workId, setHeaders)

      expect(status).to.equal(NOT_FOUND)
      expect(data).to.equal("Work not found.")
    })

    it("When work id given is not an integer, Then the response is not found #integerValidator #paramWorkId", async function () {
      const workId = "string"

      const { status, data } = await client.get("/works/" + workId, setHeaders)

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal("Bad input request.")
    })
  })

  describe("Get /", function () {
    it("When , Then ", async function () {
      const { status, data } = await client.get("/works", setHeaders)

      expect(status).to.equal(OK)
      expect(data).to.be.jsonSchema(worksSchema)
      expect(data).to.eql()
    })
  })
})
