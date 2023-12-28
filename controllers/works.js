const { validationPerusal, integerValidator } = require("./validators")
const models = require("../database/models")
const { Api404Error } = require("../util/index").apiErrors
const { findWorkQuery } = require("../services/index").workServices

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

exports.getWorks = (req, res, next) => {
  const merchant = req.session.merchant
  const validInputs = ["name", "address"]

  try {
    validationPerusal(req)

    const inputs = createSubsetObject(req.body, validInputs)

    const query = parseWorkInputs(inputs)

    res.send()
  } catch (err) {
    next(err)
  }
}
