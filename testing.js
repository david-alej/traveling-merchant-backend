// "https://choosealicense.com/licenses/mit/"
// const crypto = require("node:crypto")
// console.log(crypto.randomBytes(48).toString("base64url"))
// "cross-env NODE_ENV=test nyc --reporter=html mocha ./test/main.js --testTimeout=10000 --exit"
const { passwordHash } = require("./util/index").passwordHash
console.log(passwordHash)
const password = "nissiJire2"

const logHash = async () => {
  const hash = await passwordHash(password, 10)

  console.log(hash)
}

logHash()
