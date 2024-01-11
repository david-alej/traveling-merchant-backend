// "https://choosealicense.com/licenses/mit/"
// const crypto = require("node:crypto")
// console.log(crypto.randomBytes(48).toString("base64url"))
// "cross-env NODE_ENV=test nyc --reporter=html mocha ./test/main.js --testTimeout=10000 --exit"
const a =
  'SELECT "Orders"."id", "Orders"."providerId", "Orders"."cost", "Orders"."expectedDate", "Orders"."actualDate", "Orders"."createdAt", "Orders"."updatedAt", "provider"."id" AS "provider.id", "provider"."name" AS "provider.name", "provider"."address" AS "provider.address", "provider"."phoneNumber" AS "provider.phoneNumber", "provider"."createdAt" AS "provider.createdAt", "provider"."updatedAt" AS "provider.updatedAt", "waresBought"."id" AS "waresBought.id", "waresBought"."wareId" AS "waresBought.wareId", "waresBought"."orderId" AS "waresBought.orderId", "waresBought"."amount" AS "waresBought.amount", "waresBought"."cost" AS "waresBought.cost", "waresBought"."returned" AS "waresBought.returned", "waresBought"."createdAt" AS "waresBought.createdAt", "waresBought"."updatedAt" AS "waresBought.updatedAt" FROM "Orders" AS "Orders" LEFT OUTER JOIN "Providers" AS "provider" ON "Orders"."providerId" = "provider"."id" LEFT OUTER JOIN "OrdersWares" AS "waresBought" ON "Orders"."id" = "waresBought"."orderId" WHERE "Orders"."id" = \'1\''
console.log(a)
