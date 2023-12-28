/* eslint-disable no-useless-escape */
const models = require("../database/models")
const { Op, Sequelize } = require("sequelize")

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

const ticketsInclusion = {
  model: models.Tickets,
  as: "tickets",
  order: [["id", "DESC"]],
}

const workInclusion = {
  model: models.Works,
  as: "work",
}

exports.findClientQuery = {
  include: [workInclusion, ticketsInclusion],
}

exports.parseInputs = (inputsObject, afterMsgOnly = false) => {
  const numberOfInputs = Object.keys(inputsObject).length
  let afterMsg = numberOfInputs ? " with given " : "."
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
      include: [{ ...ticketsInclusion, limit: 1 }, workInclusion],
    },
    afterMsg,
  }
}
