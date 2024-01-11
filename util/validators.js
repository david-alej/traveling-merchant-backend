/* eslint-disable quotes */
const { body, param } = require("express-validator")
const { Api400Error } = require("./apiErrors")
const { validationResult } = require("express-validator")

const sentenceCase = (camelCase) => {
  const result = camelCase.replace(/([A-Z])/g, " $1")
  return result[0].toUpperCase() + result.substring(1).toLowerCase()
}

const basicCredentialValidator = (
  input,
  inputIsParam = false,
  optional = false
) => {
  const inputName = sentenceCase(input)
  let requestProperty = inputIsParam ? param : body
  let head = requestProperty(input)

  if (!inputIsParam) {
    if (optional) {
      head = head.optional({ nullable: true, checkFalsy: true })
    }

    head = head.notEmpty().withMessage(inputName + " must not be empty.")
  }

  return head.custom((value) => {
    if (value.includes(" ")) {
      throw new Error(inputName + " must no have any blank spaces.")
    }
    return true
  })
}

const usernameValidator = (
  input = "username",
  inputIsParam = false,
  optional = false
) => {
  const inputName = sentenceCase(input)
  const head = basicCredentialValidator(input, inputIsParam, optional)
  return head
    .isLength({ min: 4, max: 20 })
    .withMessage(
      inputName + " must be at least 4 characters and at most 20 characters."
    )
}

exports.usernameValidator = usernameValidator

const passwordValidator = (
  input = "password",
  inputIsParam = false,
  optional = false
) => {
  const inputName = sentenceCase(input)
  const head = basicCredentialValidator(input, inputIsParam, optional)

  return head
    .isLength({ min: 8, max: 20 })
    .withMessage(
      inputName + " must be at least 8 characters and at most 20 characters."
    )
    .matches("[0-9]")
    .withMessage(inputName + " must contain a number.")
    .matches("[A-Z]")
    .withMessage(inputName + " must contain an uppercase letter.")
}

exports.passwordValidator = passwordValidator

const basicValidator = (input, inputIsParam = false, optional = false) => {
  const inputName = sentenceCase(input)
  const requestProperty = inputIsParam ? param : body
  let head = requestProperty(input)

  if (optional) {
    head = head.optional({ nullable: true, checkFalsy: true })
  }

  return { head, inputName }
}

const integerValidator = (input, inputIsParam = false, optional = false) => {
  const { head, inputName } = basicValidator(input, inputIsParam, optional)

  return head.isInt().withMessage(inputName + " must be an integer.")
}

exports.integerValidator = integerValidator

const floatValidator = (input, inputIsParam = false, optional = false) => {
  const { head, inputName } = basicValidator(input, inputIsParam, optional)

  return head
    .isFloat({ min: 0 })
    .withMessage(inputName + " must be an float number.")
}

exports.floatValidator = floatValidator

const textValidator = (input, inputIsParam = false, optional = false) => {
  const { head, inputName } = basicValidator(input, inputIsParam, optional)

  return head
    .trim()
    .notEmpty()
    .withMessage(inputName + " must not be empty.")
}

exports.textValidator = textValidator

const incrementValidator = (input) => {
  const { head } = basicValidator(input, false, false)

  return head.custom((voteValue) => {
    if (voteValue === 1 || voteValue === -1) return true

    throw new Error(
      `the voteValue in the request body object must either be -1 or 1.`
    )
  })
}

exports.incrementValidator = incrementValidator

const dateValidator = (input, inputIsParam = false, optional = false) => {
  const { head, inputName } = basicValidator(input, inputIsParam, optional)

  return head.custom((date) => {
    if (!isNaN(new Date(date))) return true

    throw new Error(`the given ${inputName} = ${date} is not a date.`)
  })
}

exports.dateValidator = dateValidator

const phoneNumberValidator = (
  input = "phoneNumber",
  inputIsParam = false,
  optional = false
) => {
  const { head, inputName } = basicValidator(input, inputIsParam, optional)

  return head
    .custom((phoneNumber) => {
      // all regex below are verified to be safe by
      // using npm package safe-regex
      const phoneNumberFormats = {
        parenthesis: /\([0-9]{3}\)[0-9]{3}-[0-9]{4}/,
        dashes: /[0-9]{3}-[0-9]{3}-[0-9]{4}/,
        E164: /[0-9]{10}/,
      }

      for (const format in phoneNumberFormats) {
        const isPhoneNumber =
          phoneNumberFormats[String(format)].test(phoneNumber)

        if (isPhoneNumber) return true
      }

      throw new Error(
        `the given ${inputName} = ${phoneNumber} is not a proper phone number.`
      )
    })
    .customSanitizer((phoneNumber) => {
      if (!phoneNumber) return phoneNumber

      return phoneNumber.replace(/\D/g, "")
    })
}

exports.phoneNumberValidator = phoneNumberValidator

exports.validationPerusal = (req) => {
  const validationError = validationResult(req).array({
    onlyFirstError: true,
  })[0]

  if (validationError) {
    throw new Api400Error(
      req.session.merchant.preMsg + " " + validationError.msg,
      "Bad input request."
    )
  }
}

exports.credentialsValidator = () => {
  return [usernameValidator(), passwordValidator()]
}

exports.newCredentialsValidator = () => {
  return [
    usernameValidator("newUsername", false, true),
    passwordValidator("newPassword", false, true),
  ]
}
