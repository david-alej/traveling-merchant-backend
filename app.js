const app = require("./server")

require("dotenv").config()

let server = ""

const initializeWebServer = () => {
  return new Promise((resolve) => {
    const PORT = process.env.PORT || 0

    const listener = app.listen(PORT, () => {
      const address = listener.address()

      console.log(`Server is live at https://localhost:${address.port}`)

      console.log(
        `Swagger-ui is available on https://localhost:${address.port}/api-docs`
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
