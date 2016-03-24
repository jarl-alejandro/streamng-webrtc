'use strict'

/* Dependencies */
const http = require("http")
const StreamingApp = require("./lib")

/* Constantes */
const port = process.env.PORT || 3000
const streaming = new StreamingApp()
const server = http.createServer()

server.listen(port)

server.on("request", streaming.app)
server.on("listening", onListening)


function onListening() {
  console.log(`Server started in http://localhost:${ port }`)
}
