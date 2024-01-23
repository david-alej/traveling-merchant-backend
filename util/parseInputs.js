/* eslint-disable no-useless-escape */

const { Op, Sequelize } = require("sequelize")
const { matchedData } = require("express-validator")
const models = require("../database/models")
const { validationPerusal } = require("./validators")

const createDateQuery = (inputName, input, whereOptions, tableName) => {
  input = new Date(input)

  if (whereOptions[Op.and]) {
    whereOptions[Op.and].push(
      Sequelize.fn(
        `EXTRACT(MONTH from \"${tableName}\".\"${inputName}\") =`,
        input.getMonth() + 1
      ),
      Sequelize.fn(
        `EXTRACT(YEAR from \"${tableName}\".\"${inputName}\") =`,
        input.getFullYear()
      )
    )

    return
  }

  whereOptions[Op.and] = [
    Sequelize.fn(
      `EXTRACT(MONTH from \"${tableName}\".\"${inputName}\") =`,
      input.getMonth() + 1
    ),
    Sequelize.fn(
      `EXTRACT(YEAR from \"${tableName}\".\"${inputName}\") =`,
      input.getFullYear()
    ),
  ]
}

const createStringQuery = (inputName, input, whereOptions) => {
  whereOptions[String(inputName)] = {
    [Op.iLike]: "%" + input + "%",
  }
}

const createSubsetObject = (obj, keys) => {
  return Object.fromEntries(
    keys
      .filter((key) => typeof obj[String(key)] !== "undefined")
      .map((key) => [key, obj[String(key)]])
  )
}

module.exports = {
  createSubsetObject,
  parseInputs: async (req, otherOptions, modelName) => {
    validationPerusal(req)

    const inputNames = Object.keys(matchedData(req))

    if (Object.keys(req.params).includes(inputNames[0])) {
      inputNames.shift()
    }

    if (inputNames.length === 0) {
      return {
        query: otherOptions,
        afterMsg: ".",
        inputsObject: {},
      }
    }

    const inputsObject = createSubsetObject(req.body, inputNames)

    if (inputsObject.phoneNumber) {
      inputsObject.phoneNumber = matchedData(req).phoneNumber
    }

    const numberOfInputs = Object.keys(inputsObject).length

    let afterMsg = " with given "

    let numberOfInputsLeft = numberOfInputs

    let whereOptions = {}

    for (let inputName in inputsObject) {
      const input = inputsObject[String(inputName)]

      const lastTwoChar = inputName.slice(-2)
      numberOfInputsLeft--

      if (numberOfInputs === 1) {
        afterMsg += `${inputName} = ${input}.`
      } else if (numberOfInputsLeft === 0) {
        afterMsg += `and ${inputName} = ${input}.`
      } else {
        afterMsg += `${inputName} = ${input}, `
      }

      if (lastTwoChar === "At") {
        createDateQuery(inputName, input, whereOptions, modelName)
      } else if (typeof input === "number") {
        whereOptions[String(inputName)] = input
      } else if (Array.isArray(input)) {
        whereOptions[String(inputName)] = { [Op.contains]: input }
      } else if (input === true) {
        otherOptions.order[0] = [models.Sequelize.col("owed"), "DESC"]
        const whereOptionsClone = structuredClone(whereOptions)
        whereOptions = {
          [Op.and]: [
            whereOptionsClone,
            models.Sequelize.literal(
              // eslint-disable-next-line quotes
              '(SELECT "Tickets"."cost" - COALESCE(SUM("payment"), 0) > 0 FROM "Transactions" WHERE "ticketId" = "Tickets"."id")'
            ),
          ],
        }
      } else {
        createStringQuery(inputName, input, whereOptions)
      }
    }

    return {
      query: {
        where: whereOptions,
        ...otherOptions,
      },
      afterMsg,
      inputsObject,
    }
  },
}
