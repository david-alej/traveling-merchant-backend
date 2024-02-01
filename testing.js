// "https://choosealicense.com/licenses/mit/"
// const crypto = require("node:crypto")
// console.log(crypto.randomBytes(48).toString("base64url"))
// "cross-env NODE_ENV=test nyc --reporter=html mocha ./test/main.js --testTimeout=10000 --exit"

const unde = {
  const: 5,
  a: "a",
}

const five = unde.const

delete unde.const

console.log(five, unde)
