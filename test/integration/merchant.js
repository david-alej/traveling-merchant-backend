const {
  axios,
  axiosConfig,
  initializeWebServer,
  stopWebServer,
  expect,
  httpStatusCodes,
  merchantCredentials,
  preMerchantMsg,
  generateUsername,
  generatePassword,
  models,
} = require("../common")

const { OK, BAD_REQUEST } = httpStatusCodes

const { passwordHash } = require("../../util/index").passwordHash

describe("Merchant routes", function () {
  let client
  const setHeaders = { headers: {} }

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

  describe("Get /", function () {
    it("When valid request is made, then status is ok", async function () {
      const expected = [
        {
          id: 1,
          username: "missioneros",
          createdAt: "2024-11-11T20:00:00.000Z",
          updatedAt: "2024-11-11T20:00:00.000Z",
        },
      ]

      const { status, data } = await client.get("/merchant", setHeaders)

      expect(status).to.equal(OK)
      expect(data).to.eql(expected)
    })
  })

  describe("Put /", function () {
    const putUserNewCredentials = {}

    beforeEach(async function () {
      putUserNewCredentials.newUsername = generateUsername()
      putUserNewCredentials.newPassword = generatePassword()

      const { status, data, headers } = await client.post(
        "/login",
        merchantCredentials
      )

      setHeaders.headers.Cookie = headers["set-cookie"]
      setHeaders.headers["x-csrf-token"] = data.csrfToken

      expect(status).to.equal(OK)
    })

    it("When no new credentials are added, then response is a bad request", async function () {
      const expected = "Bad request."
      const requestBody = merchantCredentials
      const merchantId = 1
      console.log(requestBody)
      const { status, data } = await client.put(
        "/merchant/" + merchantId,
        requestBody,
        setHeaders
      )

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal(expected)
    })

    it("When a new username is entered but it already exists, then response is a bad request", async function () {
      const requestBody = {
        ...merchantCredentials,
        newUsername: merchantCredentials.username,
      }
      const expected = "Bad request."
      const merchantId = 1

      const { status, data } = await client.put(
        "/merchant/" + merchantId,
        requestBody,
        setHeaders
      )

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal(expected)
    })

    it("When a valid new username is provided, then response is ok", async function () {
      const { password } = merchantCredentials
      const { newUsername } = putUserNewCredentials
      const requestBody = { ...merchantCredentials, newUsername }
      const afterMsg = " has updated either/both their username or password."
      const merchantId = 1

      const { status, data } = await client.put(
        "/merchant/" + merchantId,
        requestBody,
        setHeaders
      )

      const { status: newCredentialsLoginStatus } = await client.post(
        "/login",
        {
          username: newUsername,
          password: password,
        }
      )
      const updated = await models.Merchant.update(
        { username: merchantCredentials.username },
        {
          where: { id: merchantId },
        }
      )

      expect(status).to.equal(OK)
      expect(data).to.include.string(preMerchantMsg).and.string(afterMsg)
      expect(newCredentialsLoginStatus).to.equal(OK)
      expect(updated[0]).to.equal(1)
    })

    it("When a valid new password is provided, then response is ok", async function () {
      const { username } = merchantCredentials
      const { newPassword } = putUserNewCredentials
      const requestBody = { ...merchantCredentials, newPassword }
      const { status: firstSearchStatus, data: oldMerchantData } =
        await client.get("/merchant/", setHeaders)
      const oldUpdatedAt = oldMerchantData[0].updatedAt
      const merchantId = 1
      const afterMsg = " has updated either/both their username or password."

      const { status, data } = await client.put(
        "/merchant/" + merchantId,
        requestBody,
        setHeaders
      )

      const {
        status: loginStatus,
        data: loginData,
        headers,
      } = await client.post("/login", {
        username: username,
        password: newPassword,
      })
      setHeaders.headers.Cookie = headers["set-cookie"]
      setHeaders.headers["x-csrf-token"] = loginData.csrfToken
      const hashedPassword = await passwordHash(
        merchantCredentials.password,
        10
      )
      const updated = await models.Merchant.update(
        {
          username: merchantCredentials.username,
          password: hashedPassword,
        },
        {
          where: { id: merchantId },
        }
      )
      const { status: searchStatus, data: newMerchantData } = await client.get(
        "/merchant/",
        setHeaders
      )
      const newUpdatedAt = newMerchantData[0].updatedAt

      expect(firstSearchStatus).to.equal(OK)
      expect(status).to.equal(OK)
      expect(data).to.include.string(preMerchantMsg).and.string(afterMsg)
      expect(loginStatus).to.equal(OK)
      expect(updated[0]).to.equal(1)
      expect(searchStatus).to.equal(OK)
      expect(new Date(newUpdatedAt)).to.be.afterTime(new Date(oldUpdatedAt))
    })

    it("When both new credentials are added and valid, then response is ok", async function () {
      const { newUsername, newPassword } = putUserNewCredentials
      const requestBody = {
        ...merchantCredentials,
        newUsername,
        newPassword,
      }
      const merchantId = 1
      const afterMsg = " has updated either/both their username or password."

      const { status, data } = await client.put(
        "/merchant/" + merchantId,
        requestBody,
        setHeaders
      )

      const { status: status1 } = await client.post("/login", {
        username: newUsername,
        password: newPassword,
      })

      expect(status).to.equal(OK)
      expect(data).to.include.string(preMerchantMsg).and.string(afterMsg)
      expect(status1).to.equal(OK)
    })
  })
})
