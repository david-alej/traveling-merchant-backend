const { validationPerusal, integerValidator } =
  require("../util/index").validators
const models = require("../database/models")
const { Api404Error, Api500Error } = require("../util/index").apiErrors
const { findWorkQuery, parseWorkInputs } =
  require("../services/index").workServices
const { matchedData } = require("express-validator")

exports.paramWorkId = async (req, res, next, workId) => {
  const merchant = req.session.merchant

  try {
    await integerValidator("workId", true).run(req)

    validationPerusal(req)

    const searched = await models.Works.findOne({
      where: { id: workId },
      ...findWorkQuery,
    })

    if (!searched) {
      throw new Api404Error(
        merchant.preMsg + ` target work with id = ${workId} was not found`,
        "Work not found."
      )
    }

    req.targetWork = searched.dataValues

    next()
  } catch (err) {
    next(err)
  }
}

exports.getWork = (req, res) => res.send(req.targetWork)

exports.getWorks = async (req, res, next) => {
  const merchant = req.session.merchant
  const validInputs = ["name", "address"]

  try {
    validationPerusal(req)

    const { afterMsg, query } = await parseWorkInputs(req, validInputs)

    const searched = await models.Works.findAll(query)

    if (!searched) {
      throw new Api404Error(
        merchant.preMsg + " works were not found" + afterMsg,
        "Works not found."
      )
    }

    res.json(searched)
  } catch (err) {
    next(err)
  }
}

exports.postWork = async (req, res, next) => {
  const merchant = req.session.merchant
  const requiredInputs = ["name", "address", "phoneNumber"]

  try {
    validationPerusal(req)
    console.log(Object.keys(matchedData(req)))
    const { afterMsg, inputsObject: newWork } = await parseWorkInputs(
      req,
      requiredInputs,
      true
    )

    const { phoneNumber } = matchedData(req)

    if (phoneNumber) newWork.phoneNumber = phoneNumber

    const created = await models.Works.create(newWork)

    if (!created) {
      throw new Api500Error(
        merchant.preMsg + " create work query did not work" + afterMsg,
        "Internal server query error."
      )
    }

    res.status(201).send(merchant.preMsg + " work has been created.")
  } catch (err) {
    next(err)
  }
}

exports.putWork = (req, res, next) => {
  const merchant = req.session.merchant
  const validInputs = []
  try {
    validationPerusal(req)

    const { inputsObject: newValues } = parseWorkInputs(req, validInputs)
    res.send(merchant.preMsg)
  } catch (err) {
    next(err)
  }
}
