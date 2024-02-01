/* eslint-disable node/no-unpublished-require */
require("dotenv").config()
const http = require("node:http")

const axiosConfig = {
  baseURL: "http://localhost:",
  validateStatus: () => true,
}

axiosConfig.httpsAgent = new http.Agent({
  rejectUnauthorized: false,
})

const chai = require("chai")

const expect = chai.expect

chai.use(require("chai-json-schema"))
chai.use(require("chai-datetime"))

const { faker } = require("@faker-js/faker")

const fakerUsername = () => {
  const minLength = 4
  const maxLength = 20
  let username = faker.internet.userName()

  while (username.length < minLength || username.length > maxLength) {
    username = faker.internet.userName()
  }

  return username
}

const fakerPassword = () => {
  const minLength = 8
  const maxLength = 20
  const uppercaseRegex = /[A-Z]/
  const numberRegex = /\d/

  let password = faker.internet.password()

  while (
    password.length < minLength ||
    password.length > maxLength ||
    !uppercaseRegex.test(password) ||
    !numberRegex.test(password)
  ) {
    password = faker.internet.password()
  }

  return password
}

const fakerPhoneNumber = () => {
  // all regex below are verified to be safe by
  // using npm package safe-regex
  const phoneNumberFormats = [
    /([0-9]{3})[0-9]{3}-[0-9]{4}/,
    /[0-9]{3}-[0-9]{3}-[0-9]{4}/,
    /[0-9]{3}[0-9]{3}[0-9]{4}/,
  ]

  const phoneNumber = faker.helpers.fromRegExp(
    phoneNumberFormats[Math.floor(Math.random() * 3)]
  )
  return phoneNumber
}

const round = (number) => {
  return Math.round(number * 100) / 100
}

module.exports = {
  axios: require("axios"),
  axiosConfig,
  initializeWebServer: require("../app").initializeWebServer,
  stopWebServer: require("../app").stopWebServer,
  expect,
  faker,
  fs: require("fs"),
  fakerUsername,
  fakerPassword,
  fakerPhoneNumber,
  httpMocks: require("node-mocks-http"),
  httpStatusCodes: require("../util/index").httpStatusCodes,
  preMerchantMsg: "Merchant: 1",
  sinon: require("sinon"),
  merchantCredentials: {
    username: "missioneros",
    password: "nissiJire2",
  },
  models: require("../database/models"),
  round,
}
