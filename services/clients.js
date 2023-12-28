const models = require("../database/models")
const { Op, Sequelize } = require("sequelize")

const createDateQuery = (input, object) => {
  const inputName = Object.keys(object).filter(
    (key) => object[String(key)] === input
  )[0]

  input = new Date(input)

  object[String(inputName)][Op.and] = [
    Sequelize.where(
      Sequelize.fn("MONTH", Sequelize.col("Clients".inputName)),
      input.getMonth() + 1
    ),
    Sequelize.where(
      Sequelize.fn("YEAR", Sequelize.col("Clients".inputName)),
      input.getFullYear()
    ),
  ]
}

const createStringQuery = (input, object) => {
  const inputName = Object.keys(object).filter(
    (key) => object[String(key)] === input
  )[0]

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

exports.findClientsQuery = (inputsObject) => {
  let { fullname, address, createdAt, updatedAt } = inputsObject

  if (createdAt) createDateQuery(createdAt, inputsObject)
  if (updatedAt) createDateQuery(updatedAt, inputsObject)
  if (fullname) createStringQuery(fullname, inputsObject)
  if (address) createStringQuery(address, inputsObject)

  return {
    where: inputsObject,
    include: [{ ...ticketsInclusion, limit: 1 }, workInclusion],
  }
}
