/* eslint-disable no-useless-escape */

const { Op, Sequelize } = require("sequelize")
const { matchedData } = require("express-validator")
const { validationPerusal } = require("./validators")

const createDateQuery = (inputName, input, object) => {
  input = new Date(input)

  delete object[String(inputName)]

  if (object[Op.and]) {
    object[Op.and].push(
      Sequelize.fn(
        `EXTRACT(MONTH from \"Clients\".\"${inputName}\") =`,
        input.getMonth() + 1
      ),
      Sequelize.fn(
        `EXTRACT(YEAR from \"Clients\".\"${inputName}\") =`,
        input.getFullYear()
      )
    )

    return
  }

  object[Op.and] = [
    Sequelize.fn(
      `EXTRACT(MONTH from \"Clients\".\"${inputName}\") =`,
      input.getMonth() + 1
    ),
    Sequelize.fn(
      `EXTRACT(YEAR from \"Clients\".\"${inputName}\") =`,
      input.getFullYear()
    ),
  ]
}

const createStringQuery = (inputName, input, object) => {
  object[String(inputName)] = { [Op.iLike]: "%" + input + "%" }
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
  parseInputs: async (
    req,
    afterMsgOnly = false,
    includeOptions = [],
    orderOptions = []
  ) => {
    validationPerusal(req)

    const inputNames = Object.keys(matchedData(req))

    if (Object.keys(req.params).includes(inputNames[0])) {
      inputNames.shift()
    }

    if (inputNames.length === 0) {
      return {
        query: { include: includeOptions, order: orderOptions },
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

      if (!afterMsgOnly) {
        if (lastTwoChar === "At") {
          createDateQuery(inputName, input, inputsObject)
        } else if (lastTwoChar !== "Id") {
          createStringQuery(inputName, input, inputsObject)
        }
      }
    }

    return {
      query: {
        where: inputsObject,
        include: includeOptions,
        order: orderOptions,
      },
      afterMsg,
      inputsObject,
    }
  },
}
