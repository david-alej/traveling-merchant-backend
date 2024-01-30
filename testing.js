// "https://choosealicense.com/licenses/mit/"
// const crypto = require("node:crypto")
// console.log(crypto.randomBytes(48).toString("base64url"))
// "cross-env NODE_ENV=test nyc --reporter=html mocha ./test/main.js --testTimeout=10000 --exit"
const str =
  // eslint-disable-next-line quotes
  `SELECT \"id\", \"name\", \"type\", \"tags\", \"unitPrice\", \"createdAt\", \"updatedAt\", (\n            SELECT\n              \"OrdersWares\".\"amount\" + \"WaresTickets\".\"returned\" - \"OrdersWares\".\"returned\" - \"WaresTickets\".\"amount\"\n            FROM\n              \"OrdersWares\"\n            LEFT OUTER JOIN\n              \"WaresTickets\" ON \"OrdersWares\".\"wareId\" = \"WaresTickets\".\"wareId\"\n            WHERE\n              \"OrderWares\".\"wareId\" = \"Wares\".\"id\"\n            ORDER BY\n              \"OrdersWares\".\"amount\",\n              \"WaresTickets\".\"returned\",\n              \"OrdersWares\".\"returned\",\n              \"WaresTickets\".\"amount\"\n          ) AS \"stock\" FROM `

console.log(str.slice(400))
