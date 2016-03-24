'use strict'

const IO = require("socket.io")

class SocketIo{

	constructor(config){
		config = config || {}

    const io = IO.listen(config.server)

		// io.on("connection", (socket) => {})

	}

}

module.exports = SocketIo