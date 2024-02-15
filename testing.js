// "https://choosealicense.com/licenses/mit/"
// const crypto = require("node:crypto")
// console.log(crypto.randomBytes(48).toString("base64url"))
// "cross-env NODE_ENV=test nyc --reporter=html mocha ./test/main.js --testTimeout=10000 --exit"

const str = "const all{word} = [\n" + "{content}" + "]\n" + "\n"

// console.log(JSON.stringify(str))

const models = require("./database/models")
console.log(Object.keys(models))
console.log(Object.keys(models.Clients))
console.log(Object.keys(models.Clients["tableAttributes"]))
