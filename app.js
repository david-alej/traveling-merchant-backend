const app = require("./server")

require("dotenv").config()

let server = ""

const initializeWebServer = () => {
  return new Promise((resolve) => {
    const PORT = process.env.PORT || 0

    server = app.listen(PORT, () => {
      const address = server.address()

      console.log(`Server is live at http://localhost:${address.port}`)

      console.log(
        `Swagger-ui is available on http://localhost:${address.port}/api-docs`
      )

      resolve(address)
    })
  })
}

const stopWebServer = () => {
  return new Promise((resolve) => {
    server.close(() => {
      resolve()
    })
  })
}

if (process.env.NODE_ENV !== "test") initializeWebServer()

module.exports = { initializeWebServer, stopWebServer }
